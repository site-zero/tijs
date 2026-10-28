---
title: TiInput 输入框
keywords: [输入框, input, TiInput, box3, 文本输入, 自动补全, 提示列表, 字典, 可输入下拉]
status: draft
---

# TiInput 输入框

## 介绍

`TiInput` 是输入类（`INPUT`）的基础输入框（内部代号 box3），相当于一个被 TiJS 打磨过的
`<input>`：它在原生输入能力之上叠加了占位文本、前后缀图标、只读、值规整管线、字典选项、
可弹出的提示列表（自动补全 / 下拉候选）与尺寸计数。它是 `TiInputText`、`TiInputPassword`、
`TiInputNum`、`TiDroplist` 等变体的能力底座。

它可以工作在两种形态之间：

- **可输入**：用户自由键入，输入框实时弹出匹配的候选提示列表；
- **只读下拉**：关闭 `canInput` 后，它变成一个只能从候选列表里选择的下拉框。

使用时需要注意：

- 值为空字符串时默认会规整成 `null`；想区分空串与 `null`，打开 `keepEmptyValue`。
- 聚焦一个可编辑输入框时，默认会把内容切换成原始值；不希望暴露原始编码（如 UUID）时，
  打开 `useTextWhenFocus`。
- 前后缀图标的点击动作由 `prefixIconFor` / `suffixIconFor` 指定，未声明动作的图标不可点击。

源码目录：`src/lib/input/box3/`。

## 例子

### JSON 配置

```json
{
  "value": "CN",
  "placeholder": "Country Code",
  "options": "#Countries",
  "mustInOptions": true
}
```

### Vue 标签调用

```xml
<TiInput
  value="CN"
  placeholder="Country Code"
  options="#Countries"
  :must-in-options="true"
  @change="onChange"
/>
```

## 控件参数

### 数据

- **`value`（`any`，无默认值）**：输入框当前值；空串默认规整为 `null`。
- **`valueType`（`"raw-item" | "std-item" | "val"`，默认 `"val"`）**：值的形态——选项原生对象、
  标准选项对象，或纯值。
- **`lookup`（`ItemLookupInput | ItemLookupInput[] | ItemMatcher`）**：提示匹配键，快捷写法形如
  `"^~value"`（按值前缀匹配、忽略大小写）、`"*~text"`（按文本包含匹配），详见字典说明。
- **`tipFormat`（`"T" | "VT" | "TV" | "VTP" | "TP" | "PT" | "VpT"`）**：提示列表项的快速排版格式，
  决定 value/text/tip 三块的组合顺序。
- **`prefixIcon` / `prefixHoverIcon`（`IconInput | null`）**：前缀图标与悬浮态图标。
- **`suffixIcon` / `suffixHoverIcon`（`IconInput | null`）**：后缀图标与悬浮态图标。
- **`openLink`（`string | Convertor<AnyOptionItem, string>`）**：图标动作 `"open"` 时用来生成链接的
  模板或转换函数；未声明时直接把 `value` 作为链接。
- **选项来源**：`options`、`dictVars`、`mustInOptions`、`getOptionIcon/Text/Tip/Value`、
  `optionKeepRaw` 属于字典配置，规则见 [字典模型](../../10.concepts/06-dict-model.md)。
- **显示文字选择**：`getDisplayText`（如 `"tip|text|value"`）指定从选项取哪个字段展示；
  `useRawValue` 开启后直接显示原始值。
- **值管道**：`valueCase`、`trimed`、`beforeValueProcessors`、`afterValueProcessors`、`boxVars`、
  `renderHint`、`hintVars` 属于输入值规整与查询提示编译，字段含义见
  [use-value-input](../../40.features/value/use-value-input.md)。

### 行为

- **`canInput`（`boolean`）**：是否允许用户直接键入；关闭后只弹出候选列表，退化为只读下拉。
- **`keepEmptyValue`（`boolean`）**：保留空字符串而非规整为 `null`，用于区分空串与未设置。
- **`tipShowTime`（`"focus" | "auto" | (input: string) => boolean`）**：提示列表显示时机——聚焦即显示、
  需要时才显示，或自定义判定函数。
- **`tipShowDelay`（`number`，默认 `500`）**：输入反弹跳多少毫秒后才查询提示；同时影响值管道的
  反弹跳阈值。
- **`autoSelect`（`boolean`）**：聚焦输入框时是否自动全选内容。
- **`autoFocus`（`boolean`）**：控件创建时是否自动聚焦。
- **`useTextWhenFocus`（`boolean`）**：聚焦时是否仍显示翻译后的可读文本，而不是切成原始值。
- **`forceCookHint`（`boolean`）**：重载选项时无论提示是否为空，都强制走 `dict.queryData` 查询。
- **`tipUseHint`（`boolean`，默认 `false`）**：查询提示时是否采用用户输入的字符串作为关键词。
- **`showDebugInfo`（`boolean`）**：是否在界面上输出调试信息。
- **只读与占位**：`readonly`、`placeholder`、`autoI18n` 等共享字段见
  [共享 Props](../../10.concepts/02-common-props.md)。

### 外观

- **`type`（`LogicType`）**：状态色，取值集合与 `TiButton` 一致。
- **`hideBorder`（`boolean`）**：是否隐藏输入框边框。
- **`align`（`CssAlignment`，默认左对齐）**：文字对齐方式。
- **`boxFontSize` / `boxPadding` / `boxRadius`（`AspectSize | "none"`）**：字号 / 内边距 / 圆角分级。
- **`width`（`string`）**：固定宽度，如 `"200px"`。
- **`flexAuto`（`boolean`）**：在 flex 父容器里自动撑满宽度。
- **`inputStyle` / `partMainStyle` / `mainBodyStyle`（`Vars`）**：输入元素、主内容区的追加内联样式。
- **`tipListWidth` / `tipListMinWidth`（`string`）**：提示列表的宽度约束，缺省与输入框同宽。
- **`tipItemTagStyles`（`{ text?, tip?, value? }`）**：提示项内 value/text/tip 各段的自定义样式。
- **`autoPrefixIcon`（`boolean`）**：声明字典且 `mustInOptions` 时，按选项自动设置前缀图标。
- **尺寸计数**：`maxSize`、`showSizeAt`、`showSizeWhen`、`forceShowSizeWhen`、`safesizeTipType`、
  `fullsizeTipType`、`oversizeTipType` 控制右上角字数统计的位置、显示时机与各档颜色。

### 回调

- **`onValueChange`（`(val: any) => void`）**：绕开事件机制的值变化回调，需要在容器内直接拿到值时用。
- **`prefixIconFor` / `suffixIconFor`（`BoxIconFor<A>`）**：图标点击动作，取值：
  - `"clear"`：清空值；
  - `"load-options"`：重新加载 / 弹出选项；
  - `"copy"`：复制当前值；
  - `"open"`：按 `openLink` 打开链接；
  - `"click"`：向外发出 `click:prefix-icon` / `click:suffix-icon` 事件；
  - 函数：`(boxApi) => void` 完全自定义动作。
- **`tipList`（`Omit<ListProps, "data">`）**：提示列表的底层 `TiList` 配置（行样式、分页等）。

### 嵌套

本组件未提供插槽：提示列表作为弹出层渲染，输入框、前缀、后缀的内容全部由上述数据与图标属性
决定，不支持通过 slot 替换内部结构。

### 事件

- **`change`**：载荷为规整后的新值；用户提交（失焦 / 选中候选）时触发。
- **`focus` / `blur`**：无载荷；输入框聚焦 / 失焦时触发。
- **`click:prefix-icon` / `click:suffix-icon`**：无载荷；图标动作为 `"click"` 时触发。
- **`click`**：载荷为 `props.value`；点击输入框本体时触发。

> 本组件继承 `CommonProps`（`className`、`style`），字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)，本篇不再罗列。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单输入（`simple`）

**JSON 配置**

```json
{
  "value": "Some Text",
  "valueCase": "upperAll",
  "autoSelect": true,
  "showSizeWhen": "auto",
  "showSizeAt": "top-right",
  "forceShowSizeWhen": "fullsize",
  "maxSize": 10
}
```

**Vue 标签**

```xml
<TiInput
  value="Some Text"
  value-case="upperAll"
  :auto-select="true"
  show-size-when="auto"
  show-size-at="top-right"
  force-show-size-when="fullsize"
  :max-size="10"
/>
```

### 复制和打开（`open-copy`）

**JSON 配置**

```json
{
  "value": "vuejs.org",
  "openLink": "https://${value}/",
  "suffixIconFor": "open",
  "prefixIconFor": "copy"
}
```

**Vue 标签**

```xml
<TiInput
  value="vuejs.org"
  open-link="https://${value}/"
  suffix-icon-for="open"
  prefix-icon-for="copy"
/>
```

### 提示选项（`lookup`）

**JSON 配置**

```json
{
  "value": null,
  "valueCase": "upperAll",
  "trimed": true,
  "autoSelect": true,
  "placeholder": "2 Digital Country Code",
  "prefixIconFor": "clear",
  "options": "#Countries",
  "mustInOptions": true,
  "tipFormat": "VT",
  "tipShowTime": "auto",
  "useTextWhenFocus": true,
  "tipUseHint": false,
  "tipListMinWidth": "320px",
  "lookup": ["^~value", "^~text"]
}
```

**Vue 标签**

```xml
<TiInput
  :value="null"
  value-case="upperAll"
  :trimed="true"
  :auto-select="true"
  placeholder="2 Digital Country Code"
  prefix-icon-for="clear"
  options="#Countries"
  :must-in-options="true"
  tip-format="VT"
  tip-show-time="auto"
  :use-text-when-focus="true"
  :tip-use-hint="false"
  tip-list-min-width="320px"
  :lookup="['^~value', '^~text']"
/>
```

### 对象值（`as-obj`）

**JSON 配置**

```json
{
  "value": { "value": "CNY" },
  "valueType": "raw-item",
  "valueCase": "upperAll",
  "trimed": true,
  "autoSelect": true,
  "placeholder": "---",
  "prefixIconFor": "clear",
  "options": "#Currencies",
  "mustInOptions": true,
  "tipFormat": "VT",
  "tipShowTime": "auto",
  "useTextWhenFocus": true,
  "tipUseHint": false,
  "tipListMinWidth": "320px",
  "lookup": ["^~value", "^~text"]
}
```

**Vue 标签**

```xml
<TiInput
  :value="{ value: 'CNY' }"
  value-type="raw-item"
  value-case="upperAll"
  :trimed="true"
  :auto-select="true"
  placeholder="---"
  prefix-icon-for="clear"
  options="#Currencies"
  :must-in-options="true"
  tip-format="VT"
  tip-show-time="auto"
  :use-text-when-focus="true"
  :tip-use-hint="false"
  tip-list-min-width="320px"
  :lookup="['^~value', '^~text']"
/>
```

### 过滤选项（`filter`）

**JSON 配置**

```json
{
  "value": null,
  "valueCase": "upperAll",
  "trimed": true,
  "autoSelect": true,
  "placeholder": "2 Digital QU",
  "prefixIconFor": "clear",
  "suffixIconFor": "load-options",
  "options": "#Quantities",
  "optionFilter": { "type": "VOLUME" },
  "optionKeepRaw": true,
  "mustInOptions": true,
  "tipShowTime": "auto",
  "useTextWhenFocus": true,
  "tipUseHint": false,
  "tipFormat": "VpT",
  "getDisplayText": "tip|text|value",
  "tipListMinWidth": "420px",
  "lookup": ["^~value", "^~text", "^~tip"]
}
```

**Vue 标签**

```xml
<TiInput
  :value="null"
  value-case="upperAll"
  :trimed="true"
  :auto-select="true"
  placeholder="2 Digital QU"
  prefix-icon-for="clear"
  suffix-icon-for="load-options"
  options="#Quantities"
  :option-filter="{ type: 'VOLUME' }"
  :option-keep-raw="true"
  :must-in-options="true"
  tip-show-time="auto"
  :use-text-when-focus="true"
  :tip-use-hint="false"
  tip-format="VpT"
  get-display-text="tip|text|value"
  tip-list-min-width="420px"
  :lookup="['^~value', '^~text', '^~tip']"
/>
```

### 动态查询（`query`）

**JSON 配置**

```json
{
  "value": null,
  "valueCase": "upperAll",
  "trimed": true,
  "autoSelect": true,
  "placeholder": "Keyin for tips",
  "prefixIconFor": "clear",
  "suffixIconFor": "copy",
  "mustInOptions": false,
  "tipShowTime": "auto",
  "useTextWhenFocus": true,
  "tipUseHint": true,
  "tipListMinWidth": "640px",
  "options": "#hello100",
  "lookup": ["*~text"]
}
```

**Vue 标签**

```xml
<TiInput
  :value="null"
  value-case="upperAll"
  :trimed="true"
  :auto-select="true"
  placeholder="Keyin for tips"
  prefix-icon-for="clear"
  suffix-icon-for="copy"
  :must-in-options="false"
  tip-show-time="auto"
  :use-text-when-focus="true"
  :tip-use-hint="true"
  tip-list-min-width="640px"
  options="#hello100"
  :lookup="['*~text']"
/>
```

### 只读下拉（`droplist`）

**JSON 配置**

```json
{
  "trimed": false,
  "placeholder": "Choose one Animal",
  "type": "primary",
  "boxFontSize": "s",
  "prefixIconFor": "clear",
  "suffixIconFor": "load-options",
  "mustInOptions": true,
  "autoPrefixIcon": true,
  "canInput": false,
  "options": [
    { "value": "cat", "text": "Cat", "icon": "fas-cat" },
    { "value": "dog", "text": "Dog", "icon": "fas-dog" }
  ]
}
```

**Vue 标签**

```xml
<TiInput
  :trimed="false"
  placeholder="Choose one Animal"
  type="primary"
  box-font-size="s"
  prefix-icon-for="clear"
  suffix-icon-for="load-options"
  :must-in-options="true"
  :auto-prefix-icon="true"
  :can-input="false"
  :options="[
    { value: 'cat', text: 'Cat', icon: 'fas-cat' },
    { value: 'dog', text: 'Dog', icon: 'fas-dog' }
  ]"
/>
```

> 注册表原示例的 `options` 直接引用了 `example/mock-animals.ts` 的 `MOCK_ANIMALS` 数组，
> 这里展开为两条示意选项。

## 总结

`TiInput` 是通用可输入框：需要密码形态用 `TiInputPassword`，需要多行用 `TiInputMultiLines`，
需要数字格式化用 `TiInputNum`，只做只读下拉选择时用 `TiDroplist`（它在 `TiInput` 基础上关掉了
键入与提示查询）。它的能力面很广，简单场景建议直接用更轻的变体，避免一次堆砌过多参数。

## 延伸阅读

- **源码入口**
  - `src/lib/input/box3/ti-input-box3-index.ts` —— 注册表信息与示例配置。
  - `src/lib/input/box3/ti-input-box3-types.ts` —— `InputBoxProps`、`InputBoxEmitter`。
  - `src/lib/input/box3/TiInputBox3.vue` —— 视图与状态接线。
  - `src/lib/input/box3/use-ti-input-box3-api.ts` —— 输入框内部计算与操作。
  - `src/lib/input/box3/_fea/` —— box 外观 / 选项 / 提示列表 / 值等特征类型与 hook。
- **相关文档**
  - 输入值规整管线：[use-value-input](../../40.features/value/use-value-input.md)。
  - 选项数据模型：[字典模型](../../10.concepts/06-dict-model.md)。
  - 共享占位 / 前后缀 / 只读：[共享 Props](../../10.concepts/02-common-props.md)。
