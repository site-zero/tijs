---
title: TiRoadblock 路障牌
keywords: [路障, roadblock, TiRoadblock, 占位, 空态, 提示牌, 遮盖, 加载, 视图]
status: draft
---

# TiRoadblock 路障牌

## 介绍

`TiRoadblock` 是视图类（`VIEW`）的通用"路障牌"：一个图标加一段文字（还可以挂一组链接），
用来表达空数据、加载中、警告、成功、错误、施工提示等各种"这里有情况"的占位状态。列表、
表格、墙贴等数据型视图在没有数据时，默认渲染的就是一个 `TiRoadblock`。

它由 `useIconText` 特性驱动，因此图标与文字都支持悬浮切换、点击触发、单独配色。

使用时需要注意：

- 图标或文字为空时对应区块不渲染；两者都为空则整块不显示。
- 点击事件只在 `iconClickable` / `textClickable` 为真时才会触发，否则只是普通展示。
- `opacity` 传字符串（`faint` / `shadowy`）走预定义透明度类，传数字则写成内联 `opacity`。

源码目录：`src/lib/view/roadblock/`。

## 例子

### JSON 配置

```json
{
  "text": "Attention please"
}
```

### Vue 标签调用

```xml
<TiRoadblock text="Attention please" />
```

## 控件参数

### 数据

- **`text`（`string`，无默认值）**：提示文字；为空时不渲染文字区，最终兜底显示
  `i18n:nil`。
- **`icon`（`IconInput`，默认 `"fas-exclamation-triangle"`）**：提示图标；为空时不渲染
  图标区。
- **`hoverIcon`（`IconInput`，无默认值）**：图标悬浮态时切换显示的图标。
- **`hoverText`（`string`，无默认值）**：文字悬浮态时切换显示的文字。
- **`links`（`RoadblockLink[]`，无默认值）**：底部链接列表，每项形如
  `{ icon?, text, href?, target? }`，非空时渲染成一组 `<a>`。

### 行为

- **`autoI18n`（`boolean`，默认 `true`）**：是否对 `text`、链接 `text` 做 `i18n:`
  前缀解析。
- **`iconClickable`（`boolean`，无默认值）**：为真时图标可点击，并能触发 `click-icon`。
- **`textClickable`（`boolean`，无默认值）**：为真时文字可点击，并能触发 `click-text`。

### 外观

- **`mode`（`"cover" | "fit" | "auto"`，默认 `"fit"`）**：填充模式，决定路障牌如何占满
  或适应父容器。
- **`layout`（`"A" | "B" | "C"`，默认 `"A"`）**：图标与文字的排版方向；`size` 未指定时，
  `B` 布局图标默认 `m`，其余默认 `b`。
- **`size`（`AspectSize`，无默认值）**：图标与文字尺度 `t / s / m / b / h`；图标尺寸随
  之映射为 `s16 / s32 / s64 / s128 / s256`。
- **`opacity`（`"faint" | "shadowy" | number`，无默认值）**：遮罩透明度。
- **`style`（`Vars`，无默认值）**：整体内联样式，并作用于字号。
- **`iconClass`（`any`，无默认值）**：图标区附加类名。
- **`iconStyle`（`Vars`，无默认值）**：图标区内联样式。
- **`textClass`（`any`，无默认值）**：文字区附加类名。
- **`textStyle`（`Vars`，无默认值）**：文字区内联样式。

### 回调

本组件无独立回调参数；可点击行为通过 `iconClickable` / `textClickable` + 事件实现。

### 嵌套

本组件未提供插槽，图标、文字、链接全部由上述属性决定。

### 事件

- **`click-icon`**：`iconClickable` 为真且图标非空时，点击图标触发，无业务载荷。
- **`click-text`**：`textClickable` 为真且文字非空时，点击文字触发，无业务载荷。

> 本组件继承 `CommonProps`（`className`、`style`）与 `IconTextProps` 的图标/文字样式
> 体系，字段含义见 [共享 Props](../../10.concepts/02-common-props.md)，本篇不再罗列。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单（`simple`）

**JSON 配置**

```json
{
  "text": "Attention please"
}
```

**Vue 标签**

```xml
<TiRoadblock text="Attention please" />
```

### 警告（`warn`）

**JSON 配置**

```json
{
  "className": "is-warn-r",
  "icon": "fas-person-digging",
  "text": "Construction ahead please detour"
}
```

**Vue 标签**

```xml
<TiRoadblock class="is-warn-r" icon="fas-person-digging" text="Construction ahead please detour" />
```

### 彩色（`color`）

**JSON 配置**

```json
{
  "icon": "fas-person-digging",
  "text": "Construction ahead please detour",
  "style": {
    "color": "rgba(255,255,255,0.4)",
    "background": "linear-gradient(45deg, blue, red)"
  }
}
```

**Vue 标签**

```xml
<TiRoadblock
  icon="fas-person-digging"
  text="Construction ahead please detour"
  :style="{ color: 'rgba(255,255,255,0.4)', background: 'linear-gradient(45deg, blue, red)' }"
/>
```

### 大型（`large`）

**JSON 配置**

```json
{
  "size": "large",
  "icon": "fas-person-digging",
  "text": "Construction ahead please detour"
}
```

**Vue 标签**

```xml
<TiRoadblock size="large" icon="fas-person-digging" text="Construction ahead please detour" />
```

> 注册表示例里写的是 `"large"`，但 `size` 的合法取值是 `AspectSize`（`t/s/m/b/h`）；
> `"large"` 当前不会匹配到任何尺度映射，属于示例与类型不一致，实际请用 `b` 或 `h`。

### 遮盖（`cover`）

**JSON 配置**

```json
{
  "className": "is-warn-r",
  "mode": "cover",
  "size": "big",
  "icon": "fas-people-carry-box",
  "text": "Handle it gently",
  "opacity": "shadowy"
}
```

**Vue 标签**

```xml
<TiRoadblock
  class="is-warn-r"
  mode="cover"
  size="big"
  icon="fas-people-carry-box"
  text="Handle it gently"
  opacity="shadowy"
/>
```

> 同上，`size: "big"` 也非 `AspectSize` 合法值，属于示例与类型不一致。

### 阴影（`shadow`）

**JSON 配置**

```json
{
  "className": "is-success-r",
  "icon": "fas-people-carry-box",
  "text": "Handle it gently",
  "style": {
    "text-shadow": "6px 6px 6px #000"
  }
}
```

**Vue 标签**

```xml
<TiRoadblock
  class="is-success-r"
  icon="fas-people-carry-box"
  text="Handle it gently"
  :style="{ 'text-shadow': '6px 6px 6px #000' }"
/>
```

### 链接（`links`）

**JSON 配置**

```json
{
  "className": "is-success-r",
  "icon": "fas-circle-check",
  "text": "Executed successfully",
  "links": [
    { "icon": "fas-download", "text": "Download", "target": "_blank", "href": "http://vuejs.org" },
    { "icon": "fas-calendar-check", "text": "Show Date", "target": "_blank", "href": "http://vuejs.org" },
    { "icon": "fas-book", "text": "Book", "target": "_blank", "href": "http://vuejs.org" }
  ]
}
```

**Vue 标签**

```xml
<TiRoadblock class="is-success-r" icon="fas-circle-check" text="Executed successfully" :links="links" />
```

### 定制（`customized`）

**JSON 配置**

```json
{
  "className": "is-info-r",
  "icon": "fas-carrot",
  "text": "Health Importent",
  "hoverIcon": "fas-truck",
  "hoverText": "Sleep More",
  "iconClickable": true,
  "textClickable": true,
  "iconClass": "is-error",
  "iconStyle": {
    "border": "5px solid #000",
    "padding": "60px",
    "borderRadius": "50%",
    "background": "#FFF"
  },
  "style": {
    "color": "#FFF",
    "background": "linear-gradient(90deg, black 0%, white 50%, black 100%)"
  }
}
```

**Vue 标签**

```xml
<TiRoadblock
  class="is-info-r"
  icon="fas-carrot"
  text="Health Importent"
  hover-icon="fas-truck"
  hover-text="Sleep More"
  icon-clickable
  text-clickable
/>
```

## 总结

`TiRoadblock` 是整个视图体系的"占位语汇"：空数据、加载、警告、成功都用它表达，再靠
`className`（如 `is-warn-r`、`is-success-r`）切换状态色。需要旋转加载态用预设好的
`TiLoading`；需要进度条与日志用 `TiProcess`；列表 / 表格 / 墙贴的空态则通过各自的
`emptyRoadblock` 属性传入定制配置。

## 延伸阅读

- **源码入口**
  - `src/lib/view/roadblock/ti-roadblock-index.ts` —— 注册表信息与示例配置。
  - `src/lib/view/roadblock/ti-roadblock-types.ts` —— `RoadblockProps`、`RoadblockMode` 等。
  - `src/lib/view/roadblock/TiRoadblock.vue` —— 图标 / 文字 / 链接三段式模板。
  - `src/lib/view/roadblock/use-roadblock.ts` —— 尺寸、类名、悬浮与点击分发。
- **相关文档**
  - 图标文字特性（`IconTextProps` / `useIconText`）：[use-icon-text](../../40.features/shared/use-icon-text.md)。
  - 加载占位：[ti-loading](ti-loading.md)。
  - 状态色与尺度变量：[样式系统](../../10.concepts/05-style-system.md)。
