---
title: TiTable 表格
keywords: [表格, table, TiTable, 数据表, 列定义, 可编辑表格, 虚拟滚动, 视图]
status: draft
---

# TiTable 表格

## 介绍

`TiTable` 是视图类（`VIEW`）的核心数据表格：通过 `columns` 声明列、`data` 传入行数据，
自动渲染表头、行、单元格。它内置选区（当前行 / 勾选行）、单元格激活编辑、列宽拖拽、行号、
空态占位，并对大数据量做了虚拟滚动（按可视区渲染行）。

列定义是它的核心：每列用 `{ name, title?, width?, activatedComType, ... }` 描述，展示态与
激活编辑态可以用不同控件；默认展示态由 `defaultCellComType` 决定，默认激活态由
`defaultCellActivatedComType`（常配成 `TiInput`）决定。

使用时需要注意：

- `columns` 是必填的列引用数组，每项最少给 `name`（对应数据行的字段名）；列标题、宽度、
  激活控件都可逐列覆盖。
- 大数据（示例含 1000 / 10000 行）靠虚拟滚动支撑；`rowMinHeight`（默认 32px）是滚动
  渲染区计算的关键，不指定则无法正确虚拟滚动。
- 空数据渲染内置 `TiRoadblock`（默认 `i18n:empty-data`），可用 `emptyRoadblock` 覆盖。

源码目录：`src/lib/view/table/`。

## 例子

### JSON 配置

```json
{
  "className": "fit-parent as-zebra",
  "data": [],
  "columns": [
    { "name": "id", "width": 320 },
    { "name": "name" },
    { "name": "age" }
  ]
}
```

### Vue 标签调用

```xml
<TiTable
  class="fit-parent as-zebra"
  :data="rows"
  :columns="columns"
  @select="onSelect"
  @row-change="onRowChange"
/>
```

## 控件参数

### 数据

- **`columns`（`ColumnRefer[]`，必填）**：列定义数组。每项为列对象 `{ name, title?,
  titleAlign?, width?, candidate?, activatedComType, activatedComConf, comConf,
  readonly?, disabled? }`，也允许简写为字符串列名或 `[name, 覆盖配置]` 二元组。
- **`data`（`Vars[]`，默认 `[]`）**：行数据数组，每行字段名与列 `name` 对应。
- **`vars`（`Vars`，无默认值）**：渲染单元格时的上下文变量。
- **`currentId` / `checkedIds`**：当前行 / 勾选行，选区双向绑定。
- **`keepColumns`（`KeepInfo`，无默认值）**：把列宽 / 列顺序等持久化到指定键，配合
  `keepAt` 使用。

### 行为

- **`editable`（`boolean`，默认 `true`）**：表格整体是否可激活编辑；设为 `false` 取消所有
  激活控件。
- **`rowEditable`（`TableRowEditable`，无默认值）**：按行（函数或 `TiMatch` 条件）判断该行
  是否可编辑。
- **`showRowIndex`（`boolean`，默认 `true`）**：是否显示行号列。
- **`showChecker`（`boolean`，默认 `true`）**：是否显示行勾选框。
- **`canSelect`（`boolean`，默认 `true`）**：行是否可点选。
- **`multi`（`boolean`，默认 `true`）**：是否多选。
- **`canHover`（`boolean`，默认 `true`）**：行 hover 高亮。
- **`columnResizable`（`boolean`，默认 `true`）**：列宽是否可拖拽调整（隐藏表头后失效）。
- **`columnResizeInTime`（`boolean | number`，默认 `25`）**：拖拽时是否实时更新列布局；传
  数字表示行数小于该值才实时更新，避免大数据卡顿。
- **`showHeader`（`boolean`，默认 `true`）**：是否显示表头。
- **`canChangeSelection`（`(next, old) => boolean`，无默认值）**：返回 `false` 时阻止本次
  选区切换。
- **`fuse`（`string | boolean`，无默认值）**：切换行前的保险丝，触发成功则阻止选择。
- **`getId`（默认 `"id"`）**：取行 ID 的字段或函数。
- **`getRowType`（`GetDataLogicTypeOptions`，无默认值）**：按行数据计算状态色，挂
  `is-<type>` 行类。

### 外观

- **`mainFontSize`（`AspectSize`，无默认值）**：表格主体字号，缺省继承父元素。
- **`mainScrollMode`（`"cover" | "stretch"`，默认 `"cover"`）**：主体布局；`cover` 占满
  区域并出滚动条（需给定宽高），`stretch` 自然延伸无滚动条。
- **`rowGap`（`number`，默认 `1`）**：行间距（水平表格线尺寸）。
- **`colGap`（`number`，默认 `1`）**：列间距（垂直表格线尺寸）。
- **`rowMinHeight`（`number`，默认 `32`）**：行最小高度（px），虚拟滚动的关键参数。
- **`colDefaultWidth`（`number`，默认 `0`）**：列默认宽度，`0` 表示 `1fr` 均分。
- **`indentSize`（`string | number`，无默认值）**：树缩进块尺寸（px 或 css 尺寸）。
- **`rightPadding`（`number | string`，无默认值）**：右侧留白，给最后一列留出拖拽空间。
- **`mainStyle` / `style`（`Vars`）**：主体区、顶层内联样式。
- **`emptyRoadblock`（`RoadblockProps`，无默认值）**：空数据占位标牌配置。

### 回调

- **`defaultCellComType` / `defaultCellComConf`（`string` / `Vars`）**：单元格默认展示态
  控件类型与配置。
- **`defaultCellActivatedComType` / `defaultCellActivatedComConf`**：单元格激活可编辑态
  默认控件（如 `TiInput`）与配置；逐列可用 `activatedComType` / `activatedComConf` 覆盖。
- **`cellReadonly` / `cellDisabled`**：按单元格判断只读 / 禁用（支持 `TiMatch`）。

### 嵌套

- **`head` / `tail`（`TextFragment`）**：表格顶部 / 底部扩展区，默认渲染 `TiTextSnippet`，
  可用同名插槽 `slot="head"` / `slot="tail"` 替换。
- **表头行首**：勾选 / 选择标记格内嵌一个 `TiActionBar`（`HeadMenu`）作为表头工具条。
- **列单元格**：展示态 / 激活态控件由列定义的 `comType` / `activatedComType` 决定，位置由
  表格列网格排布。

### 事件

- **`select`**：选区变化时触发，载荷 `TableSelectEmitInfo`（含 `currentId`、`checkedIds`、
  `current`、`checked`、`index`，以及可选的 `colIndex`、`column`）。
- **`open`**：打开（双击）某行时触发，载荷为该行 `TableRowData`（`index`、`id`、
  `rawData`、`indent` 等）。
- **`cell-open`**：点击单元格打开时触发，载荷 `TableEventPayload`（`colUniqKey`、
  `rowIndex`、`event`、`row`）。
- **`row-change`**：行数据被编辑改动时触发，载荷 `TableRowChanagePayload`（`colIndex`、
  `rowIndex`、`rowId`、`uniqKey`、`name`、`changed`、`oldRowData`）。
- **`cell-change`**：单元格值变化时触发，载荷 `TableCellChanged`（含 `uniqKey`、
  `colIndex`、`rowIndex` 及字段改动 `FieldChange`）。

> 本组件继承 `CommonProps`（`className`、`style`）与选择 / 字段变更特性，字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)，本篇不再罗列。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单表格（`simple`）

**JSON 配置**

```json
{
  "className": "fit-parent as-zebra",
  "keepColumns": { "keepAt": "Ti-Demo-table-simple-columns" },
  "getRowType": [
    { "test": { "age": "(60,)" }, "type": "danger" },
    { "test": { "age": "(50,)" }, "type": "success" },
    { "test": { "age": "(40,)" }, "type": "warn" }
  ],
  "columns": [
    { "name": "id", "width": 320 },
    { "name": "name" },
    { "name": "age" },
    { "name": "birthday" },
    { "name": "city" }
  ],
  "data": []
}
```

**Vue 标签**

```xml
<TiTable class="fit-parent as-zebra" :get-row-type="rowTypeRules" :columns="columns" :data="rows" />
```

> 示例用 `mockData(10)` 生成 10 行测试数据，`getRowType` 按年龄分段着色。

### 300 行（`300`）

**JSON 配置**

```json
{
  "className": "fit-parent",
  "keepColumns": { "keepAt": "Ti-Demo-table-300k-columns" },
  "columns": [{ "name": "id" }, { "name": "name" }, { "name": "age" }],
  "data": []
}
```

**Vue 标签**

```xml
<TiTable class="fit-parent" :keep-columns="{ keepAt: 'Ti-Demo-table-300k-columns' }" :columns="columns" :data="rows" />
```

### 1k 行（`1k`）

**JSON 配置**

```json
{
  "className": "fit-parent",
  "columns": [{ "name": "id" }, { "name": "name" }, { "name": "age" }],
  "data": []
}
```

**Vue 标签**

```xml
<TiTable class="fit-parent" :columns="columns" :data="rows" />
```

### 10k 行（`10k`）

**JSON 配置**

```json
{
  "className": "fit-parent",
  "columns": [{ "name": "id" }, { "name": "name" }, { "name": "age" }],
  "data": []
}
```

**Vue 标签**

```xml
<TiTable class="fit-parent" :columns="columns" :data="rows" />
```

> 三个大数据示例都用 `mockData(n)` 生成 n 行数据，区别只在数据量（300 / 1000 / 10000），
> 用于验证虚拟滚动与列拖拽在不同规模下的表现。

### 可编辑表格（`editable`）

**JSON 配置**

```json
{
  "className": "fit-parent",
  "keepColumns": { "keepAt": "Ti-Demo-table-editable-columns" },
  "defaultCellActivatedComType": "TiInput",
  "defaultCellActivatedComConf": { "hideBorder": true, "autoSelect": true, "autoFocus": true },
  "columns": [
    { "name": "id", "activatedComType": null, "comConf": { "className": "is-nowrap is-disable" } },
    { "name": "name", "activatedComType": "TiInput", "activatedComConf": { "hideBorder": true, "autoSelect": true, "autoFocus": true } },
    { "name": "age", "type": "Integer" },
    { "name": "city" }
  ],
  "data": []
}
```

**Vue 标签**

```xml
<TiTable
  class="fit-parent"
  default-cell-activated-com-type="TiInput"
  :default-cell-activated-com-conf="{ hideBorder: true, autoSelect: true, autoFocus: true }"
  :columns="columns"
  :data="rows"
  @cell-change="onCellChange"
/>
```

## 总结

`TiTable` 是多列台账 / 明细表的首选：只读展示、行选区、单元格激活编辑、大数据虚拟滚动都
在这一个组件里。需要层级折叠的多列数据用 `TiTreeTable`；只要纵向一列选项用 `TiList`；
卡片网格用 `TiWall`。列定义（`columns`）与行 ID（`getId`）是正确渲染的两个前提。

## 延伸阅读

- **源码入口**
  - `src/lib/view/table/ti-table-index.ts` —— 注册表信息与示例配置。
  - `src/lib/view/table/ti-table-types.ts` —— `TableProps`、`TableStrictColumn`、
    `TableEmitter`。
  - `src/lib/view/table/TiTable.vue` —— 表头 / 行 / 单元格模板与虚拟滚动。
  - `src/lib/view/table/TableRow.vue`、`src/lib/view/table/TableCell.vue` —— 行与单元格。
  - `src/lib/view/table/build-table-column.ts`、`src/lib/view/table/use-table.ts` —— 列构建与表格逻辑。
- **相关文档**
  - 树状多列表格：[ti-tree-table](ti-tree-table.md)。
  - 列定义字段体系（`AbstractField` / `FieldComProps`）：`src/lib/_features/field/`。
  - 状态色与尺度变量：[样式系统](../../10.concepts/05-style-system.md)。
