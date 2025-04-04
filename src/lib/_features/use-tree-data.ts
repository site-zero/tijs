import _ from "lodash";
import { ref } from "vue";
import { isTableRowID, RowIndentStatus, TableRowID, Vars } from "../../_type";
import { Match } from "../../core";


/**
 * 这个特性用来封装对于树型数据的操作
 * 
 * ### 输入的数据有两种可能
 * 
 * 1. 列表型数据
 * 2. 树型数据(通过类似 children 属性构建的节点）必须有根节点
 * 
 * 通过属性 `groupBy` 本模块可以将列表数据重组为树型数据。
 * 以便后续逻辑统一处理
 * 
 * ### 本模块提供下面的对于树型数据的操作:
 * 
 * - 写操作
 *     + 删除指定节点
 *     + 插入某个节点
 *     + 更新节点信息
 *     + 移动某个节点
 * - 读操作
 *     + 获取一个指定节点
 *     + 获取一个节点全部的祖先
 *     + 获取一个节点全部的子
 *     + 获取子树数据集合
 * - 遍历操作
 *     + 遍历(深度优先)根据条件挑选数据
 *     + 遍历列表挑选数据
 * - 数据转换
 *     + 将数据扁平化为一个列表
 *     + 将数据树型化，返回数据的根节点
 * - 构建操作
 *     + 根据传入的数据（列表或节点）构建树型数据
 * 
 * ### 详细设计
 * 
 * 我们通过 `props` 属性，期望得到下面的信息
 * 
 * 1. 树的原始数据是什么? 
 *     - 每个节点的 ID 如何获取
 *     - 如何判断一个节点是否是叶子节点
 * 2. 如果是列表，如何组织为一个树
 * 3. 如果组织不出一个根节点，虚拟根节点怎么创建
 * 
 * 通过这些输入，我们会构建下面的数据模型:
 * 
 * 1. 一个由节点 ID 构成的 `{id,  children?, leaf}` 的树型关系
 * 2. 一个 `Map<id, {...}>` 记录所有节点的详细数据
 * 
 * ### 其他说明
 * 
 * 本模块假想树一定有一个根节点，对于传入列表型数据
 * 如果最后归纳完毕，发现并不能归一为一个根节点，那么它
 * 就会为所有的顶层节点创建一个根节点。
 * 
 * 当然你也可以指定一个固定的虚拟根节点，在扁平化的时候
 * 这个虚拟的根节点不会被包含到结果中去。
 * 
 */
export type TreeDataProps = {

    /**
     * 判断一个数据行是否是叶子节点。
     * 
     * - `Vars|Vars[]` : 一组 AutoMatch 的判断条件
     * - `Function`: 自定义判断
     * 
     * 判断的上下文为 `{hie,data}` @see type NodeTestPayload
     * 
     * 如果不指定，那么所有的数据行都不是叶子节点
     */
    isLeafNode?: Vars | Vars[] | ((payload: NodeTestPayload) => boolean);

    /**
     * 判断节点默认是否是打开状态，每次构建树都会调用一次。
     * 
     * - `number` 指定只有小于给定深度级别的才打开。
     *      + `0` 表示根节点是关闭的
     *      + `1` 根节点打开，第一层节点是关闭的
     *      +  ... 以此类推
     * - `Vars|Vars[]` : 一组 AutoMatch 的判断条件
     * - `Function`: 自定义判断
     * 
     * 判断的上下文为 `{hie,data}` @see type NodeTestPayload
     * 
     * @default `1` - 仅仅打开根节点
     */
    isNodeOpen?: number | Vars | Vars[] | ((payload: NodeTestPayload) => boolean);

    /**
     * 如果是树的根节点，如何从树中获取子节点。
     * 默认为 `children`
     */
    childrenKey?: string

    /**
     * 与 `use-selectable` 的 `getId` 不同，
     * 这个配置无需考虑自动根据 index 生成 ID 的场景。
     * 使用者在控件组合时，需要考虑自行适配
     */
    getNodeId?: string | ((data: Vars) => TableRowID | undefined)

    /**
     * 如何通过一个数据行，获取它所在父节点的 ID
     * 这个属性是吧列表数据组织为树型数据的关键
     * 
     * 如果未指定，则所有节点都会从属与一个虚根节点
     */
    getParntNodeId?: string | ((data: Vars) => TableRowID | undefined)

    /**
     * 指明一个虚拟的根节点，当然，只有在树型化时，无法归总一个根节点
     * 时才会启用它
     * 
     * - `TableRowID` : 根节点的 ID
     * - `Vars` : 完备信息的根节点， ID 由 `getNodeId` 取得。
     * 如果未定义, 那么就采用一个固定的值 `%VIRTUAL-ROOT%`
     */
    virtualRootNode?: TableRowID | Vars;

    /**
     * 是否强制使用虚拟根节点。
     * 
     * 默认的情况，只有在列表模式下，无法归纳为一个根节点时，才会使用虚拟根节点。
     * 
     *  - `"list"` : 在列表模式下，强制使用虚拟根节点
     *  - `"node"` : 在节点模式下，强制使用虚拟根节点
     *  - `"both"` : 无论如何都强制使用虚拟根节点
     *  - `null` : 默认模式，即，不强制使用虚拟根节点，
     *                  仅在有必要的时候才会使用虚拟根节点
     */
    forceUseVirtualRoot?: 'list' | 'node' | 'both' | null;
}



type HierarchyNode = {
    id: TableRowID;
    // 虚的，就表示在 nodes 表里没有记录
    virtual?: boolean;
    // 叶子节点，就表示肯定没有 children，否则肯定有 children
    // 即使是 `[]`
    leaf?: boolean;
    // 在本层的下标， 0base
    index: number;
    // 根节点为 0 ，顶层节点为 1， 以此类推
    depth: number;
    parentId?: TableRowID;
    // 如果 leaf == true 则 children 肯定为 undefined
    // 否则肯为未数组
    children?: TableRowID[];
}

type BuildResult = {
    rootId: TableRowID;
    hierarchy: Map<TableRowID, HierarchyNode>,
    nodes: Map<TableRowID, Vars>,
}

export type NodeTestPayload = {
    hie: HierarchyNode,
    data: Vars,
}

/**
 * 遍历树的节点
 * 
 * @param hie 当前节点的层级信息
 * @param data 当前节点的数据
 * @param walkDepth 当前遍历的深度
 * @param walkIndex 当前遍历的下标
 * 
  * @return 'down' | 'next' | 'stop', 默认为 'down'
 * 
 */
export type TreeWalking = (hie: HierarchyNode, data: Vars, walkDepth: number, walkIndex: number) => undefined | void | TreeWalkAction;

/**
* - `"down"`: 继续遍历自己的子节点,对于叶子节点，相当于 'next'
* - `"next"`: 跳过当前节点，继续遍历同层下一个节点
* - `"stop"`: 完全停止遍历，直接退出
* - `undefined` 默认采用 'yes'
*/
export type TreeWalkAction = 'down' | 'next' | 'stop';

/**
 * 扁平化树的回调
 * 
 * @param hie 当前节点的层级信息
 * @param data 当前节点的数据
 * 
 * @return 'down' | 'next' | 'stop', 默认为 'down'
 */
export type TreeFlattenFilter = (hie: HierarchyNode, data: Vars, results: Vars[]) => undefined | TreeWalkAction;

/**
 * 组织树型数据的回调
 * 
 * @param hie 当前节点的层级信息
 * @param data 当前节点的数据
 * 
 * @return 'self' | 'all' | 'ignore', 默认为 'all'
* - `self`: 只保留自己，忽略子节点
* - `all`: 保留自己以及自己全部子节点
* - `ignore`: 忽略这个节点，也忽略全部子节点

 */
export type TreeDataFilter = (hie: HierarchyNode, data: Vars) => 'self' | 'all' | 'ignore';

export function useTreeData(props: TreeDataProps) {
    const _children_key = props.childrenKey || 'children';

    // 获取 ID 
    let getNodeId: (data: Vars) => TableRowID | undefined;
    if (_.isString(props.getNodeId)) {
        let key = props.getNodeId;
        getNodeId = (data: Vars) => _.get(data, key)
    } else if (props.getNodeId) {
        getNodeId = props.getNodeId
    } else {
        getNodeId = ((data: Vars) => data.id ?? data.value)
    }



    // 获取父节点 ID
    let getParntNodeId: (data: Vars) => TableRowID | undefined;
    if (_.isString(props.getParntNodeId)) {
        let key = props.getParntNodeId;
        getParntNodeId = (data: Vars) => _.get(data, key)
    } else if (props.getParntNodeId) {
        getParntNodeId = props.getParntNodeId
    } else {
        getParntNodeId = ((data: Vars) => data.parentId ?? data.pid)
    }

    // 判断是否是叶子节点
    let isLeafNode: (payload: NodeTestPayload) => boolean;
    if (_.isFunction(props.isLeafNode)) {
        isLeafNode = props.isLeafNode
    } else if (!_.isNil(props.isLeafNode)) {
        let am = Match.parse(props.isLeafNode);
        isLeafNode = (payload) => am.test(payload)
    } else {
        isLeafNode = ({ hie }) => {
            return !hie.children || hie.children.length == 0
        }
    }

    // 判断节点是否打开
    let isNodeOpen: ((payload: NodeTestPayload) => boolean);
    if (_.isFunction(props.isNodeOpen)) {
        isNodeOpen = props.isNodeOpen
    } else if (_.isNumber(props.isNodeOpen) || _.isNil(props.isNodeOpen)) {
        let the_depth = props.isNodeOpen ?? 1
        isNodeOpen = (payload) => payload.hie.depth < the_depth;
    } else if (!_.isNil(props.isNodeOpen)) {
        let am = Match.parse(props.isNodeOpen);
        isNodeOpen = (payload) => am.test(payload)
    } else {
        isNodeOpen = (payload) => payload.hie.leaf ? false : true;
    }

    // 虚拟根节点
    let _vir_root: HierarchyNode;
    if (isTableRowID(props.virtualRootNode)) {
        _vir_root = {
            id: props.virtualRootNode,
            virtual: true,
            leaf: false,
            index: 0,
            depth: 0,
            children: []
        }
    } else {
        let nodeId = (props.virtualRootNode ? getNodeId(props.virtualRootNode) : undefined) || '%VIRTUAL-ROOT%';
        _vir_root = {
            ...props.virtualRootNode,
            id: nodeId,
            virtual: true,
            leaf: false,
            index: 0,
            depth: 0,
            children: []
        }
    }

    //-----------------------------------------------------
    // 数据结构
    //-----------------------------------------------------
    const _tree = ref<BuildResult>({
        rootId: '???',
        hierarchy: new Map<TableRowID, HierarchyNode>(),
        nodes: new Map<TableRowID, Vars>(),
    })
    const _node_status = ref(new Map<TableRowID, RowIndentStatus>());

    //-----------------------------------------------------
    // 节点状态
    //-----------------------------------------------------
    function toggleNodeStatus(id: TableRowID) {
        let st = _node_status.value.get(id);
        if (_.isNil(st)) {
            return;
        }
        let newSt = {
            'open': 'closed',
            'closed': 'open'
        }[st] as RowIndentStatus;
        _node_status.value.set(id, newSt);
    }

    function getNodeStatus() {
        return _node_status.value;
    }

    //-----------------------------------------------------
    // 写操作
    //-----------------------------------------------------
    function clear() {
        _tree.value = {
            rootId: '???',
            hierarchy: new Map<TableRowID, HierarchyNode>(),
            nodes: new Map<TableRowID, Vars>(),
        }
    }

    function removeNode(nodeId: TableRowID) {
        let hie = _tree.value.hierarchy.get(nodeId);
        if (!hie) {
            return
        }
        // 从自己父节点中删除
        let phie = hie.parentId ? _tree.value.hierarchy.get(hie.parentId) : undefined;
        if (phie && phie.children) {
            phie.children = _.without(phie.children, nodeId);
        }

        // 删除层级关系
        _tree.value.hierarchy.delete(nodeId);

        // 删除节点数据
        _tree.value.nodes.delete(nodeId);
    }

    //-----------------------------------------------------
    // 读操作
    //-----------------------------------------------------
    function getSelf(nodeId: TableRowID) {
        return _tree.value.nodes.get(nodeId);
    }

    function getAncestors(nodeId: TableRowID): Vars[] {
        let re: Vars[] = [];
        let hie = _tree.value.hierarchy.get(nodeId);
        if (!hie) {
            return re;
        }
        while (hie.parentId) {
            let parent = _tree.value.hierarchy.get(hie.parentId);
            if (!parent) {
                break;
            }
            let data = _tree.value.nodes.get(hie.parentId);
            if (data) {
                re.unshift(data);
            }
            hie = parent;
        }
        return re;
    }

    function getChildren(nodeId: TableRowID): Vars[] {
        let re: Vars[] = [];
        let hie = _tree.value.hierarchy.get(nodeId);
        if (!hie || hie.leaf || !hie.children) {
            return re;
        }

        for (let cid of hie.children) {
            let data = _tree.value.nodes.get(cid);
            if (data) {
                re.push(data);
            }
        }
        return re;
    }



    //-----------------------------------------------------
    // 遍历操作
    //-----------------------------------------------------
    function walkDFS(callback: TreeWalking, startNodeId?: TableRowID, tr?: BuildResult) {
        let tree = tr ?? _tree.value;
        let id = startNodeId ?? tree.rootId;
        // 防空
        if (_.isNil(id)) {
            return
        }
        // 准备递归遍历逻辑
        const _walk = (nodeId: TableRowID, walkDepth: number, walkIndex: number) => {
            // 层级关系
            let hie = tree.hierarchy.get(nodeId);
            if (!hie) {
                console.trace('Can not find hierarchy node:', nodeId);
                throw new Error('Can not find hierarchy node:' + nodeId);
            }
            // 节点数据，如果是虚节点，那么就弄个空数据
            let data = hie.virtual ? {} : tree.nodes.get(nodeId);
            if (!data) {
                console.trace('Can not find data node:', nodeId);
                throw new Error('Can not find data node:' + nodeId);
            }
            // 调用回调
            let act: TreeWalkAction = callback(hie, data, walkDepth, walkIndex) ?? 'down';

            // 退出
            if ('stop' == act) {
                throw 'stop';
            }

            // 递归子节点: 也就是说，回调必须返回 'down' 才会进入子节点
            if (!hie.leaf && 'down' == act) {
                let children = hie.children;
                if (!children) {
                    console.trace('Non-leaf node must has children:', hie);
                    throw new Error('Non-leaf node must has children:' + JSON.stringify(hie));
                }
                for (let i = 0; i < children.length; i++) {
                    let childId = children[i];
                    _walk(childId, walkDepth + 1, i);
                }
            }
        }

        // 
        try {
            _walk(id, 0, 0);
        } catch (err) {
            // 正常结束
            if ("stop" == err) {
                return;
            }
            throw err;
        }

    }
    //-----------------------------------------------------
    // 数据转换
    //-----------------------------------------------------
    function getFlattenData(filter?: TreeFlattenFilter): Vars[] {
        if (!filter) {
            filter = (hie, data, re) => {
                //console.log(hie.id, hie)
                if (!hie.virtual) {
                    re.push(data);
                }
                if (hie.leaf) {
                    return 'next';
                }
                if ("open" == _node_status.value.get(hie.id)) {
                    return 'down';
                }
                return 'next';
            }
        }
        let re: Vars[] = [];
        walkDFS((hie, data) => filter(hie, data, re));
        return re;
    }

    function getTreeIndents() {
        // 如果树的根节点为虚节点，那么显然需要将所有的节点
        // 的 depth 减 1，这样绘制的时候， indent 块数量才能
        // 贴合实际
        let startDepth = 0
        let tree = _tree.value
        let root = tree.hierarchy.get(tree.rootId)
        if (root?.virtual) {
            startDepth = 1;
        }
        // 收集每个节点的缩进数量
        let indents = new Map<TableRowID, number>();
        walkDFS((hie) => {
            indents.set(hie.id, hie.depth - startDepth);
        })
        return indents;
    }

    function getTreeData(filter?: TreeDataFilter, nodeId?: TableRowID) {
        // 默认的过滤器，全都要
        if (!filter) {
            filter = () => 'all';
        }
        // 准备一个递归逻辑
        let tree = _tree.value;
        const _make_tree_data = (nodeId: TableRowID): Vars | undefined => {
            let hie = tree.hierarchy.get(nodeId);
            if (!hie) {
                console.warn('Can not find hierarchy node:', nodeId);
                return;
            }
            let data: Vars | undefined;
            // 虚节点
            if (hie.virtual) {
                data = {}
                data.id = tree.rootId;
            }
            // 真实节点
            else {
                data = tree.nodes.get(nodeId);
                if (!data) {
                    console.trace('Can not find data node:', nodeId, hie);
                    return;
                }
            }
            // 无视这个节点
            let act = filter(hie, data);
            if ('ignore' == act) {
                return undefined;
            }
            // 仅仅添加自己
            let re = _.cloneDeep(data);
            if ('self' == act) {
                return re;
            }

            // 添加自己和所有子节点
            if (!hie.leaf && hie.children) {
                let children: Vars[] = [];
                for (let childId of hie.children) {
                    let child = _make_tree_data(childId);
                    if (child) {
                        children.push(child);
                    }
                }
                re[_children_key] = children;
            }
            return re;
        }

        // 默认从根节点开始构建
        return _make_tree_data(nodeId ?? tree.rootId);
    }

    //-----------------------------------------------------
    // 构建数据
    //-----------------------------------------------------
    /**
     * @param data: 树的原始数据，支持下面两种形式:
     *  - `Vars`: 树的根节点
     *  - `Vars[]`: 列表型数据
     */
    function buildTree(data: Vars | Vars[]) {
        // 准备要构建的数据
        const re = {
            rootId: '???',
            hierarchy: new Map<TableRowID, HierarchyNode>(),
            nodes: new Map<TableRowID, Vars>(),
        }

        // 从列表构建
        if (_.isArray(data)) {
            buildTreeFromList(data, re);
        }
        // 从根节点构建
        else {
            buildTreeFromRoot(data, re);
        }

        // 深度优先遍历更新叶子节点状态
        const nd_status = new Map<TableRowID, RowIndentStatus>();
        walkDFS((hie, data, depth, index) => {
            hie.index = index;
            hie.depth = depth;
            hie.leaf = isLeafNode({ hie, data })
            if (hie.leaf) {
                if (!_.isEmpty(hie.children)) {
                    console.warn('Tree Leaf Node has children:', _.cloneDeep(hie))
                }
                hie.children = undefined
            }
            // 对于中间节点，判断初始的打开状态
            else {
                let is_open = isNodeOpen({ hie, data })
                nd_status.set(hie.id, is_open ? 'open' : 'closed');
            }
        }, re.rootId, re)

        // 更新状态
        _tree.value = re;
        _node_status.value = nd_status;
    }

    function buildTreeFromList(data: Vars[], re: BuildResult) {
        // 准备一个顶层节点列表，随后会分析它，如果有多个，则需要创建虚拟节点
        let tops = new Map<TableRowID, HierarchyNode>();

        // 循环所有的节点，构建层级关系，与详细数据
        for (let meta of data) {
            // 初次构建，因此 depth 与 index 都是 -1
            let hie = _gen_hierarchy(meta);
            if (_.isNil(hie.id)) { continue; }

            // 计入详细数据
            re.nodes.set(hie.id, _.omit(meta, _children_key));

            // 将自己计入层级关系
            if (!re.hierarchy.has(hie.id)) {
                re.hierarchy.set(hie.id, hie);
            }

            // 没有父节点的话，就认为是顶层节点
            if (_.isNil(hie.parentId)) {
                if (!tops.has(hie.id)) {
                    tops.set(hie.id, hie);
                }
            }
            // 如果有父 ID ，那么就需要加入到父节点的 children 中
            else {
                let parent = re.hierarchy.get(hie.parentId);
                // 加入它的子
                if (parent) {
                    if (!parent.children) {
                        console.trace('Parent node children array not defined', parent);
                        throw new Error('Parent node children array not defined: ' + JSON.stringify(parent));
                    }
                    parent.children.push(hie.id);
                }
                // 如果不存在这个 ParentId 就创建一个
                else {
                    re.hierarchy.set(hie.parentId, {
                        id: hie.parentId,
                        leaf: false,
                        index: -1,
                        depth: -1,
                        children: [hie.id]
                    })
                }
            }
        }

        // 检查一下所有的顶层节点，如果超过1个，就都归纳入一个虚拟根节点
        // 当然，如果用户强制指定必须采用虚根，即使一个也加入
        if (tops.size > 1 || /^(list|both)$/.test(props.forceUseVirtualRoot ?? '')) {
            re.hierarchy.set(_vir_root.id, {
                ..._vir_root,
                children: [...tops.keys()]
            });
            re.rootId = _vir_root.id;
        }
        // 否则就用这个顶层节点作为根节点
        else {
            re.rootId = tops.keys().next().value!;
        }
    }

    function buildTreeFromRoot(data: Vars, re: BuildResult) {
        // 准备一个可递归的构建方法
        const _build_node = (index: number, meta: Vars, depth: number, pid?: TableRowID): HierarchyNode => {
            // 开始构建层级关系
            let hie = _gen_hierarchy(meta, pid);

            // 保存节点信息
            re.nodes.set(hie.id, _.omit(meta, _children_key));

            let sub_ids: TableRowID[] | undefined = undefined;
            // 递归子节点
            let children = _.get(meta, _children_key) as Vars[];
            _.forEach(children, (childData, index) => {
                let child = _build_node(index, childData, depth + 1, hie.id);
                sub_ids!.push(child.id);
            })

            // 准备本次构建的层级
            hie.index = index;
            hie.depth = depth;
            hie.children = sub_ids;
            re.hierarchy.set(hie.id, hie);

            // 搞定返回
            return hie;
        }

        // 开始调用
        let root: HierarchyNode = _build_node(0, data, 0);

        // 强制采用虚拟根节点
        if (/^(node|both)$/.test(props.forceUseVirtualRoot ?? '')) {
            re.hierarchy.set(_vir_root.id, _vir_root);
            root = _build_node(0, data, 1, _vir_root.id);
        }
        // 采用默认的根节点
        else {
            root = _build_node(0, data, 0);
        }

        // 更新根节点
        re.rootId = root.id;
    }

    function _gen_hierarchy(meta: Vars, pid?: TableRowID): HierarchyNode {
        // 获取 ID
        let id = getNodeId(meta)
        if (!isTableRowID(id)) {
            console.trace('Can not get ID from data:', meta);
            throw new Error('Can not get ID from data');
        }
        // 获取节点信息
        pid = pid ?? getParntNodeId(meta);

        // 保存节点信息
        return {
            index: -1, depth: -1,
            id,
            parentId: pid,
            children: []
        }
    }

    //-----------------------------------------------------
    // 输出接口
    //-----------------------------------------------------
    return {
        // 节点状态
        getNodeStatus,
        toggleNodeStatus,

        // 写操作
        clear,
        removeNode,

        // 读操作
        getSelf,
        getAncestors,
        getChildren,

        // 遍历操作
        walkDFS,

        // 数据转换
        getFlattenData,
        getTreeIndents,
        getTreeData,

        // 构建数据
        buildTree,
    }
}