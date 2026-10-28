---
title: TiLabel 标签
keywords: [标签, label, TiLabel, 展示, 前缀图标, 后缀图标, 复制, 超链接, 字典翻译]
status: draft
---

# TiLabel 标签

## 介绍

`TiLabel` 是小片类（`TILE`）的纯展示控件，用来在表格单元格、列表项、表单只读区、卡片里
呈现一个值：可以带状态色、前后缀图标、占位文本、悬浮提示，也可以把值渲染成超链接，或在
按下修饰键点击时把文字 / 原始值复制到剪贴板。

它不收集输入、不弹出面板；值来自 `value`，需要把编码值翻译成展示文字时，交给字典完成。

使用时需要注意：

- 值为空（`""`、`null`、`undefined`）时按空值样式显示占位文本；是否算空值可以用 `hasValue`
  自定义。
- 超链接只在值非空时渲染；`href` 模板里的 `value` 键会被当前值覆盖。
- 前缀 / 后缀图标的动作由 `prefixIconFor`、`suffixIconFor` 指定，未声明动作的图标不可点击。

源码目录：`src/lib/tile/label/`。

## 例子

### JSON 配置

```json
{
  "value": "待处理",
  "type": "info"
}
```

### Vue 标签调用

```xml
<TiLabel value="待处理" type="info" />
```

## 控件参数

### 数据

- **`value`（`any`，无默认值）**：要展示的原始值；空值走占位文本。
- **`placeholder`（`string`，无默认值）**：空值时显示的占位文本。
- **`autoI18n`（`boolean`，默认 `true`）**：是否对 `placeholder` 与展示文字做 `i18n:`
  前缀解析。
- **`tip`（`string`，无默认值）**：悬浮提示文本，写到元素的 `data-tip` 上。
- **`vars`（`Vars`，无默认值）**：`href` 模板的变量上下文；其中 `value` 键会被当前值
  覆盖，单独设置无效。
- **字典翻译**：`options`、`dictVars`、`getIcon`、`getText`、`getTip`、`getValue` 来自
  字典配置，用于把 `value` 翻译成标准选项的文字与图标；规则见
  [字典模型](../../10.concepts/06-dict-model.md)。
- **显示文字选择**：`getDisplayText`（`string`）指定从选项取哪个字段作为展示文字；
  `useRawValue`（`boolean`）开启后直接显示原始值，不做选项翻译。
- **值管道**：`valueCase`、`trimed`、`valuePiping`、`pipeContext`、`pipeProcessers`
  属于展示前的值规整管道，字段含义见 [use-value-input](../../40.features/value/use-value-input.md)。
- **`prefixIcon`（`IconInput | null`，无默认值）**：前缀图标；传 `null` 显式清空。
- **`prefixHoverIcon`（`IconInput | null`，无默认值）**：前缀图标悬浮态图标。
- **`suffixIcon`（`IconInput | null`，无默认值）**：后缀图标；传 `null` 显式清空。
- **`suffixHoverIcon`（`IconInput | null`，无默认值）**：后缀图标悬浮态图标。

### 行为

- **`hasValue`（`(val: any) => boolean`，无默认值）**：自定义空值判定；未声明时
  `""`、`null`、`undefined` 视为空值。判定结果决定 `has-value / nil-value` 样式类。
- **`captureClick`（`boolean`，无默认值）**：点击时是否调用 `stopPropagation()` 拦截
  原生冒泡。
- **`clickable`（`boolean`，无默认值）**：是否显示手型光标（`can-click` 类）。
- **`nowrap`（`boolean`，默认 `true`）**：超长文字是否单行省略号；关闭后允许换行折行。
- **`clickForCopy`（`string | [string, string]`，默认 `["ctrl", "ctrl+shift"]`）**：
  点击复制的修饰键；单值只配置复制展示文字，二元组第一项复制展示文字、第二项复制原始值。
  可选修饰键 `alt / ctrl / shift / meta`，组合用 `+` 连接。
- **`autoPrefixIcon`（`boolean`，无默认值）**：开启后按字典选项自动设置前缀图标；当前
  版本类型已声明，视图尚未接线，后续版本生效。
- **`disable`（`boolean`，无默认值）**：类型中已声明，当前版本视图未消费，保留备用。

### 外观

- **`type`（`LogicType`，无默认值）**：状态色，取值与 `TiButton` 一致：`primary`、
  `secondary`、`success`、`warn`、`danger`、`info`、`track`、`disable`、`text`、
  `number`、`tip`、`star`、`fog`。
- **`colorMode`（`BoxColorMode`，默认 `"text"`）**：`"box"` 主色铺底，`"text"` 主色
  作文字，`"no-bg"` 只着色文字与图标、不留背景。
- **`boxInherit`（`("border" | "bg" | "text")[]`，无默认值）**：指定哪些颜色通道继承
  父级，覆盖 `type` 对应的颜色变量。
- **`boxFontSize`（`AspectSize`，默认 `"s"`）**：字号分级 `t / s / m / b / h`。
- **`boxPadding`（`AspectSize`，默认 `"s"`）**：内边距分级。
- **`boxRadius`（`AspectSize | "none"`，默认 `"s"`）**：圆角分级。
- **`showBorder`（`boolean`，无默认值）**：是否显示边框。
- **`align`（`CssAlignment`，无默认值）**：文字对齐 `left / right / center`。
- **`width`（`string`，无默认值）**：固定宽度，如 `"200px"`。
- **`valuePartStyle`（`Vars`，无默认值）**：文字部分单独追加的内联样式。

### 回调

- **`href`（`string | ((ctx: Vars) => string)`，无默认值）**：超链接地址；字符串走
  `Tmpl` 模板渲染，函数直接返回地址。值非空时渲染为 `<a target="_blank">`，值为空则
  只渲染普通文本。
- **`prefixIconFor`（`LabelIconFor`，无默认值）**：前缀图标的可点击动作，取值：
  - `"clear"`：点击后 `emit("change", null)`；
  - `"copy"`：复制当前展示文字；
  - `"copy-raw"`：复制原始值；
  - `"click"`：触发 `click-prefix-icon` 事件；
  - 函数：直接调用 `(labelApi) => void` 自定义动作。
- **`suffixIconFor`（`LabelIconFor`，无默认值）**：后缀图标动作，取值同上；`"click"`
  触发 `click-suffix-icon` 事件。

### 嵌套

本组件未提供插槽，文字、图标全部由上述数据与图标属性决定；不支持通过 slot 替换内部结构。

### 事件

- **`change`**：前缀图标动作为 `"clear"` 时触发，载荷固定为 `null`。
- **`click-prefix-icon`**：前缀图标动作为 `"click"` 时触发，载荷为组件内部 `LabelApi`
  （`DisplayValue`、`RawValue`、`Href`、`updateDisplay` 等）。
- **`click-suffix-icon`**：后缀图标动作为 `"click"` 时触发，载荷同为 `LabelApi`。

> 本组件同时继承 `CommonProps`（`className`、`style`），字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)，本篇不再罗列。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单标签（`simple`）

**JSON 配置**

```json
{
  "value": "Hello Label"
}
```

**Vue 标签**

```xml
<TiLabel value="Hello Label" />
```

### 类型颜色（`type-color`）

**JSON 配置**

```json
{
  "value": "Hello Color Label Hello Color Label Hello Color Label",
  "width": "200px",
  "type": "info",
  "nowrap": true,
  "showBorder": true,
  "colorMode": "box",
  "boxRadius": "m",
  "boxFontSize": "m",
  "boxPadding": "b"
}
```

**Vue 标签**

```xml
<TiLabel
  value="Hello Color Label Hello Color Label Hello Color Label"
  width="200px"
  type="info"
  :nowrap="true"
  :show-border="true"
  color-mode="box"
  box-radius="m"
  box-font-size="m"
  box-padding="b"
/>
```

### 带图标（`with-icon`）

**JSON 配置**

```json
{
  "value": "Hello Icon Label",
  "nowrap": true,
  "showBorder": true,
  "colorMode": "text",
  "prefixIcon": "zmdi-cake",
  "prefixIconFor": "clear",
  "suffixIcon": "zmdi-apple",
  "suffixIconFor": "copy",
  "width": "200px",
  "placeholder": "without value"
}
```

**Vue 标签**

```xml
<TiLabel
  value="Hello Icon Label"
  :nowrap="true"
  :show-border="true"
  color-mode="text"
  prefix-icon="zmdi-cake"
  prefix-icon-for="clear"
  suffix-icon="zmdi-apple"
  suffix-icon-for="copy"
  width="200px"
  placeholder="without value"
/>
```

### 带超链接（`with-href`）

**JSON 配置**

```json
{
  "value": "Lookup Hello",
  "href": "https://bing.com/search?q=${value}"
}
```

**Vue 标签**

```xml
<TiLabel value="Lookup Hello" href="https://bing.com/search?q=${value}" />
```

## 总结

`TiLabel` 适合只读展示单个值：表格单元格、列表项、状态标记、字段只读回显。需要一组并列
标签时使用 `TiLabelTags`；需要可录入的同类展示请改用 `TiInputText` 等输入控件；需要
弹出面板选择值时，选择 `TiDroplist` 等输入类控件。

## 延伸阅读

- **源码入口**
  - `src/lib/tile/label/ti-label-index.ts` —— 注册表信息与示例配置。
  - `src/lib/tile/label/ti-label-types.ts` —— `LabelProps`、`LabelEmitter`、`LabelApi`。
  - `src/lib/tile/label/TiLabel.vue` —— 视图与状态接线。
  - `src/lib/tile/label/use-label.ts` —— 值、字典翻译与超链接计算。
  - `src/lib/tile/label/use-label-aspect.ts` —— 状态类名与颜色 / 尺度变量。
  - `src/lib/tile/label/use-label-icon.ts` —— 前后缀图标与动作分发。
  - `src/lib/tile/label/use-click-copy.ts` —— 修饰键点击复制。
- **相关文档**
  - 字典值到文字 / 图标的翻译规则：[字典模型](../../10.concepts/06-dict-model.md)。
  - 状态色与尺度变量：[样式系统](../../10.concepts/05-style-system.md)。
  - 并列标签组：[TiLabelTags 选项标签](./ti-label-tags.md)。
