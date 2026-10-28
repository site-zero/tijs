---
title: use-row-indent 行缩进与展开图标
keywords: [hook, useRowIndent, use-row-indent, RowIndentProps, rowIndents, rowStauts, rowIndicators, getRowIcon, 缩进, 展开折叠]
status: draft
---

# `use-row-indent` 行缩进与展开图标

## 解决什么问题

列表一旦支持树型展示，每一行都要回答三件事：缩进几级、是展开还是折叠、行首显示哪个图标
（展开/折叠指示图标 + 行自己的状态图标）。这三组信息在 `RowIndentProps` 里以 Map 形式
传入，组件只负责渲染。

`useRowIndent` 把"按行 ID 查缩进、查状态、再拼出指示图标与行图标"这步查表固定下来，
输入行 ID 与原始数据，输出一个渲染就绪的 `RowIndentation`。`TiList`、`TiTree`、
`TiTreeTable` 都用它。

## 输入 Props

类型 `RowIndentProps`（定义在 `src/_type/lib-type-row-indent.ts`，共享 Props 之一，
见[共享 Props](../../10.concepts/02-common-props.md)）：

- **`rowIndents?: Map<TableRowID, number>`** —— 各行缩进级数，`0` 表示不缩进。
- **`rowStauts?: Map<TableRowID, 'open' | 'closed'>`** —— 各行展开/折叠状态；
  注意源码字段名拼写为 `rowStauts`（不是 `rowStatus`），文档与配置需照此拼写。
- **`rowIndicators?: Record<'open' | 'closed', string>`** —— 展开/折叠指示图标的
  HTML 片段；只有声明了 `rowStauts` 才生效。
- **`getRowIcon?: IconInput | SelectValueArm<IconInput, any> | RowIconGetter`** ——
  行状态图标的取值路径、匹配臂或自定义函数；缺省直接用行数据自带的 `rowIcon`。

## 返回值 API

```ts
const indent = useRowIndent(props);
```

- **`getRowIndentation(id: TableRowID, rawData: Vars, rowIcon?: IconInput): RowIndentation`**
  —— 按行查表，返回渲染就绪对象：
  - **`id`** —— 行 ID 原样带回。
  - **`indent: number`** —— 缩进级数（未配置时 `0`）。
  - **`rowStatus?: 'open' | 'closed'`** —— 该行展开状态（未声明 `rowStauts` 时为
    `undefined`）。
  - **`indicator?: string`** —— 按 `rowStatus` 从 `rowIndicators` 取出的指示图标片段。
  - **`rowIcon?: IconInput`** —— 经 `getRowIcon` 解析后的行图标。

未声明 `rowStauts` 时，hook 直接返回 `{ id, indent: 0, rowIcon }`，不做任何查表。

## 配合使用

- **与 `use-tree-data`**：`getTreeIndents()` 产出的 Map 灌进 `rowIndents`，
  `node_status` Map 直接作为 `rowStauts`，一行接线、两处复用。
- **与 `use-selectable`**：`TiTreeTable` 在同一行上既画缩进图标、又画选区勾选框。

```ts
const rowIndent = useRowIndent(props);

// 渲染每一行时取一份缩进信息
for (const row of visibleRows) {
  const it = rowIndent.getRowIndentation(row.id, row.data, row.data.rowIcon);
  // 模板按 it.indent 渲染缩进占位、按 it.indicator 渲染折叠箭头
}
```

## 注意事项

- **`rowStauts` 拼写是历史遗留**：写 Props 时不要改成 `rowStatus`，否则查表落空、缩进
  与折叠图标都不生效。
- **`getRowIcon` 三态解析顺序**：`IconInput` 常量 → `SelectValueArm` 匹配臂
  （`Util.buildSelectArms`）→ 自定义 `RowIconGetter`；都没命中就回退到行数据自带的
  `rowIcon`。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/use-row-indent.ts` —— 本 hook 与 `RowIndentation`。
  - `src/_type/lib-type-row-indent.ts` —— `RowIndentProps`/`RowIconGetter` 类型。
  - `src/lib/view/list/TiList.vue`、`src/lib/view/tree/TiTree.vue`、
    `src/lib/view/tree-table/TiTreeTable.vue` —— 实际消费方。
- **相关文档**
  - 行缩进属于共享 Props：[共享 Props](../../10.concepts/02-common-props.md)。
  - 缩进数据从哪来：[`use-tree-data`](use-tree-data.md)。
  - 消费组件：[TiList](../../30.components/view/ti-list.md)、
    [TiTree](../../30.components/view/ti-tree.md)、
    [TiTreeTable](../../30.components/view/ti-tree-table.md)。
