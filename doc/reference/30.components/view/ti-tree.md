---
title: TiTree 树
keywords: [树, tree, TiTree, 树形列表, 层级, 折叠展开, 视图]
status: draft
---

# TiTree 树

## 介绍

`TiTree` 是视图类（`VIEW`）的树形列表：它把一组带父子关系的扁平数据（每行有 `id` 与
`pid`）构建成树，再用 `useTreeData` 扁平化成带缩进的行，交给底层 `TiList` 渲染。也就是说，
`TiTree` 在 `TiList` 之上叠加了"建树、展开 / 收起、层级路径"的能力，列表的外观与选区参数
基本继承自 `TiList`。

使用时需要注意：

- 数据是**扁平数组**（`{ id, pid, text, icon, tip }`），不是嵌套 children；组件自动归纳
  父子关系。无法归并成一个根时会自动创建一个虚拟根节点（默认 `%VIRTUAL-ROOT%`，扁平化
  时不显示）。
- 展开 / 收起由内部节点状态驱动，点击行首指示图标触发 `toggle:status`，组件自行切换，
  不要求外部维护。
- 选择事件载荷比列表多了 `path`（祖先节点链）、`currentNode`、`checkedNodes`。

源码目录：`src/lib/view/tree/`。

## 例子

### JSON 配置

```json
{
  "size": "t",
  "borderStyle": "dotted",
  "isNodeOpen": 5,
  "autoOpen": 1,
  "data": [
    { "id": 0, "text": "I am Root" },
    { "id": 1, "text": "I am Child 1", "pid": 0 },
    { "id": 2, "text": "I am Child 2", "pid": 0 }
  ]
}
```

### Vue 标签调用

```xml
<TiTree
  size="t"
  border-style="dotted"
  :is-node-open="5"
  :auto-open="1"
  :data="treeData"
  @select="onSelect"
/>
```

## 控件参数

### 数据

- **`data`（`Vars | Vars[] | null`，无默认值）**：扁平树数据数组；每行用 `id` 标识、
  `pid` 指向父节点，默认也读取 `text / icon / tip` 作为标准选项显示。
- **`getNodeId`（`string | (data) => TableRowID`，默认按 `id`）**：取节点 ID 的方式。
- **`getParntNodeId`（`string | (data) => TableRowID`，无默认值）**：取父节点 ID 的方式，
  是把扁平数据组织成树的关键；未指定则所有顶层节点都挂到虚拟根下。
- **`childrenKey`（`string`，默认 `"children"`）**：若数据本身是嵌套结构，从哪个键读子节点。
- **`virtualRootNode`（`TableRowID | Vars`，无默认值）**：自定义虚拟根节点信息。
- **`isLeafNode`（`Vars | Vars[] | (payload) => boolean`，无默认值）**：判断某行是否叶子
  节点（不再显示展开指示）。
- **当前项 / 勾选项**：`currentId`、`checkedIds` 与 `TiList` 一致。

### 行为

- **`isNodeOpen`（`number | Vars | Vars[] | (payload) => boolean`，默认 `1`）**：构建树
  时节点默认是否展开；传数字表示"只展开到该深度"（`0` 根关闭、`1` 根展开）。
- **`autoOpen`（`number`，默认 `0`）**：选中某节点后自动展开自身及以下 `N` 层（`0` 不自动
  展开，`1` 展开自身，`2` 展开自身与直接子节点）。
- **`rowIndicators`（`Record<"open"|"closed", string>`，默认折叠箭头）**：展开 / 收起指示
  图标的 HTML 片段。
- **`getRowIcon`（`IconInput | SelectValueArm | RowIconGetter`，无默认值）**：按行状态 /
  缩进定制行图标（如打开 / 关闭文件夹）。
- 列表类交互开关（`multi`、`canSelect`、`showChecker`、`canHover`、`canCheckItem` 等）
  全部继承自 `TiList`，用法一致。

### 外观

- **`size`、`borderStyle`、`textFormat`、`tipWidth`、`emptyRoadblock` 等**：与 `TiList`
  相同，见 [TiList](ti-list.md)。

### 回调

- **`isLeafNode` / `getRowIcon` / 字段映射回调**：均在建树或渲染每行时调用，上下文含
  节点数据与层级信息。

### 嵌套

- **`head` / `tail`（`TextFragment`）**：与 `TiList` 相同的首尾扩展区，可分别用
  `slot="head"`、`slot="tail"` 替换。
- **行内**：行首依次为缩进占位、展开指示图标、（可选）勾选标记、图标、文字，位置由
  `TiList` 决定。

### 事件

- **`select`**：选区变化时触发，载荷为 `TreeSelectEmitInfo`：在普通选区信息
  （`currentId`、`checkedIds`、`current`、`checked`）之外，额外带 `path`（当前节点的祖先
  链）、`currentNode`、`checkedNodes`（勾选项对应的节点对象）。
- **`open`**：双击某节点时触发，载荷为该 `TreeNode`。
- **`toggle:status`**：点击展开 / 收起指示时触发，载荷 `{ id, currentStatus }`，组件据此
  自行切换节点状态。

> 本组件在 `TiList` 的选区、标准选项、行缩进之上叠加树数据能力，其余共享参数见
> [共享 Props](../../10.concepts/02-common-props.md) 与 [TiList](ti-list.md)。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单树（`simple`）

**JSON 配置**

```json
{
  "className": "fit-parent",
  "size": "t",
  "borderStyle": "dotted",
  "isNodeOpen": 5,
  "autoOpen": 1,
  "data": [
    { "id": 0, "text": "I am Root" },
    { "id": 1, "text": "I am Child 1", "pid": 0 },
    { "id": 2, "text": "I am Child 2", "pid": 0 },
    { "id": 3, "text": "I am Child 3", "pid": 1 }
  ]
}
```

**Vue 标签**

```xml
<TiTree
  class="fit-parent"
  size="t"
  border-style="dotted"
  :is-node-open="5"
  :auto-open="1"
  :data="treeData"
/>
```

### 带图标树（`with_icon`）

**JSON 配置**

```json
{
  "className": "fit-parent",
  "size": "b",
  "borderStyle": "dotted",
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
<TiTree
  class="fit-parent"
  size="b"
  border-style="dotted"
  :is-node-open="5"
  :get-row-icon="rowIconRules"
  :data="treeData"
/>
```

### 带备注树（`with_tip`）

**JSON 配置**

```json
{
  "className": "fit-parent",
  "size": "m",
  "borderStyle": "dotted",
  "isNodeOpen": 5,
  "data": [
    { "id": 1, "text": "Mammal", "tip": "Mammals love nature" },
    { "id": 11, "text": "DOG", "icon": "fas-dog", "pid": 1, "tip": "Dog is very loyal" }
  ]
}
```

**Vue 标签**

```xml
<TiTree class="fit-parent" size="m" border-style="dotted" :is-node-open="5" :data="treeData" />
```

### 多选带图标（`multi_with_icon`）

**JSON 配置**

```json
{
  "className": "fit-parent",
  "size": "s",
  "multi": true,
  "showChecker": true,
  "canCheckItem": { "pid": "![BLANK]" },
  "checkedIds": { "12": true },
  "borderStyle": "dotted",
  "isNodeOpen": 5,
  "data": [
    { "id": 1, "text": "Mammal", "icon": "fas-cake" },
    { "id": 11, "text": "DOG", "icon": "fas-dog", "pid": 1 },
    { "id": 12, "text": "CAT", "icon": "fas-cat", "pid": 1 }
  ]
}
```

**Vue 标签**

```xml
<TiTree
  class="fit-parent"
  size="s"
  :multi="true"
  :show-checker="true"
  :can-check-item="{ pid: '![BLANK]' }"
  :checked-ids="{ 12: true }"
  border-style="dotted"
  :is-node-open="5"
  :data="treeData"
/>
```

### 多选带备注（`multi_with_tip`）

**JSON 配置**

```json
{
  "className": "fit-parent",
  "size": "s",
  "multi": true,
  "showChecker": true,
  "canCheckItem": { "pid": "![BLANK]" },
  "checkedIds": { "12": true },
  "borderStyle": "dotted",
  "isNodeOpen": 5,
  "data": [
    { "id": 1, "text": "Mammal", "tip": "Mammals love nature" },
    { "id": 11, "text": "DOG", "icon": "fas-dog", "pid": 1, "tip": "Dog is very loyal" },
    { "id": 12, "text": "CAT", "icon": "fas-cat", "pid": 1, "tip": "Cat enjoys calm moments" }
  ]
}
```

**Vue 标签**

```xml
<TiTree
  class="fit-parent"
  size="s"
  :multi="true"
  :show-checker="true"
  :can-check-item="{ pid: '![BLANK]' }"
  :checked-ids="{ 12: true }"
  border-style="dotted"
  :is-node-open="5"
  :data="treeData"
/>
```

## 总结

`TiTree` 适合需要层级折叠的单选 / 多选场景：分类导航、组织架构、文件目录。它本质是
"扁平数据 + 建树 + 扁平化成 `TiList` 行"。需要多列展示树数据时用 `TiTreeTable`；只是
平铺选项、没有层级时直接用 `TiList`。多选时常用 `canCheckItem` 限定只能勾选叶子节点。

## 延伸阅读

- **源码入口**
  - `src/lib/view/tree/ti-tree-index.ts` —— 注册表信息与示例配置。
  - `src/lib/view/tree/ti-tree-types.ts` —— `TreeProps`、`TreeEmitter`、`TreeSelectEmitInfo`。
  - `src/lib/view/tree/TiTree.vue` —— 建树、展开状态与向 `TiList` 投递扁平化数据。
- **相关文档**
  - 底层列表：[ti-list](ti-list.md)。
  - 树状多列表格：[ti-tree-table](ti-tree-table.md)。
  - 树数据特性：[use-tree-data](../../40.features/interaction/use-tree-data.md)。
