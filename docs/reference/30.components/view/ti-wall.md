---
title: TiWall 墙贴
keywords: [墙贴, wall, TiWall, 网格, 卡片墙, 缩略图墙, 视图]
status: draft
---

# TiWall 墙贴

## 介绍

`TiWall` 是视图类（`VIEW`）的网格墙贴：把一组数据按自适应多列网格排布成卡片墙（也可切
成纵向列表）。每个墙贴项默认用 `TiThumb` 渲染（预览图 + 文字），可通过 `comType` /
`comConf` 换成任意组件，也可以用 `wallItem` 回调为每一项定制控件。它支持单选 / 多选、
勾选、双击打开、空态占位，并能把选区双向绑定到 `currentId` / `checkedIds`。

使用时需要注意：

- 每个数据项渲染时，上下文是 `{ ...vars, logicType, isCurrent, isChecked, index, item }`，
  `comConf` 里的模板（如 `=item.icon`）从这里取值。
- 空数据时渲染内置 `TiRoadblock`（默认 `i18n:nil-content`），可用 `emptyRoadblock` 覆盖。
- 点击墙贴空白处会清空选区；双击卡片触发 `open`。

源码目录：`src/lib/view/wall/`。

## 例子

### JSON 配置

```json
{
  "layoutHint": "<120>",
  "comConf": {
    "preview": { "src": "=item.icon", "height": "64px" },
    "text": { "text": "=item.name" }
  },
  "data": [
    { "name": "Alpha", "icon": "fas-cat" }
  ]
}
```

### Vue 标签调用

```xml
<TiWall
  layout-hint="<120>"
  :com-conf="thumbConf"
  :data="cards"
  @select="onSelect"
  @open="onOpen"
/>
```

## 控件参数

### 数据

- **`data`（`Vars[]`，默认 `[]`）**：墙贴数据数组，每项渲染成一个卡片。
- **`vars`（`Vars`，默认 `{}`）**：渲染每个卡片时合并进上下文的额外变量。
- **`currentId`（`TableRowID | null`，无默认值）**：当前选中卡片 ID。
- **`checkedIds`（`CheckedIds<TableRowID>`，无默认值）**：勾选卡片集合。
- **`comType` / `comConf`（`TiRawCom`）**：每个卡片用什么组件渲染及配置；默认
  `comType` 为 `TiThumb`，`comConf` 为 `{}`。
- **`getId` / `dftIdPrefix`**：取卡片 ID 的方式与兜底前缀（`dftIdPrefix` 默认 `"item"`）。

### 行为

- **`multi`（`boolean`，无默认值）**：是否多选。
- **`canSelect`（`boolean`，无默认值）**：卡片是否可点选。
- **`showChecker`（`boolean`，无默认值）**：是否显示勾选标记。
- **`fuse`（`string | boolean`，无默认值）**：切换选区前的"保险丝"，触发成功则阻止本次
  选择（用于未保存确认）。
- **`autoScrollIntoView`（`boolean`，无默认值）**：选区变化是否自动滚动到当前卡片。
- **`scrollViewPort`（`() => HTMLElement`，无默认值）**：自动滚动时指定的视口容器。
- **`mode`（`"list" | "wall"`，默认 `"wall"`）**：显示模式，墙式网格或纵向列表。

### 外观

- **`layout` / `layoutHint`（`GridLayoutProps`）**：网格布局与每列宽度提示（如 `"<120"`
  表示列宽不超过 120px）。
- **`style` / `conStyle`（`Vars`）**：墙贴顶层、容器区的内联样式。
- **`itemStyle` / `itemConStyle`（`Vars`）**：每个卡片外壳、内容区的统一内联样式。
- **`getItemStyle` / `getItemConStyle` / `getItemClass` / `getItemConClass`**：按项
  （`item, index`）动态返回样式 / 类。
- **`getItemLogicType`（`(item, index) => LogicType`）**：按项返回状态色，挂 `is-<type>`
  类。

### 回调

- **`wallItem`（`(itemContext) => Required<ComRef>`，无默认值）**：完全自定义每个卡片
  的渲染控件，上下文为 `{ ...vars, logicType, isCurrent, isChecked, index, item }`。
- **`itemEventHandlers`（`Record<string, (ctx) => Promise<void>>`，无默认值）**：为卡片内
  控件统一挂事件处理，回调上下文为 `{ wall, item, payload }`。

### 嵌套

- **`head`（`TextFragment`）**：墙顶部扩展区，默认渲染 `TiTextSnippet`，可用
  `slot="head"` 替换。
- **`tail`（`TextFragment`）**：墙底部扩展区，同上，可用 `slot="tail"` 替换。
- **空态**：数据为空时由 `TiRoadblock` 占位，位于网格容器内。

### 事件

- **`select`**：选区变化时触发，载荷 `WallSelectEmitInfo`（`currentId`、`checkedIds`、
  `current`、`checked`、`index`、旧值等）。
- **`open`**：双击某卡片时触发，载荷为该 `WallItem`（含 `index`、`id`、`rawData`、
  `comType`、`comConf` 等）。

> 本组件继承 `CommonProps`（`className`、`style`）、`ComRef`、选择与网格布局特性，字段
> 含义见 [共享 Props](../../10.concepts/02-common-props.md)，本篇不再罗列。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单墙贴（`simple`）

**JSON 配置**

```json
{
  "style": { "padding": "var(--ti-gap-b)" },
  "itemConStyle": { "padding": "var(--ti-gap-b)" },
  "layoutHint": "<120>",
  "layout": { "gap": "var(--ti-gap-h)" },
  "comConf": {
    "preview": { "src": { "type": "font", "value": "=item.icon", "style": { "fontSize": "48px" } }, "height": "64px" },
    "text": { "text": "=item.name" }
  },
  "data": [
    { "name": "Alpha", "icon": "fas-cat" }
  ]
}
```

**Vue 标签**

```xml
<TiWall layout-hint="<120>" :com-conf="thumbConf" :data="cards" />
```

> 示例数据由 `mockWallData(17)` 生成 17 条 `{ name, icon }`。

### 可选择（`selectable`）

**JSON 配置**

```json
{
  "canSelect": true,
  "showChecker": true,
  "multi": true,
  "layoutHint": "<120>",
  "comConf": {
    "preview": { "src": { "type": "font", "value": "=item.icon", "style": { "fontSize": "48px" } }, "height": "64px" },
    "text": { "text": "=item.name" }
  },
  "data": [
    { "name": "Alpha", "icon": "fas-cat" }
  ]
}
```

**Vue 标签**

```xml
<TiWall
  :can-select="true"
  :show-checker="true"
  :multi="true"
  layout-hint="<120>"
  :com-conf="thumbConf"
  :data="cards"
/>
```

> 示例数据由 `mockWallData(8)` 生成 8 条。

## 总结

`TiWall` 适合缩略图 / 卡片墙：图标选择器、附件预览、人员头像墙。需要纵向选项列表时用
`TiList`；需要瀑布流不等高卡片时用预留的 `TiFalls`（尚未实现）；需要多列台账数据时用
`TiTable`。卡片内容默认是 `TiThumb`，可任意换成其他组件。

## 延伸阅读

- **源码入口**
  - `src/lib/view/wall/ti-wall-index.ts` —— 注册表信息与示例配置。
  - `src/lib/view/wall/ti-wall-types.ts` —— `WallProps`、`WallItem`、`WallEmitter`。
  - `src/lib/view/wall/TiWall.vue` —— 网格、选区与卡片插槽模板。
  - `src/lib/view/wall/use-wall.ts` —— 卡片构建、选区与事件分发。
- **相关文档**
  - 纵向列表：[ti-list](ti-list.md)。
  - 网格布局特性：[use-grid-layout](../../40.features/interaction/use-grid-layout.md)。
  - 选择特性：[use-selectable](../../40.features/interaction/use-selectable.md)。
