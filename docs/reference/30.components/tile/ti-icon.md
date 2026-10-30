---
title: TiIcon 图标
keywords: [图标, icon, TiIcon, font-icon, svg, emoji, 图片图标, TILE]
status: draft
---

# TiIcon 图标

## 介绍

`TiIcon` 是小片类（`TILE`）的统一图标渲染控件，把一个 `IconInput` 值渲染成三种形态之一：
字体图标（`<i class="...">`）、Emoji 字符、或图片（`<img src="...">`）。图标本身带
`width / height / color / opacity` 等样式，可以点击并向外抛出 `click`。

它不收集表单值；要显示哪个图标由 `value` 决定，`value` 缺省时回退 `defaultValue`。

使用时需要注意：

- `value` 经 `Icons.toIconObj` 归一化：字符串按字体 / 图片地址解释，对象可显式指定
  `type: "font" | "emoji" | "image"` 及其样式。
- 颜色有两条路：`color` 直接给色值，或 `logicType` 映射到 `--ti-color-*`；`value` 对象里
  自带的 `logicType` 优先于外层 `logicType`。
- 图片图标才认 `objectFit`；字体 / Emoji 图标认 `fontSize`、`color`。

源码目录：`src/lib/tile/icon/`。

## 例子

### JSON 配置

```json
{
  "value": "zmdi-slideshare"
}
```

### Vue 标签调用

```xml
<TiIcon value="zmdi-slideshare" />
```

## 控件参数

### 数据

- **`value`（`IconInput`，无默认值）**：要显示的图标；字符串可指字体图标名或图片地址，对象
  形如 `{ type, value, logicType, className, src, style }`。
- **`defaultValue`（`IconInput`，无默认值）**：`value` 为空时回退显示的图标。
- **`tip`（`string`，无默认值）**：悬浮提示文本，写到根元素 `data-tip`。
- **`vars`（`Vars`，无默认值）**：点击时携带的载荷上下文；缺省时点击载荷为归一化后的
  `IconObj`。
- **`base`（`string`，无默认值）**：类型已声明，当前版本视图与 hook 均未消费，保留备用。
- **`dict`（`TiDict`，无默认值）**：类型已声明，当前版本视图与 hook 均未消费，保留备用。

### 行为

- **`canHover`（`boolean`，无默认值）**：开启后加 `can-hover` 样式类，用于悬浮态视觉反馈。

### 外观

- **`width` / `height`（`number | string`，无默认值）**：根元素宽高。
- **`opacity`（`number`，无默认值）**：整体不透明度。
- **`fontSize`（`number | string`，无默认值）**：字体 / Emoji 图标字号。
- **`color`（`string | TiColor`，无默认值）**：字体 / Emoji 图标颜色。
- **`logicType`（`LogicType`，无默认值）**：状态色，映射到 `var(--ti-color-*)`；`value` 对象
  自带的 `logicType` 优先。
- **`objectFit`（`"contain" | "cover" | "fill" | "scale-down"`，无默认值）**：仅图片图标生效，
  对应 `<img>` 的 `object-fit`。
- **`style`（`Vars`，无默认值）**：根元素追加的内联样式。
- **`imgStyle`（`Vars`，无默认值）**：图片图标部分追加的内联样式。
- **`fontStyle`（`Vars`，无默认值）**：字体 / Emoji 图标部分追加的内联样式。

### 回调

本组件无此组参数。

### 嵌套

本组件未提供插槽，图标完全由 `value` 决定，不支持通过 slot 替换内部结构。

### 事件

- **`click`**：点击图标时触发；载荷为 `props.vars`，未声明 `vars` 时为归一化后的 `IconObj`。

> 本组件同时继承 `CommonProps`（`className`、`style`），`className` 会额外叠加
  `is-type-<类型>` 与 `can-hover`；字段含义见 [共享 Props](../../10.concepts/02-common-props.md)，
  本篇不再罗列。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单图标（`simple-icon`）

**JSON 配置**

```json
{
  "value": "zmdi-slideshare"
}
```

**Vue 标签**

```xml
<TiIcon value="zmdi-slideshare" />
```

### 颜色图标（`color-icon`）

**JSON 配置**

```json
{
  "className": "s128",
  "value": "fas-snowflake",
  "color": "#F00",
  "opacity": 0.8
}
```

**Vue 标签**

```xml
<TiIcon class-name="s128" value="fas-snowflake" color="#F00" :opacity="0.8" />
```

### 通过值设置颜色（`color-icon-val`）

**JSON 配置**

```json
{
  "className": "s128",
  "value": {
    "type": "font",
    "logicType": "info",
    "value": "fas-snowflake"
  },
  "opacity": 0.8
}
```

**Vue 标签**

```xml
<TiIcon
  class-name="s128"
  :value="{ type: 'font', logicType: 'info', value: 'fas-snowflake' }"
  :opacity="0.8"
/>
```

### 图片图标（`image-icon`）

**JSON 配置**

```json
{
  "className": "s128",
  "value": "/ti-logo.png"
}
```

**Vue 标签**

```xml
<TiIcon class-name="s128" value="/ti-logo.png" />
```

### SVG 图标（`svg-icon`）

**JSON 配置**

```json
{
  "className": "s256",
  "value": "/dna.svg"
}
```

**Vue 标签**

```xml
<TiIcon class-name="s256" value="/dna.svg" />
```

## 总结

`TiIcon` 适合在任意位置单独渲染一个可点击图标：列表前缀、状态标记、操作入口。需要图文组合
或带边框状态块时，用 `TiLabel` / `TiThumb` 等带容器的展示件；需要按比例裁切的图片展示用
`TiImage`。`base` 与 `dict` 当前版本尚未接线。

## 延伸阅读

- **源码入口**
  - `src/lib/tile/icon/ti-icon-index.ts` —— 注册表信息与示例配置。
  - `src/lib/tile/icon/ti-icon-types.ts` —— `IconProps`、`IconEmitter`。
  - `src/lib/tile/icon/TiIcon.vue` —— 三种图标形态的视图与点击。
  - `src/lib/tile/icon/use-icon.ts` —— 按图标类型计算局部样式。
- **相关文档**
  - 状态色与尺度变量：[样式系统](../../10.concepts/05-style-system.md)。
  - 图片展示：[ti-image](ti-image.md)。
  - 前缀 / 后缀图标动作：[ti-label](ti-label.md)。
