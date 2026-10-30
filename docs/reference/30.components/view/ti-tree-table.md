---
title: TiTreeTable 树状表格
keywords: [树状表格, tree-table, TiTreeTable, 树形表格, 层级表格, 展开, 视图]
status: draft
---

# TiTreeTable 树状表格

## 介绍

`TiTreeTable` 是视图类（`VIEW`）的树状数据表格：它把一组带父子关系的扁平数据（`id` /
`pid`）用 `useTreeData` 建树并扁平化成带缩进的行，再交给底层 `TiTable` 渲染多列表格。
也就是说，它在 `TiTable` 之上叠加了"层级、展开 / 收起"，表格的列定义、选区、可编辑能力
都继承自 `TiTable`。

使用时需要注意：

- 数据同样是**扁平数组**（`id` + `pid`），组件自动归纳层级，而不是嵌套 children。
- 展开 / 收起由内部节点状态驱动，行首的缩进与展开指示由 `TiTable` 的行缩进能力渲染。
- 选择事件载荷在表格选区信息之外，额外带 `path`、`currentNode`、`checkedNodes`。
- 注册表 `tags` 标注了 `ing`（进行中），列编辑、列拖拽等高级能力仍以 `TiTable` 为准。

源码目录：`src/lib/view/tree-table/`。

## 例子

### JSON 配置

```json
{
  "size": "m",
  "isNodeOpen": 5,
  "columns": [{ "name": "name" }, { "name": "value" }],
  "data": [
    { "id": 1, "name": "Mammal", "value": "mammal" },
    { "id": 11, "name": "DOG", "value": "dog", "pid": 1 }
  ]
}
```

### Vue 标签调用

```xml
<TiTreeTable
  size="m"
  :is-node-open="5"
  :columns="columns"
  :data="treeData"
  @select="onSelect"
/>
```

## 控件参数

### 数据

- **`data`（`Vars | Vars[] | null`，无默认值）**：扁平树数据数组，每行 `id` + `pid` 描述
  父子关系，其余字段对应列。
- **`columns`（`ColumnRefer[]`，必填）**：列定义，格式与 `TiTable` 一致（每项
  `{ name, title?, width?, activatedComType, ... }`）。
- **树归属**：`getNodeId`、`getParntNodeId`、`childrenKey`、`virtualRootNode`、
  `isLeafNode` 与 `TiTree` 相同，用于扁平数据建树。
- **当前项 / 勾选项**：`currentId`、`checkedIds` 与 `TiTable` 一致。

### 行为

- **`isNodeOpen`（`number | Vars | Vars[] | (payload) => boolean`，默认 `1`）**：构建树时
  默认展开到的深度。
- **`autoOpen`（`number`，默认 `0`）**：选中节点后自动展开自身及以下 `N` 层。
- **`rowIndicators` / `getRowIcon`**：展开指示图标与行状态图标，同 `TiTree`。
- 表格类行为开关（`multi`、`canSelect`、`showChecker`、`editable`、`columnResizable`、
  `showHeader` 等）全部继承自 `TiTable`。

### 外观

- **`size`、`mainFontSize`、`rowGap`、`colGap`、`rowMinHeight`、`indentSize`、
  `emptyRoadblock` 等**：与 `TiTable` 相同，见 [TiTable](ti-table.md)。

### 回调

- **`isLeafNode` / `getRowIcon`**：建树与渲染行时调用，决定叶子判定与行图标。

### 嵌套

- **`head` / `tail`（`TextFragment`）**：与 `TiTable` 相同的首尾扩展区，可用同名插槽
  替换。
- **列内**：每个单元格由列定义的 `comType` / `comConf`（展示态）与 `activatedComType` /
  `activatedComConf`（激活可编辑态）决定，位置由 `TiTable` 排布。

### 事件

- **`select`**：选区变化时触发，载荷 `TreeSelectEmitInfo`：在表格选区信息之外带 `path`
  （祖先链）、`currentNode`、`checkedNodes`。
- **`open`**：双击某行 / 打开行时触发，载荷为对应树节点。
- **`toggle:status`**：点击展开 / 收起指示时触发，载荷 `{ id, currentStatus }`。
- 表格其余事件（`cell-open`、`row-change`、`cell-change`）继承自 `TiTable`。

> 本组件在 `TiTable` 的列、选区、可编辑能力之上叠加树数据扁平化，其余共享参数见
> [共享 Props](../../10.concepts/02-common-props.md) 与 [TiTable](ti-table.md)。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应，结构与 `TiTree` 示例一致（扁平 `id` + `pid`
数据），只是外层是表格而非纯列表。

### 简单树状表格（`simple`）

**JSON 配置**

```json
{
  "columns": [{ "name": "text" }, { "name": "value" }],
  "isNodeOpen": 5,
  "data": [
    { "id": 1, "text": "Mammal" },
    { "id": 11, "text": "DOG", "pid": 1 },
    { "id": 12, "text": "CAT", "pid": 1 }
  ]
}
```

**Vue 标签**

```xml
<TiTreeTable :columns="columns" :is-node-open="5" :data="treeData" />
```

### 带图标（`with_icon`）

**JSON 配置**

```json
{
  "columns": [{ "name": "text" }],
  "isNodeOpen": 5,
  "getRowIcon": [
    ["fas-folder-open", { "rowStatus": "open", "rowIndent": 0 }],
    ["fas-folder", { "rowStatus": "closed", "rowIndent": 0, "rowIcon": "[BLANK]" }]
  ],
  "data": [
    { "id": 1, "text": "Mammal", "icon": "fas-cake" },
    { "id": 11, "text": "DOG", "icon": "fas-dog", "pid": 1 }
  ]
}
```

**Vue 标签**

```xml
<TiTreeTable :columns="columns" :is-node-open="5" :get-row-icon="rowIconRules" :data="treeData" />
```

### 带备注（`with_tip`）、多选带图标（`multi_with_icon`）、多选带备注（`multi_with_tip`）

这三个示例的数据结构与交互分别对应 `TiTree` 的同名示例（`with_tip`、`multi_with_icon`、
`multi_with_tip`），区别仅在于外层用多列表格渲染。完整配置原样见
`src/lib/view/tree-table/example/` 下对应文件。

## 总结

`TiTreeTable` 适合"既要层级折叠、又要多列数据"的场景：文件目录、组织架构台账、分类清单。
只需要层级、不显示多列时用更轻的 `TiTree`；只有多列、没有层级时用 `TiTable`。它本质是
"`useTreeData` 扁平化 + `TiTable`"，列与可编辑能力全部复用表格。

## 延伸阅读

- **源码入口**
  - `src/lib/view/tree-table/ti-tree-table-index.ts` —— 注册表信息与示例配置。
  - `src/lib/view/tree-table/ti-tree-table-types.ts` —— `TreeTableProps`。
  - `src/lib/view/tree-table/TiTreeTable.vue` —— 建树、展开状态与向 `TiTable` 投递数据。
- **相关文档**
  - 底层表格：[ti-table](ti-table.md)。
  - 纯树形列表：[ti-tree](ti-tree.md)。
  - 树数据特性：[use-tree-data](../../40.features/interaction/use-tree-data.md)。
