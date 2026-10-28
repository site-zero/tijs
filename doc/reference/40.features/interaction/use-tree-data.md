---
title: use-tree-data 树型数据组织
keywords: [hook, useTreeData, use-tree-data, 树, 树形数据, buildTree, flatten, walkDFS, 祖先, 虚拟根节点, childrenKey]
status: draft
---

# `use-tree-data` 树型数据组织

## 解决什么问题

`TiTree` 与 `TiTreeTable` 既要吃"根节点带子节点"的树，也要吃"每行带 parentId"的扁平列表；
还要在此之上做增删节点、查祖先、按展开状态扁平化出当前可见行、把扁平行重新拼成树。这些
操作如果写在组件里，遍历、虚拟根节点、叶子判定会各自为政。

`useTreeData` 把任意输入归一化成两张内部表：一张 `Map<id, 层级信息>`（`hierarchy`）记录
父子/深度/下标，一张 `Map<id, 节点数据>`（`nodes`）记录原始行；再围绕这两张表提供读写、
遍历、扁平化、重建的全套 API。`TiTree`、`TiTreeTable` 都基于它。

## 输入 Props

类型 `TreeDataProps`（在本 hook 文件内声明）：

- **`isLeafNode?: Vars | Vars[] | ((payload: TreeNode) => boolean)`** —— 叶子判定；
  `Vars|Vars[]` 走 `Match.parse`。缺省按"没有 children"判定。
- **`isNodeOpen?: number | Vars | Vars[] | ((payload: TreeNode) => boolean)`** —— 构建树
  时节点的默认展开状态；传 `number` 表示"深度小于该值才打开"，缺省 `1`（只展开根）。
- **`childrenKey?: string`** —— 从树节点取子节点数组的键，缺省 `"children"`。
- **`getNodeId?: string | (data: Vars) => TableRowID | undefined`** —— 取节点 ID；
  字符串视为 `_.get` 键，缺省取 `data.id ?? data.value`。
- **`getParntNodeId?: string | (data: Vars) => TableRowID | undefined`** —— 从扁平行取
  父节点 ID 的键/函数，缺省取 `data.parentId ?? data.pid`；不指定则所有节点都挂到
  虚拟根下。
- **`virtualRootNode?: TableRowID | Vars`** —— 自定义虚拟根节点；未指定时用固定 ID
  `%VIRTUAL-ROOT%`。
- **`forceUseVirtualRoot?: "list" | "node" | "both" | null`** —— 强制使用虚拟根的模式；
  缺省只在列表模式归纳不出单一根时才启用。

第二个参数是调用方维护的 `_node_status: Map<TableRowID, RowIndentStatus>`（`open|closed`），
hook 直接读写它，与 `use-row-indent` 的 `rowStauts` 是同一份 Map。

## 返回值 API

```ts
const tree = useTreeData(props, nodeStatus);
tree.buildTree(rawData);      // 先喂数据，再调下列 API
```

- **构建**
  - **`buildTree(data: Vars | Vars[])`** —— 从根节点对象或扁平数组构建整棵树；
    构建完会 DFS 一遍回写 `index/depth/leaf`。
  - **`resetNodeStatus({ force?, tree? })`** —— 按 `isNodeOpen` 重算默认展开状态；
    `force` 清空已存在的状态，否则只补从未设置过的节点。
  - **`clear()`** —— 清空两棵内部表。
- **节点状态**
  - **`toggleNodeStatus(id)`** —— 翻转某节点 `open/closed`。
  - **`setNodeStatus(id, status, depth=0)`** —— 把节点及其不超过 `max_depth` 的后代
    一并设为指定状态。
- **写操作**
  - **`removeNode(nodeId)`** —— 从父节点 children、`hierarchy`、`nodes` 三处一并删除。
- **读操作**
  - **`getNode(id) / getNodes(...ids) / getNodeData(id)`** —— 取节点（含 `data`）/
    批量取 / 只取原始数据。
  - **`getHierarchy(id)`** —— 只取层级信息。
  - **`getAxis(id, includeSelf=true)`** —— 从根到该节点的层级链。
  - **`getAncestorNodes(id, includeSelf)` / `getAncestors(id, includeSelf)`** ——
    祖先的完整节点 / 祖先的原始数据数组。
  - **`getChildren(id)`** —— 直接子节点的原始数据数组。
- **遍历**
  - **`walkDFS(callback, startNodeId?, tr?)`** —— 深度优先；回调返回
    `"down" | "next" | "stop"`，`stop` 内部用抛异常的方式立即终止。
- **数据转换**
  - **`getFlattenData(filter?)`** —— 按展开状态把树扁平成行数组；缺省过滤器跳过虚拟
    节点、叶子直接跳过子节点、`open` 节点才下钻。
  - **`getTreeIndents()`** —— 输出 `Map<节点ID, 缩进级数>`；根是虚拟根时整体减 1。
  - **`getTreeData(filter?, nodeId?)`** —— 从某节点重新拼回树对象；`filter` 返回
    `"self" | "all" | "ignore"` 控制子树取舍。
  - **`tidyNodeStatus()`** —— 清理 `node_status` 中已不存在节点的残留状态。

## 配合使用

- **与 `use-row-indent`**：`getTreeIndents()` 的输出直接灌进 `rowIndents`，
  `node_status` 与 `rowStauts` 共用同一个 Map，展开折叠一次接线。
- **与 `use-selectable`**：`TiTreeTable` 用本 hook 产出可见行后，再交给 `use-selectable`
  做选区。

```ts
const nodeStatus = ref(new Map()).value;
const tree = useTreeData({
  childrenKey: "children",
  getNodeId: "id",
  getParntNodeId: "pid",
  isNodeOpen: 1,                // 默认只展开根
}, nodeStatus);

tree.buildTree(listData.value); // 扁平列表 → 内部树
const rows = tree.getFlattenData();   // 按展开状态得到当前可见行
const indents = tree.getTreeIndents(); // 各行缩进级数
```

## 注意事项

- **`buildTree` 是同步全量重建**：数据量大时整棵树会重新走一遍 DFS，调用方按需节流。
- **取不到节点 ID 会抛错**：`_gen_hierarchy` 对无法解析 ID 的行直接 `throw`，不要喂
  缺 ID 的脏数据。
- **虚拟根不进 `getFlattenData` 的结果**：但会影响缩进（整体减 1）与深度计算。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/use-tree-data.ts` —— 本 hook 与 `TreeDataProps`/`TreeBuildResult`。
  - `src/lib/view/tree/TiTree.vue`、`src/lib/view/tree-table/TiTreeTable.vue` —— 实际消费方。
- **相关文档**
  - 行缩进与展开图标：[`use-row-indent`](use-row-indent.md)。
  - 选区状态机：[`use-selectable`](use-selectable.md)。
  - 消费组件：[TiTree](../../30.components/view/ti-tree.md)、
    [TiTreeTable](../../30.components/view/ti-tree-table.md)。
