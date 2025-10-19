import _ from "lodash";
import { Node } from "prosemirror-model";
import { Selection } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { computed, ref, Ref } from "vue";
import { IconInput, Vars } from "../../../../../_type";
import { getNodeIcon } from "./doc-tree-node-icons";

export type DocTreeSelection = {
  from: number;
  to: number;
};

export type DocTreeNode = {
  id: string;
  parentId: string | null;
  name: string;
  leaf: boolean;
  from: number;
  to: number;
  depth: number;
  /**
   * 节点内容长度
   */
  size: number;
  /**
   * 块节点大纲级别
   * - 0: 正文
   * - 1-6: 大纲级别 H1 ~ H6
   */
  level: number;
  attrs: Vars;
  marks: string[];
  icon?: IconInput;
  text?: string;
  tip?: string;
};

export type EditorDocTreeApi = ReturnType<typeof useEditorDocTree>;

export function useEditorDocTree(getView: () => EditorView | undefined) {
  //-----------------------------------------------------
  const _doc_tree_nodes = ref<DocTreeNode[]>([]);
  const _doc_raw_nodes = new Map<string, Node>();
  //-----------------------------------------------------
  const DocTreeNodeMap = computed(() => {
    const map = new Map<String, DocTreeNode>();
    for (let nd of _doc_tree_nodes.value) {
      map.set(nd.id, nd);
    }
    return map;
  });
  //-----------------------------------------------------
  function getTreeNode(nodeId: string | undefined | null) {
    if (nodeId) {
      return DocTreeNodeMap.value.get(nodeId);
    }
  }
  //-----------------------------------------------------
  function getTreeNodes(nodeIds: string[]) {
    let re: DocTreeNode[] = [];
    for (let nodeId of nodeIds) {
      let nd = DocTreeNodeMap.value.get(nodeId);
      if (nd) {
        re.push(nd);
      }
    }
    return re;
  }

  /**
   * 根据指定的 pos，从 _doc_tree_nodes 里用二分法查找节点。
   * 查找的方式，利用 DocTreeNode.from 属性，寻找到最靠近 pos 的那个节点
   * 即 `(from - pos) >= 0` 且为值最小的节点
   * @param pos 节点参考位置
   */
  function findNodeByPos(pos: number) {
    // 防空
    let view = getView();
    if (!view) return null;

    // 准备节点列表
    let nodes = _doc_tree_nodes.value ?? [];
    let left = 0;
    let right = nodes.length - 1;
    let result: DocTreeNode = nodes[0];

    // console.log(
    //   "begin result:>",
    //   `{${result.from}~${result.to},depth=${result.depth}}`,
    //   result.name
    // );

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const node = nodes[mid];
      // console.log(
      //   [
      //     `[L=${left},R:${right}]=>pos:${pos}=>nodes[${mid}]`,
      //     `{${node.from}~${node.to},depth=${node.depth}}`,
      //     node.name,
      //   ].join(" ")
      // );
      // 节点包括这个位置
      if (node.from <= pos && node.to > pos) {
        // 节点范围小于初始化返回，证明这个节点比初始节点更具体
        // 因此缩小这个节点范围
        if (
          node.from >= result.from &&
          node.to <= result.to &&
          node.depth > result.depth
        ) {
          result = node;
          // console.log(
          //   " >> set result=> ",
          //   `{${node.from}~${node.to},depth=${node.depth}}`,
          //   node.name
          // );
        }
        // 否则，就没有必要改变之前选中的节点，因为它更具体
        // 接下来查找 给定节点后面的部分
        left = mid + 1;
      }
      // 位置在给定节点之前
      else if (pos < node.from) {
        right = mid - 1;
      }
      // 位置在给定节点之后
      else if (pos >= node.to) {
        left = mid + 1;
      }
      // 不可能
      else {
        throw "Impossiable!!!";
      }
    }
    return result;
  }

  /**
   * 获取指定节点的所有祖先节点数组（不包括自己）
   *
   * @param node 要查找祖先节点的文档树节点
   * @returns 祖先节点数组，按从根节点到直接父节点的顺序排列
   */
  function getNodeAncestors(node?: DocTreeNode | null | undefined) {
    let re: DocTreeNode[] = [];
    if (!node) {
      return [_doc_tree_nodes.value[0]];
    }
    let nd: DocTreeNode | undefined | null = getTreeNode(node.parentId);
    while (nd) {
      re.push(nd);
      nd = getTreeNode(nd.parentId);
    }
    return re.reverse();
  }
  //-----------------------------------------------------
  /**
   * 更新文档树的根节点。
   * 该函数根据给定的选区和已选中的节点 ID 列表，递归遍历文档节点，
   * 重新构建文档树数据，并更新选中的节点 ID 列表。
   *
   * @param selection - ProseMirror 的选区对象，包含选区的起始和结束位置。
   * @param _checked_node_ids - 一个响应式引用，存储已选中的节点 ID 列表。
   */
  function updateTree(
    selection?: Selection,
    _checked_node_ids?: Ref<string[]>
  ) {
    let { from, to } = selection ?? { from: 1, to: 1 };
    let cursor_is_collapsed = from === to;
    const _in_selection = (pos: number) => {
      return pos >= from && pos < to;
    };
    //console.log("useEditorDocTree", { start, end });
    const doc = getView()?.state.doc;

    // 防空
    if (!doc) return;

    // 准备根节点, 以及解析栈
    let root: DocTreeNode = {
      id: `Root`,
      parentId: null,
      name: "document",
      leaf: false,
      from: 0,
      depth: -1,
      to: doc.content.size,
      size: doc.content.size,
      level: 0,
      attrs: {},
      marks: [],
      text: "Document",
    };
    _doc_raw_nodes.set(root.id, doc);

    let nodes: DocTreeNode[] = [root];
    let idStack = [root.id];
    let checkedIds: string[] = [];

    // 递归遍历文档节点
    doc.descendants((node, pos) => {
      const rp = doc.resolve(pos);
      const depth = rp.depth; // 顶层节点(<P>)的 depth==0
      const from = pos;
      const to = pos + node.nodeSize;
      const _in_node = (p: number) => {
        return p >= from && p < to;
      };

      const nodeId = `N${pos}`;

      // 创建节点对象
      const nIt: DocTreeNode = {
        id: nodeId,
        parentId: idStack[depth],
        name: node.type.name,
        leaf: node.isAtom || node.isText,
        from,
        to,
        depth,
        size: node.nodeSize,
        level: node.attrs.level ?? 0,
        attrs: _.cloneDeep(node.attrs),
        marks: node.marks.map((mark) => mark.type.name),
        tip: `[${from}-${to}]`,
        icon: getNodeIcon(node.type),
      };
      _doc_raw_nodes.set(nodeId, node);

      let nodeInRange = false;
      // 坍缩的光标，判断是否在节点中
      if (cursor_is_collapsed) {
        let pos = from;
        nodeInRange = _in_node(pos);
      }
      // 选区，那么判断节点两端是否在选区中
      else {
        nodeInRange = _in_selection(from) || _in_selection(to - 1);
        // _in_node(selection.from) ||
        // _in_node(selection.to - 1);
      }

      // 更新节点文本
      let texts = [] as string[];
      // 文字节点
      // 只要包含选区就选中
      if (node.isText && node.text) {
        // 获取文字标注信息
        if (nIt.marks.length > 0) {
          texts.push(`[${nIt.marks.join(",")}]`);
        }
        if (node.text.length < 100) {
          texts.push(node.text ?? "");
        } else {
          texts.push(node.text.substring(0, 100) ?? "");
        }
      }
      // 其他节点
      // 选区必须包含全部，才会被选中
      else {
        texts.push(`<${node.type.name}>`);
        if (!node.isAtom && !node.isLeaf) {
          idStack[depth + 1] = nIt.id;
        }
      }

      //console.log("-", nodeId, nIt.type, nodeInRange, { from, to });
      // 更新选择的节点ID
      if (nodeInRange) {
        checkedIds.push(nodeId);
      }
      // 最后确定文本
      nIt.text = texts.join("");
      nodes.push(nIt);
    });

    // 返回数据
    _doc_tree_nodes.value = nodes;
    if (_checked_node_ids) {
      _checked_node_ids.value = checkedIds;
    }
  }
  //-----------------------------------------------------
  function dumpTree(): string {
    let doc = getView()?.state.doc;

    // 防空
    if (!doc) {
      return "View without INIT";
    }

    // 准备结果集
    let result = "";

    doc.descendants((node, pos) => {
      const rp = doc.resolve(pos);
      const depth = rp.depth;
      const indent = "│ ".repeat(depth);
      const nodeType = node.type.name;
      const size = node.nodeSize;
      const text = node.isText ? `: "${node.text}"` : "";

      result += `${indent}├─ ${nodeType} [${pos}-${
        pos + size
      }:depth=${depth}:atom=${node.isAtom}:leaf=${node.isLeaf}]${text}\n`;
    });

    return result;
  }
  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return {
    DocTreeNodes: computed(() => _doc_tree_nodes.value),
    DocTreeNodeMap,

    getTreeNode,
    getTreeNodes,
    findNodeByPos,
    getNodeAncestors,

    updateTree,

    dumpTree,
  };
}
