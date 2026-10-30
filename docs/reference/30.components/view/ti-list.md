---
title: TiList 列表
keywords: [列表, list, TiList, 选项列表, 单选, 多选, 树形列表, 视图]
status: draft
---

# TiList 列表

## 介绍

`TiList` 是视图类（`VIEW`）的通用纵向列表：把一组数据项按行渲染，每行由"缩进占位 /
树展开指示 / 勾选标记 / 行号 / 图标 / 文字"组成。它既是下拉框、单选多选框的底层列表，
也能通过 `rowIndents` 叠加行缩进，充当简单的树形列表。

数据项默认按 `{ value, text, icon, tip }` 标准选项读取；可以用 `getText` / `getIcon` /
`getTip` / `getValue` 重新映射字段。选区（当前项、勾选项）由 `currentId` / `checkedIds`
双向驱动。

使用时需要注意：

- 默认 `textAsHtml: true`，显示文字按 HTML 渲染（文本会先做 HTML 转义）；`textFormat`
  默认是 `<em>${text}</em><abbr>${tip}</abbr>`，即主文字加粗、备注挂缩写。
- 空数据时渲染内置 `TiRoadblock`（默认文字 `i18n:empty-data`），可用 `emptyRoadblock`
  覆盖。
- 点击列表空白处会清空选区并触发一次 `select`；点击行首的展开指示图标会触发
  `toggle:status`，用于树模式展开收起。

源码目录：`src/lib/view/list/`。

## 例子

### JSON 配置

```json
{
  "size": "b",
  "currentId": 3,
  "checkedIds": [3],
  "data": [
    { "value": 1, "text": "This is a DOG", "icon": "fas-dog" },
    { "value": 2, "text": "This is a CAT", "icon": "fas-cat" }
  ]
}
```

### Vue 标签调用

```xml
<TiList
  :size="'b'"
  :current-id="3"
  :checked-ids="[3]"
  :data="items"
  @select="onSelect"
/>
```

## 控件参数

### 数据

- **`data`（`Vars[]`，默认 `[]`）**：列表数据数组；每项按标准选项 `value / text / icon /
  tip` 读取。
- **`currentId`（`TableRowID | null`，无默认值）**：当前（高亮）行的 ID。
- **`checkedIds`（`CheckedIds<TableRowID>`，无默认值）**：勾选项集合，可为数组、对象映射
  或 `Map`。
- **`getId`（`string | (it, index) => ID`，无默认值）**：从数据行取 ID 的方式；字符串走
  `_.get`，否则用函数。
- **`dftIdPrefix`（`string`，默认 `"row"`）**：取不到 ID 时用 `前缀-下标` 兜底命名。
- **字段映射 `getText` / `getIcon` / `getTip` / `getValue`**：分别指定从数据行取显示文字、
  图标、备注、值的字段或转换器，缺省对应 `text / icon / tip / value`。
- **`textFormat`（`string | (it, raw) => string`，默认
  `"<em>${text}</em><abbr>${tip}</abbr>"`）**：每行显示文字的模板或格式化函数，上下文为
  `{ text, tip, value, raw }`。
- **行缩进 `rowIndents` / `rowStauts` / `rowIndicators` / `getRowIcon`**：来自
  `RowIndentProps`，用于把列表扩展成树形（缩进级数、展开状态、展开图标、行状态图标）。

### 行为

- **`multi`（`boolean`，无默认值）**：是否多选。
- **`minChecked` / `maxChecked`（`number`，无默认值）**：勾选数量上下限。
- **`canSelect`（`boolean`，默认 `true`）**：行是否可点选。
- **`showChecker`（`boolean`，无默认值）**：是否显示勾选标记列；多选且未指定
  `markerIcons` 时默认用方框 / 勾选框图标。
- **`autoPickCurrent`（`boolean`，默认 `true`）**：勾选时是否自动确定一个当前项。
- **`canSelectItem` / `canCheckItem`（`Vars | Vars[] | CanItemMatch`，无默认值）**：按
  条件控制哪些行可点选 / 可勾选。
- **`markerIcons`（`[IconInput, IconInput] | "auto"`，无默认值）**：勾选标记的两态图标。
- **`canHover`（`boolean`，默认 `true`）**：是否启用行 hover 高亮。
- **`highlightChecked`（`boolean`，默认 `true`）**：勾选项是否突出背景。
- **`allowUserSelect`（`boolean`，默认 `false`）**：是否允许鼠标选中文字。
- **`textAsHtml`（`boolean`，默认 `true`）**：显示文字是否按 HTML 渲染。
- **`forceShowRowIconPart`（`"auto" | "no" | "yes"`，默认 `"auto"`）**：是否强制显示图标
  列，保证列表对齐。
- **`autoScrollIntoView`（`boolean`，无默认值）**：选区变化是否自动滚动到当前项。
- **`scrollViewPort`（`() => HTMLElement`，无默认值）**：自动滚动时指定的滚动视口容器。
- **`autoI18n`（`boolean`，默认 `true`）**：是否对 `text` / `tip` 做 `i18n:` 解析。

### 外观

- **`size`（`AspectSize`，默认 `"m"`）**：列表字号分级 `t / s / m / b / h`。
- **`borderStyle`（`CssBorderStyle | null`，无默认值）**：行边线样式（如 `solid` /
  `dashed` / `dotted`）。
- **`showIndexFrom`（`number`，无默认值）**：指定后每行显示起始行号。
- **`tipWidth`（`string`，默认 `"1fr"`）**：备注栏宽度。
- **`getRowType`（`GetDataLogicTypeOptions`，无默认值）**：为行计算状态色，挂 `is-<type>`
  类。
- **`styleSheet`（`string | CssSheet[]`，无默认值）**：注入到列表作用域的自定义样式表。
- **`emptyRoadblock`（`RoadblockProps`，无默认值）**：空数据时的占位标牌配置。

### 回调

- **`getRowType`**：见外观，返回行状态色。
- **字段映射类回调**（`getText` / `getIcon` / `getTip` / `getValue`）与 `textFormat`
  格式化函数：均在构建每行显示内容时调用。

### 嵌套

- **`head`（`TextFragment`）**：列表顶部扩展区，默认渲染 `TiTextSnippet`，也可用同名
  `slot="head"` 完全替换。
- **`tail`（`TextFragment`）**：列表底部扩展区，同上，可用 `slot="tail"` 替换。
- **空态**：数据为空时由 `TiRoadblock` 占位，位置在 `head` 与列表之间。

### 事件

- **`select`**：选区变化（点选、勾选、点击空白清空）时触发，载荷为
  `ListSelectEmitInfo`（`currentId`、`checkedIds`、`current`、`checked`、`index`、
  `oldCurrentId`、`oldCheckedIds`）。
- **`open`**：双击某行时触发，载荷为该行 `ListItem`（含 `value`、`text`、`icon`、
  `index`、`rawData` 等）。
- **`toggle:status`**：点击行首树展开指示图标时触发，载荷
  `{ id, currentStatus }`（`currentStatus` 为 `open | closed`）。

> 本组件继承 `CommonProps`（`className`、`style`）与选择 / 标准选项 / 行缩进特性，字段
> 含义见 [共享 Props](../../10.concepts/02-common-props.md)，本篇不再罗列。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单列表（`simple`）

**JSON 配置**

```json
{
  "className": "border-solid fit-parent",
  "size": "b",
  "currentId": 3,
  "checkedIds": [3],
  "data": [
    { "value": 1, "text": "This is a DOG", "icon": "fas-dog" },
    { "value": 2, "text": "This is a CAT", "icon": "fas-cat" },
    { "value": 3, "text": "This is a HIPPO", "icon": "fas-hippo" },
    { "value": 4, "text": "This is a FROG", "icon": "fas-frog" },
    { "value": 5, "text": "This is a LIZARD" },
    { "value": 6, "text": "This is a FISH", "icon": "fas-fish" }
  ]
}
```

**Vue 标签**

```xml
<TiList
  class="border-solid fit-parent"
  size="b"
  :current-id="3"
  :checked-ids="[3]"
  :data="items"
/>
```

### 带图标列表（`with_icon`）

**JSON 配置**

```json
{
  "className": "border-dashed fit-parent",
  "size": "b",
  "currentId": null,
  "checkedIds": {},
  "data": [
    { "value": 1, "text": "This is a DOG", "icon": "fas-dog" }
  ]
}
```

**Vue 标签**

```xml
<TiList class="border-dashed fit-parent" size="b" :current-id="null" :checked-ids="{}" :data="items" />
```

### 带备注列表（`with_tip`）

**JSON 配置**

```json
{
  "className": "tip-block fit-parent",
  "size": "m",
  "currentId": null,
  "checkedIds": {},
  "data": [
    { "value": 1, "text": "This is a DOG", "tip": "Dogs are natural chewers..." }
  ]
}
```

**Vue 标签**

```xml
<TiList class="tip-block fit-parent" size="m" :current-id="null" :checked-ids="{}" :data="items" />
```

### 多选带图标（`multi_with_icon`）

**JSON 配置**

```json
{
  "className": "border-dotted fit-parent",
  "size": "b",
  "currentId": null,
  "checkedIds": {},
  "multi": true,
  "canSelect": true,
  "data": [
    { "value": 1, "text": "This is a DOG", "icon": "fas-dog" }
  ]
}
```

**Vue 标签**

```xml
<TiList
  class="border-dotted fit-parent"
  size="b"
  :current-id="null"
  :checked-ids="{}"
  :multi="true"
  :can-select="true"
  :data="items"
/>
```

### 多选带备注（`multi_with_tip`）

**JSON 配置**

```json
{
  "className": "tip-block border-dotted fit-parent",
  "size": "m",
  "multi": true,
  "currentId": 4,
  "checkedIds": { "1": true, "4": true, "5": true },
  "data": [
    { "value": 1, "text": "This is a DOG", "icon": "fas-dog", "tip": "..." }
  ]
}
```

**Vue 标签**

```xml
<TiList
  class="tip-block border-dotted fit-parent"
  size="m"
  :multi="true"
  :current-id="4"
  :checked-ids="{ '1': true, '4': true, '5': true }"
  :data="items"
/>
```

## 总结

`TiList` 是纵向选项列表的底座：下拉框、单选 / 多选、菜单都建立在它之上。需要层级关系时
用 `TiTree`（在列表之上叠加树数据扁平化）；需要固定网格卡片时用 `TiWall`；需要多列数据
时用 `TiTable`。它不承担表单录入，只负责展示与选区回传。

## 延伸阅读

- **源码入口**
  - `src/lib/view/list/ti-list-index.ts` —— 注册表信息与示例配置。
  - `src/lib/view/list/ti-list-types.ts` —— `ListProps`、`ListAspect`、`ListEmitter`。
  - `src/lib/view/list/TiList.vue` —— 行模板与选区、缩进接线。
  - `src/lib/view/list/use-list.ts` —— 标准选项、勾选图标、选区事件分发。
- **相关文档**
  - 树形列表：[ti-tree](ti-tree.md)。
  - 固定网格墙贴：[ti-wall](ti-wall.md)。
  - 多列表格：[ti-table](ti-table.md)。
  - 选区特性：[use-selectable](../../40.features/interaction/use-selectable.md)；标准选项：[use-std-list-item](../../40.features/interaction/use-std-list-item.md)；行缩进：[use-row-indent](../../40.features/interaction/use-row-indent.md)。
