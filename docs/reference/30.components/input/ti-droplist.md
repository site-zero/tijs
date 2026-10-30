---
title: TiDroplist 下拉列表
keywords: [下拉列表, 下拉选择, dropdown, droplist, TiDroplist, 单选下拉, 候选取值]
status: draft
---

# TiDroplist 下拉列表

## 介绍

`TiDroplist` 是输入类（`INPUT`）的只读下拉选择框：完整复用 `TiInput`（box3）的外观、前后缀图标、
字典翻译与提示列表能力，但去掉了"自由键入"——用户只能从弹出的候选列表里选一个，不能手输。它是
表单里最常见的"从固定候选取值"控件。

使用时需要注意：

- 它从 `TiInput` 剔除了 `canInput`、`trimed`、`mustInOptions` 三个字段，因此不能开启自由输入、
  不做去空白规整，值默认必须来自选项。
- 值命中选项后，展示文字 / 图标由字典翻译得到；清空通过前缀图标的 `"clear"` 动作完成。

源码目录：`src/lib/input/droplist/`。

## 例子

### JSON 配置

```json
{
  "value": "otter",
  "placeholder": "Choose one Animal",
  "options": [
    { "value": "cat", "text": "Cat" },
    { "value": "dog", "text": "Dog" }
  ]
}
```

### Vue 标签调用

```xml
<TiDroplist
  value="otter"
  placeholder="Choose one Animal"
  :options="[
    { value: 'cat', text: 'Cat' },
    { value: 'dog', text: 'Dog' }
  ]"
  @change="onChange"
/>
```

## 控件参数

### 数据

- **`value`（`any`）**：当前选中项的值。
- **`options` / `dictVars` / `getOptionIcon/Text/Tip/Value`**：候选项字典配置，规则见
  [字典模型](../../10.concepts/06-dict-model.md)。
- **`prefixIcon` / `prefixHoverIcon` / `prefixIconFor`、`suffixIcon` / `suffixHoverIcon` / `suffixIconFor`、
  `openLink`、`autoPrefixIcon`**：完整继承 `TiInput` 的前后缀图标与动作，见
  [ti-input](ti-input.md)。
- **`tipFormat` / `tipList` / `tipListWidth` / `tipListMinWidth`**：弹出列表的排版与尺寸，同 `TiInput`。
- **值管道**：`valueCase`、`beforeValueProcessors`、`afterValueProcessors` 等见
  [use-value-input](../../40.features/value/use-value-input.md)。

### 行为

- **`readonly`（`any`）**：只读条件，见 [共享 Props](../../10.concepts/02-common-props.md)。
- **`autoSelect` / `autoFocus` / `useTextWhenFocus`**：完整继承 `TiInput` 的行为开关。

### 外观

- **`type` / `boxFontSize` / `boxPadding` / `boxRadius` / `width` / `hideBorder` / `align` /
  `inputStyle` 等**：完整继承 `TiInput`（box3）的外观字段，见
  [样式系统](../../10.concepts/05-style-system.md)。

### 回调

- **`onValueChange`（`(val: any) => void`）**：绕开事件机制的值变化回调，同 `TiInput`。

### 嵌套

本组件未提供插槽：下拉框与候选列表由 `options` 与前后缀图标属性决定。

### 事件

- **`change`**：载荷为选中的新值；从弹出列表选中时触发。
- **`focus` / `blur`**：无载荷；下拉框聚焦 / 失焦时触发。
- **`click:prefix-icon` / `click:suffix-icon`**：图标动作为 `"click"` 时触发。
- **`click`**：载荷为 `props.value`；点击下拉框本体时触发。

> 本组件继承 `CommonProps`（`className`、`style`），字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单下拉（`simple`）

**JSON 配置**

```json
{
  "value": "otter",
  "placeholder": "Choose one Animal",
  "options": [
    { "value": "hippo", "text": "Hippo" },
    { "value": "cow", "text": "Cow" },
    { "value": "otter", "text": "Otter" },
    { "value": "cat", "text": "Cat" }
  ]
}
```

**Vue 标签**

```xml
<TiDroplist
  value="otter"
  placeholder="Choose one Animal"
  :options="[
    { value: 'hippo', text: 'Hippo' },
    { value: 'cow', text: 'Cow' },
    { value: 'otter', text: 'Otter' },
    { value: 'cat', text: 'Cat' }
  ]"
/>
```

### 选项带图标（`with_icon`）

**JSON 配置**

```json
{
  "value": "otter",
  "placeholder": "Choose one Animal",
  "prefixIconFor": "clear",
  "showCleanOption": true,
  "options": [
    { "value": "hippo", "text": "Hippo", "icon": "fas-hippo" },
    { "value": "cow", "text": "Cow", "icon": "fas-cow" },
    { "value": "otter", "text": "Otter", "icon": "fas-otter" }
  ]
}
```

**Vue 标签**

```xml
<TiDroplist
  value="otter"
  placeholder="Choose one Animal"
  prefix-icon-for="clear"
  :show-clean-option="true"
  :options="[
    { value: 'hippo', text: 'Hippo', icon: 'fas-hippo' },
    { value: 'cow', text: 'Cow', icon: 'fas-cow' },
    { value: 'otter', text: 'Otter', icon: 'fas-otter' }
  ]"
/>
```

> 注册表示例里的 `showCleanOption` 未在 `DroplistProps` 中显式声明，这里按示例原样保留。

### 选项带备注（`with_tip`）

**JSON 配置**

```json
{
  "value": "otter",
  "placeholder": "Choose one Animal",
  "prefixIconFor": "clear",
  "options": [
    { "value": "hippo", "text": "Hippo", "icon": "fas-hippo", "tip": "Hipo like water" },
    { "value": "cow", "text": "Cow", "icon": "fas-cow", "tip": "Cow is a domestic animal" },
    { "value": "otter", "text": "Otter", "icon": "fas-otter", "tip": "Otters live in water" }
  ]
}
```

**Vue 标签**

```xml
<TiDroplist
  value="otter"
  placeholder="Choose one Animal"
  prefix-icon-for="clear"
  :options="[
    { value: 'hippo', text: 'Hippo', icon: 'fas-hippo', tip: 'Hipo like water' },
    { value: 'cow', text: 'Cow', icon: 'fas-cow', tip: 'Cow is a domestic animal' },
    { value: 'otter', text: 'Otter', icon: 'fas-otter', tip: 'Otters live in water' }
  ]"
/>
```

## 总结

`TiDroplist` 适合从固定候选里单选一个；需要同时允许手输匹配改用 `TiInput`，横排平铺候选用
`TiSwitcher`，多选下拉属于 `TiMultiDroplist`（本分组之外）。

## 延伸阅读

- **源码入口**
  - `src/lib/input/droplist/ti-droplist-index.ts` —— 注册表信息与示例配置。
  - `src/lib/input/droplist/ti-droplist-types.ts` —— `DroplistProps`、`DroplistEmitter`。
  - `src/lib/input/droplist/TiDroplist.vue` —— 视图，内部复用 box3。
- **相关文档**
  - 能力底座（可输入版）：[ti-input](ti-input.md)。
  - 选项数据模型：[字典模型](../../10.concepts/06-dict-model.md)。
