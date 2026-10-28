---
title: TiLayoutGrid 栅格布局
keywords: [栅格布局, layout grid, TiLayoutGrid, 区块布局, 可拖拽, schema, SHELF]
status: draft
---

# TiLayoutGrid 栅格布局

## 介绍

`TiLayoutGrid` 用 CSS Grid 把一个界面切成若干区块：一份 `schema` 定义每个区块里放什么控件，
一个 `blocks` 数组声明这些区块怎么摆进格子、谁套谁。它是后台工作台、仪表盘这类「上面
一块搜索区、中间列表、右边详情」界面的拼装骨架。

每个布局项的类型自动判定：声明了 `body`（或 `comType`）就是 `block`（一个 `TiBlock`）；
声明了 `layout` 就是 `grid`（再嵌一层 `TiLayoutGrid`）；声明了 `blocks` 就是 `tabs`（嵌一层
`TiLayoutTabs`）。通过 `bar` 还能给格子加可拖拽的行列调整条，尺寸与可见性可持久化。

使用时需要注意：

- `schema` 是「控件字典」，`blocks` 里用 `name` 引用它，避免在每个块里重复写 `comType/comConf`。
- 它是递归容器，`subLayout` 由内部嵌套时自动传 `true`，用户一般不需要设置。
- 拖拽调整条需要块声明 `bar` 才会出现；双击调整条可复位尺寸。

源码目录：`src/lib/shelf/layout/grid/`（race：`SHELF`）。

## 例子

### JSON 配置

```json
{
  "layout": {
    "gridTemplateColumns": "1fr 2fr",
    "gridTemplateRows": "1fr 1.8fr",
    "gap": "10px"
  },
  "blocks": [
    { "name": "search" },
    { "name": "info" }
  ],
  "schema": {
    "search": { "comType": "TiRoadblock", "comConf": { "text": "搜索区" } },
    "info": { "comType": "TiLabel", "comConf": { "value": "信息区" } }
  }
}
```

### Vue 标签调用

```xml
<TiLayoutGrid
  :layout="{ gridTemplateColumns: '1fr 2fr', gap: '10px' }"
  :blocks="blocks"
  :schema="schema"
/>
```

## 控件参数

### 数据

- **`schema`（`LayoutSchema`）**：区块控件字典，键为块名，值为 `{comType, comConf,
  events?}`；`blocks` 里按 `name` 引用。
- **`blocks`（`LayoutBlock[]`）**：布局项数组，每项描述一个区块的摆放：
  - `name`：对应 `schema` 键（或直接给 `comType`/`comConf`）；
  - `type`：`block` / `grid` / `tabs`，不写则按 `body` / `layout` / `blocks` 自动判定；
  - `layout`：类型为 `grid` 时的子栅格定义；`blocks`：类型为 `tabs`/`grid` 时的子项；
  - `grid`：本块在父栅格里的定位（`gridRow` / `gridColumn` 等）；
  - `bar`：行列拖拽调整条；`keep`：该块的状态持久化键。
- **`shown`（`Vars`，默认 `{}`）**：各区块当前可见性 `{块名: boolean}`。
- **`sizes`（`GridResizingState`，无默认值）**：当前行列尺寸 `{columns: string[], rows:
  string[]}`，配合拖拽条使用。

### 行为

- **`layout`（`CssGridLayout`）**：栅格轨道定义，如 `gridTemplateColumns`、`gap`；指定后
  无视 `layoutHint`。
- **`layoutHint`（`GridLayoutHint`，默认 `1`）**：未显式给 `layout` 时按视口宽度自动算列数。
- **`layoutGridTracks`（`string | string[]`）**：按列下标定制轨道宽度。
- **`customizedGridTracks`（`(idx, count, dft) => string`）**：完全自定义每列宽度的回调。
- **`resetLocalGridTracks`（`boolean`，无默认值）**：视口变化导致列数改变时，是否清掉本地
  保存的行列尺寸。
- **`keepShown` / `keepSizes`（`KeepInfo`）**：把区块可见性、行列尺寸持久化。
- **`subLayout`（`boolean`，无默认值）**：是否为嵌套子布局；内部递归时自动置 `true`，
  用户通常不设。

### 外观

- **`gridStyle`（`Vars`，无默认值）**：栅格根追加样式。
- **`itemStyle` / `itemClass`**：统一给所有布局项设置的外层样式与类。
- **`panelStyle`（`Vars`，无默认值）**：弹出面板区域样式。
- **`blockOverflowMode`（`BlockOverflowMode`，无默认值）**：各块内容溢出的默认处理模式。

### 回调

- **`customizedGridTracks`** 见「行为」；无其他用户注入渲染器。

### 嵌套

- **`blocks` 数组**：子区块全部由数据声明进入；项为 `block` 渲染 `TiBlock`，为 `grid` 渲染
  子 `TiLayoutGrid`，为 `tabs` 渲染 `TiLayoutTabs`。
- **默认插槽（`#default`，作用域 `{item}`）**：覆盖单个布局项的渲染。
- **`#panel` 插槽（作用域 `{panel}`）**：覆盖弹出面板内容。
- `panels`（`LayoutPanel[]`）可定义弹出面板型区块（带 `position`、遮罩等）。

### 事件

- **`fire`**：载荷 `ActionBarEvent`；任一块标题栏动作按钮触发时上报。
- **`block`**：载荷 `BlockEvent`；子块内部事件冒泡上来（顶层布局时）。
- **`_sub_block`**：载荷 `BlockEvent`；嵌套子布局里冒泡上来的块事件（内部递归用）。
- **`show` / `hide`**：载荷为块名 `string`；区块显隐变化、或点击面板遮罩关闭时触发。
- **`resize`**：载荷 `Rect`；容器尺寸变化时触发（当前版本视图未接线，保留备用）。
- **`tab-change`**：载荷 `GridItemTabChangeEvent`（含 `items` 链与 `path`）；嵌套的
  `TiLayoutTabs` 切换标签时逐级上抛。

> 本组件同时继承 `CommonProps`，共享 Props 见
> [共享 Props](../../10.concepts/02-common-props.md)。组件通过 `defineExpose` 暴露
> `getBlock(name)` 与 `getBlockCom(name)`。

## 更多例子

注册表 `exampleProps` 仅含一个示例。

### 简单栅格布局（`simple`）

**JSON 配置**

```json
{
  "className": "fit-parent as-card r-b",
  "keepShown": { "keepAt": "Ti-Demo-TiLayoutGrid-simple-Shown" },
  "keepSizes": { "keepAt": "Ti-Demo-TiLayoutGrid-simple-Sizes" },
  "style": { "padding": "10px" },
  "itemStyle": { "backgroundColor": "#FFEE66" },
  "layout": {
    "gridTemplateColumns": "1fr 2fr",
    "gridTemplateRows": "1fr 1.8fr",
    "gap": "10px"
  },
  "blocks": [
    {
      "name": "search",
      "type": "grid",
      "layout": { "gridTemplateRows": "auto 1fr auto", "gap": "0px" },
      "grid": { "gridRow": "span 2" },
      "bar": { "mode": "column", "adjustIndex": 0, "position": "next" },
      "blocks": [
        { "name": "filter" },
        { "name": "list" },
        { "name": "pager" }
      ]
    },
    { "name": "info" },
    {
      "name": "detail",
      "bar": { "mode": "row", "adjustIndex": 1, "position": "prev" }
    }
  ],
  "schema": {
    "filter": { "comType": "TiLabel", "comConf": { "value": "过滤条" } },
    "list": { "comType": "TiRoadblock", "comConf": { "className": "is-info-r", "text": "列表区", "icon": "zmdi-format-list-bulleted" } },
    "pager": { "comType": "TiLabel", "comConf": { "value": "翻页条" } },
    "info": { "comType": "TiRoadblock", "comConf": { "className": "is-text", "text": "信息区", "icon": "zmdi-info" } },
    "detail": { "comType": "TiRoadblock", "comConf": { "className": "is-warn-r", "text": "详情区", "icon": "zmdi-navigation" } }
  }
}
```

**Vue 标签**

```xml
<TiLayoutGrid
  class-name="fit-parent as-card r-b"
  :keep-shown="{ keepAt: 'Ti-Demo-TiLayoutGrid-simple-Shown' }"
  :keep-sizes="{ keepAt: 'Ti-Demo-TiLayoutGrid-simple-Sizes' }"
  :style="{ padding: '10px' }"
  :item-style="{ backgroundColor: '#FFEE66' }"
  :layout="{ gridTemplateColumns: '1fr 2fr', gridTemplateRows: '1fr 1.8fr', gap: '10px' }"
  :blocks="blocks"
  :schema="schema"
/>
```

## 总结

`TiLayoutGrid` 适合需要「按行列分区、区块可拖拽调宽、可显隐可嵌套」的整页骨架。如果区块是
互斥切换、一次只看一个，改用 `TiLayoutTabs`；如果只是想把若干表单字段摆整齐，用 `TiForm` /
`TiGridFields` 而不是布局栅格。拖拽调尺寸依赖 `bar` 配置，未声明时布局是纯静态的。

## 延伸阅读

- **源码入口**
  - `src/lib/shelf/layout/grid/ti-layout-grid-index.ts` —— 注册表信息与示例。
  - `src/lib/shelf/layout/grid/ti-layout-grid-types.ts` —— `LayoutGridProps`、`LayoutGridItem`。
  - `src/lib/shelf/layout/grid/TiLayoutGrid.vue` —— 区块渲染、面板与拖拽条接线。
  - `src/lib/shelf/layout/grid/use-grid-items.ts` —— 由 `blocks/schema` 解析布局项。
  - `src/lib/shelf/layout/grid/use-grid-resizing.ts` —— 行列拖拽调整。
  - `src/lib/shelf/layout/grid/use-grid-keep.ts` —— 可见性与尺寸持久化。
- **相关文档**
  - 单个区块：[TiBlock 布局块](./ti-block.md)。
  - 互斥标签页布局：[TiLayoutTabs 标签布局](./ti-layout-tabs.md)。
  - 布局共享类型：`src/lib/shelf/layout/layout-types.ts`。
