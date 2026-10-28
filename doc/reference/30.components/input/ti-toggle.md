---
title: TiToggle 拨动开关
keywords: [拨动开关, 开关, toggle, TiToggle, switch, 滑动开关, 布尔开关]
status: draft
---

# TiToggle 拨动开关

## 介绍

`TiToggle` 是输入类（`INPUT`）的滑动拨动开关：一个轨道里的小滑块，左右拨动表示开 / 关。它与
`TiCheck` 共享同一套真假值映射（`values`、`isTrue`、两态文字 / 图标 / 提示），只是外观是滑动
轨道而非勾选方块。

使用时需要注意：

- 滑块与轨道的尺寸可通过 `style` 里的 CSS 变量（`--box-width`、`--btn-size` 等）微调。
- `values` 未声明时按 `value` 类型取 `[false, true]`（数字为 `[0, 1]`）。

源码目录：`src/lib/input/toggle/`。

## 例子

### JSON 配置

```json
{}
```

### Vue 标签调用

```xml
<TiToggle :value="true" @change="onChange" />
```

## 控件参数

### 数据

- **`value`（`any`）**：当前开关值；与 `values` 中某项相等即为"开"。
- **`values`（`[any, any]`）**：`[关值, 开值]`；切换时把对面那项作为 `change` 载荷发出。
- **`text`（`string | string[]`）**：两态文字；二元组区分开 / 关，支持 `i18n:` 前缀。
- **`icon`（`IconInput | [IconInput, IconInput]`）**：两态图标。
- **`tip`（`string | string[]`）**：两态悬浮提示。

### 行为

- **`isTrue`（`(val: any) => boolean`）**：自定义"是否算开"的判定。
- **`readonly`（`any`）**：只读条件，见 [共享 Props](../../10.concepts/02-common-props.md)。

### 外观

- **`type`（`LogicType`）**：开启态状态色。
- **`boxFontSize`（`AspectSize`）**：字号分级。
- **`width`（`string`）**：开关整体宽度。

### 回调

- **`tipable`（`TipableProps`）**：悬浮提示挂载配置，见 [共享 Props](../../10.concepts/02-common-props.md)。

### 嵌套

本组件未提供插槽，滑块、轨道、文字与图标全部由上述数据属性决定。

### 事件

- **`change`**：载荷为切换后的新值（`values` 中对应项）；拨动时触发。

> 本组件继承 `CommonProps`（`className`、`style`），字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单开关（`simple`）

**JSON 配置**

```json
{}
```

**Vue 标签**

```xml
<TiToggle />
```

### 数字值（`for-int`）

**JSON 配置**

```json
{
  "value": 1,
  "text": "Enable Check",
  "type": "warn",
  "boxFontSize": "t"
}
```

**Vue 标签**

```xml
<TiToggle :value="1" text="Enable Check" type="warn" box-font-size="t" />
```

### 带图标 · 文字（`with-icon-text`）

**JSON 配置**

```json
{
  "value": true,
  "text": ["i18n:no", "i18n:yes"],
  "icon": ["fas-radiation", "fas-check"],
  "boxFontSize": "h"
}
```

**Vue 标签**

```xml
<TiToggle
  :value="true"
  :text="['i18n:no', 'i18n:yes']"
  :icon="['fas-radiation', 'fas-check']"
  box-font-size="h"
/>
```

### 带图标 · 提示（`with-icon-tip`）

**JSON 配置**

```json
{
  "style": {
    "--space": "-1px",
    "--off-left": "-1px",
    "--btn-size": "2em",
    "--box-width": "4em",
    "--box-height": "1em",
    "--icon-size": "1.3em"
  },
  "value": 1,
  "type": "secondary",
  "icon": "fas-spinner fa-spin",
  "text": "i18n:ti-toggle-example-loading",
  "tip": "i18n:ti-toggle-example-loading-tip",
  "boxFontSize": "h"
}
```

**Vue 标签**

```xml
<TiToggle
  :style="{
    '--space': '-1px',
    '--off-left': '-1px',
    '--btn-size': '2em',
    '--box-width': '4em',
    '--box-height': '1em',
    '--icon-size': '1.3em'
  }"
  :value="1"
  type="secondary"
  icon="fas-spinner fa-spin"
  text="i18n:ti-toggle-example-loading"
  tip="i18n:ti-toggle-example-loading-tip"
  box-font-size="h"
/>
```

## 总结

`TiToggle` 适合设置项里的"开 / 关"开关；需要勾选方块外观用 `TiCheck`，需要一组选项切换用
`TiSwitcher`。它与 `TiCheck` 共享真假值映射，只是视觉不同。

## 延伸阅读

- **源码入口**
  - `src/lib/input/toggle/ti-toggle-index.ts` —— 注册表信息与示例配置。
  - `src/lib/input/toggle/ti-toggle-types.ts` —— `ToggleProps`。
  - `src/lib/input/toggle/TiToggle.vue` —— 视图与拨动接线。
- **相关文档**
  - 勾选方块：[ti-check](ti-check.md)。
  - 真假值映射 hook：`src/lib/_features/use-boolean-input.ts`。
