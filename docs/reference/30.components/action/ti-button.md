---
title: TiButton 按钮
keywords: [按钮, button, TiButton, click, action, 命令按钮, 动作控件]
status: draft
---

# TiButton 按钮

## 介绍

`TiButton` 是动作类（`ACTION`）命令按钮，用于在页面上触发一次用户命令：提交、取消、
删除、返回、拍照等。它本身不收集表单值，职责是"被点击 → 发出事件或调用回调"，可以带
图标、文字和点击载荷。

使用时需要注意：

- 按钮根节点是 `<a href="javascript:void(0)">`，`inheritAttrs: false`，外部传入的
  普通属性不会自动落到根节点上。
- 声明 `action` 回调后，组件不再向外 `emit` 事件，二者互斥。
- 成排的按钮建议放进 `TiActionBar` 统一管理间距与对齐。

源码目录：`src/lib/action/button/`。

## 例子

### JSON 配置

```json
{
  "type": "primary",
  "text": "保存",
  "icon": "fas-save"
}
```

### Vue 标签调用

```xml
<TiButton
  type="primary"
  text="保存"
  icon="fas-save"
  @click="onSave"
/>
```

## 控件参数

### 数据

- **`value`（`any`，无默认值）**：点击时携带的载荷，会作为参数传给 `action`，或作为
  `click` 事件的载荷向外发出。
- **`text`（`string`，默认 `"Button"`）**：按钮上显示的文字；`autoI18n` 开启时支持
  `i18n:` 前缀。
- **`icon`（`IconInput`，无默认值）**：显示在文字左侧的图标，传入图标名即可。

### 行为

- **`autoI18n`（`boolean`，默认 `true`）**：是否对 `text` 做 `i18n:` 前缀解析；关闭后
  文字按原样显示。
- **`stopPropagation`（`boolean`，无默认值）**：点击时是否调用原生
  `Event.stopPropagation()` 拦截冒泡。

### 外观

- **`type`（`LogicType`，默认 `"primary"`）**：按钮状态色，可取 `primary`、`secondary`、
  `success`、`warn`、`danger`、`info`、`track`、`disable`、`text`、`number`、`tip`、
  `star`、`fog`。
- **`colorMode`（`"box" | "text" | "no-bg"`，默认 `"box"`）**：`"box"` 主色铺背景、
  浅色作文字；`"text"` 主色作文字、浅色铺背景，悬浮态对调。
- **`boxFontSize`（`AspectSize`，默认 `"m"`）**：字号分级，取值 `t / s / m / b / h`。
- **`boxPadding`（`AspectSize`，默认 `"m"`）**：内边距分级。
- **`boxRadius`（`AspectSize | "none"`，默认 `"m"`）**：圆角分级，`"none"` 表示直角。
- **`showBorder`（`boolean | string | number`，默认 `true`）**：边框宽度；传布尔值渲染
  `1px`，传数字渲染对应像素，传字符串直接作为边框宽度值；传 `false` 关闭边框。
- **`align`（`CssAlignment`，默认 `"center"`）**：文字对齐方式，`left / right / center`。
- **`width`（`string`，无默认值）**：按钮固定宽度，如 `"180px"`。
- **`minWidth`（`string`，无默认值）**：按钮最小宽度。

### 回调

- **`action`（`(payload: any) => void`，无默认值）**：声明后点击时直接调用
  `action(props.value)`，**不再触发 `click` 事件**；适合在容器内部直接绑定处理函数。

### 嵌套

本组件未提供插槽，图标与文字分别由 `icon`、`text` 属性决定，不支持通过 slot 自定义
按钮内部结构。

### 事件

- **`click`**：载荷为 `props.value`；点击按钮时触发。若声明了 `action`，本事件不会发出。

> 本组件同时继承 `CommonProps`（`className`、`style`），字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)，本篇不再罗列。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应，先给 JSON 配置，再给等价的 Vue 标签写法。

### 简单按钮（`simple-button`）

**JSON 配置**

```json
{}
```

**Vue 标签**

```xml
<TiButton />
```

### 颜色按钮（`with-color`）

**JSON 配置**

```json
{
  "type": "danger"
}
```

**Vue 标签**

```xml
<TiButton type="danger" />
```

### 图标按钮（`with-icon`）

**JSON 配置**

```json
{
  "type": "info",
  "icon": "zmdi-camera-roll",
  "text": "Take a photo",
  "width": "180px",
  "boxFontSize": "b"
}
```

**Vue 标签**

```xml
<TiButton
  type="info"
  icon="zmdi-camera-roll"
  text="Take a photo"
  width="180px"
  box-font-size="b"
/>
```

### 带参数按钮（`with-args`）

**JSON 配置**

```json
{
  "type": "warn",
  "icon": "fas-igloo",
  "text": "Back To Home",
  "minWidth": "180px",
  "boxFontSize": "b",
  "value": { "lat": 23.123, "lng": 113.456 }
}
```

**Vue 标签**

```xml
<TiButton
  type="warn"
  icon="fas-igloo"
  text="Back To Home"
  min-width="180px"
  box-font-size="b"
  :value="{ lat: 23.123, lng: 113.456 }"
  @click="onBackHome"
/>
```

> 注册表原示例里使用的 `payload` 字段未在 `ButtonProps` 中声明；实际传点击载荷请使用
> `value`。

### 国际化文字（`use-i18n`）

**JSON 配置**

```json
{
  "type": "success",
  "icon": "fas-fire-burner",
  "text": "i18n:ti-button-example-use-i18n-text",
  "minWidth": "380px",
  "boxFontSize": "h",
  "boxPadding": "b",
  "value": 3.1415926
}
```

**Vue 标签**

```xml
<TiButton
  type="success"
  icon="fas-fire-burner"
  text="i18n:ti-button-example-use-i18n-text"
  min-width="380px"
  box-font-size="h"
  box-padding="b"
  :value="3.1415926"
/>
```

## 总结

`TiButton` 适合单个命令入口：需要成排动作、统一间距与危险/普通操作分组时，改用
`TiActionBar`；需要在表单内部直接绑定处理逻辑而不暴露事件时，使用 `action` 回调；
需要文字按钮、纯图标按钮等变体时，通过 `colorMode` 与 `showBorder` 组合调整，而不是
另选其他组件。

## 延伸阅读

- **源码入口**
  - `src/lib/action/button/ti-button-index.ts` —— 注册表信息与示例配置。
  - `src/lib/action/button/ti-button-types.ts` —— `ButtonProps`、`ButtonEmitter`。
  - `src/lib/action/button/TiButton.vue` —— 视图与点击逻辑。
- **相关文档**
  - 状态色变量来源：[样式系统](../../10.concepts/05-style-system.md)。
  - 动作栏批量组织按钮：[TiActionBar 动作条](./ti-action-bar.md)。
  - 事件回写规则：[事件绑定](../../10.concepts/03-event-binding.md)。