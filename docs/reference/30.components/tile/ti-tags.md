---
title: TiTags 标签组
keywords: [标签组, tags, TiTags, tag, 标签, 可编辑, 可排序, 过滤条件, TILE]
status: draft
---

# TiTags 标签组

## 介绍

`TiTags` 是小片类（`TILE`）的标签组展示与轻交互控件，把一组 `TagItem` 渲染成一排并列小
标签。它支持三种数据形态：已经是 `TagItem[]` 的标准项数组、需要逐项翻译的数组、以及一个
`Vars` 对象（按键展开成 `键: 值` 标签，常用于展示过滤条件）。

在只读模式下它就是一排标签；开启 `editable` 后每个标签带上关闭按钮，可移除、可拖拽排序；
还能在尾部挂一个 `TiActionBar` 动作条。

使用时需要注意：

- `value` 为数组时按 `TagItem[]` 渲染；为 `Vars` 对象时逐键展开，标题取自 `nameTranslator`。
- `valueIsMatcher` 缺省时自动判断：数组值当作普通值，对象值当作匹配条件（影响值翻译方式），
  可显式 `true / false` 覆盖。
- `editable` 才会出现关闭按钮并启用拖拽排序；移除数组型值发 `remove`，移除对象型值发
  `change`（去掉对应键后的新对象）。

源码目录：`src/lib/tile/tags/`。

## 例子

### JSON 配置

```json
{
  "value": [
    { "value": "red" },
    { "value": "orange" },
    { "value": "yellow" }
  ]
}
```

### Vue 标签调用

```xml
<TiTags
  :value="[
    { value: 'red' },
    { value: 'orange' },
    { value: 'yellow' }
  ]"
/>
```

## 控件参数

### 数据

- **`value`（`TagItem[] | Vars`，无默认值）**：标签数据；数组时每项是一个标签项（`icon` /
  `text` / `tip` / `type` / `value` / `name`），对象时逐键展开成 `标题: 值` 标签。
- **`placeholder`（`string`，默认 `"i18n:nil-content"`）**：没有标签时显示的占位文本，经
  `autoI18n` 解析。
- **`autoI18n`（`boolean`，默认 `true`）**：是否对占位文本做 `i18n:` 前缀解析。
- **`valueTranslators`（`ValueTranslatorProps.valueTranslators`，无默认值）**：把标签值
  （尤其匹配条件值）翻译成展示文字的转换器集；见值翻译机制。
- **`valueIsMatcher`（`boolean`，默认 `undefined`）**：值是否视为匹配条件；`undefined` 时
  按数据形态自动判断（数组否、对象是）。
- **`nameTranslator`（`Record<string, string | TagNameInfo | TagNameTranslator>`，无默认值）**：
  对象型值逐键展开时，把字段名翻译成标题；键 `"*"` 表示对所有字段生效。

### 行为

- **`editable`（`boolean`，无默认值）**：开启后每个标签显示关闭按钮，并启用拖拽排序。
- **`tagClickable`（`boolean`，无默认值）**：标签是否可点击（手型光标）；开启后点标签发
  `click-tag`，否则点击冒泡发 `click`。
- **`nowrap`（`boolean`，无默认值）**：强制标签不换行。
- **`actions`（`ActionBarProps`，无默认值）**：尾部动作条配置，默认不显示；传 `{ items: [] }`
  显式关闭，声明后渲染一个 `TiActionBar`。
- **`vars`（`Vars`，无默认值）**：动作条的上下文变量，除非 `actions` 自带 `vars` 否则用作其
  上下文。

### 外观

- **`defaultTagType`（`LogicType`，无默认值）**：未指定 `type` 的标签默认状态色。
- **`defaultTagClass`（`any`，无默认值）**：所有标签默认追加的样式类。
- **`defaultTagStyle`（`Vars`，无默认值）**：所有标签默认追加的内联样式。
- **`defaultTagAspect`（`LabelAspectProps`，无默认值）**：透传给内部每个 `TiLabel` 的外观
  属性（颜色模式、字号、内边距等）。
- **`title`（`string`，无默认值）**：标签组前缀标题。
- **`showBoreder`（`CssBorderStyle`，无默认值）**：整体外框边框样式（源码字段名即
  `showBoreder`）；设置后渲染 `show-border` 类与 `--box-border` 变量。
- **`boxFontSize`（`AspectSize`，默认 `"t"`）**：字号分级。
- **`boxPadding`（`AspectSize`，默认 `"s"`）**：内边距分级。
- **`boxRadius`（`AspectSize | "none"`，默认 `"s"`）**：圆角分级。

### 回调

本组件无此组参数（标签内容由数据决定，动作条由 `actions` 配置）。

### 嵌套

本组件未提供插槽；标签由 `value` 渲染，动作条由 `actions` 配置，不支持通过 slot 替换。

### 事件

- **`click`**：点击标签组空白区（非单个标签）时触发，无载荷。
- **`click-tag`**：`tagClickable` 开启时点击某个标签触发，载荷为该 `TagItem`。
- **`remove`**：`editable` 且 `value` 为数组时，点击某标签关闭按钮触发，载荷为被移除的
  `TagItem`。
- **`change`**：`editable` 且 `value` 为 `Vars` 对象时，移除某标签触发，载荷为去掉对应键后的
  新对象。
- **`sorted`**：`editable` 拖拽排序结束后触发，载荷为排序后的 `TagItem[]`。
- **`fire`**：尾部动作条触发命令时冒泡发出，载荷为 `ActionBarEvent`。

> 本组件同时继承 `CommonProps`（`className`、`style`），字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)，本篇不再罗列。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单标签（`simple`）

**JSON 配置**

```json
{
  "value": [
    { "value": "red" },
    { "value": "orange" },
    { "value": "yellow" },
    { "value": "green" },
    { "value": "cyan" },
    { "value": "blue" },
    { "value": "purple" }
  ]
}
```

**Vue 标签**

```xml
<TiTags
  :value="[
    { value: 'red' },
    { value: 'orange' },
    { value: 'yellow' },
    { value: 'green' },
    { value: 'cyan' },
    { value: 'blue' },
    { value: 'purple' }
  ]"
/>
```

### 带图标（`with_icon`）

**JSON 配置**

```json
{
  "defaultTagType": "disable",
  "value": [
    { "value": "red", "icon": "zmdi-coffee" },
    { "value": "orange", "icon": "zmdi-cocktail" },
    { "value": "yellow", "icon": "zmdi-cutlery" },
    { "value": "green", "icon": "zmdi-favorite" }
  ]
}
```

**Vue 标签**

```xml
<TiTags
  default-tag-type="disable"
  :value="[
    { value: 'red', icon: 'zmdi-coffee' },
    { value: 'orange', icon: 'zmdi-cocktail' },
    { value: 'yellow', icon: 'zmdi-cutlery' },
    { value: 'green', icon: 'zmdi-favorite' }
  ]"
/>
```

### 可编辑标签（`editable`）

**JSON 配置**

```json
{
  "nowrap": true,
  "editable": true,
  "defaultTagType": "text",
  "value": [
    { "value": "red", "icon": "zmdi-coffee" },
    { "value": "orange", "icon": "zmdi-cocktail" },
    { "value": "yellow", "icon": "zmdi-cutlery" },
    { "value": "green", "icon": "zmdi-favorite" }
  ]
}
```

**Vue 标签**

```xml
<TiTags
  :nowrap="true"
  :editable="true"
  default-tag-type="text"
  :value="[
    { value: 'red', icon: 'zmdi-coffee' },
    { value: 'orange', icon: 'zmdi-cocktail' },
    { value: 'yellow', icon: 'zmdi-cutlery' },
    { value: 'green', icon: 'zmdi-favorite' }
  ]"
/>
```

### 普通对象（`data_raw`）

**JSON 配置**

```json
{
  "nowrap": true,
  "editable": true,
  "valueIsMatcher": false,
  "defaultTagType": "warn",
  "value": { "name": "Blue Tiger", "speed": 200 },
  "nameTranslator": { "name": "Name", "speed": "Speed" }
}
```

**Vue 标签**

```xml
<TiTags
  :nowrap="true"
  :editable="true"
  :value-is-matcher="false"
  default-tag-type="warn"
  :value="{ name: 'Blue Tiger', speed: 200 }"
  :name-translator="{ name: 'Name', speed: 'Speed' }"
/>
```

### 过滤条件（`data_matcher`）

**JSON 配置**

```json
{
  "nowrap": true,
  "editable": true,
  "defaultTagType": "warn",
  "value": { "name": "Pdvvddh*", "age": "[18,45]" },
  "nameTranslator": { "name": "Name", "age": "Age" }
}
```

**Vue 标签**

```xml
<TiTags
  :nowrap="true"
  :editable="true"
  default-tag-type="warn"
  :value="{ name: 'Pdvvddh*', age: '[18,45]' }"
  :name-translator="{ name: 'Name', age: 'Age' }"
/>
```

## 总结

`TiTags` 适合展示一组并列标签，并在需要时支持移除与排序：筛选条件区、已选标签、属性集合。
如果传入的是未翻译的逗号分隔字符串，请用 `TiLabelTags` 先做拆分与字典翻译；只渲染单个值用
`TiLabel`。`editable` 只是本地交互，移除 / 排序后新数据由外层接 `remove` / `change` /
`sorted` 自行回写。

## 延伸阅读

- **源码入口**
  - `src/lib/tile/tags/ti-tags-index.ts` —— 注册表信息与示例配置。
  - `src/lib/tile/tags/ti-tags-types.ts` —— `TagsProps`、`TagsEmitter`、`TagItem`。
  - `src/lib/tile/tags/TiTags.vue` —— 标签渲染、移除与动作条。
  - `src/lib/tile/tags/use-tags.ts` —— 数组 / 对象值到标签项的装载。
  - `src/lib/tile/tags/use-tags-sortable.ts` —— 拖拽排序。
  - `src/lib/tile/tags/use-tag-title-translator.ts` —— 字段名到标题的翻译。
- **相关文档**
  - 未翻译多值字符串的包裹件：[ti-label-tags](ti-label-tags.md)。
  - 单个标签：[ti-label](ti-label.md)。
  - 动作条：[TiActionBar 动作条](../action/ti-action-bar.md)。
