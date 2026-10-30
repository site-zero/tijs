---
title: TiInputGroup 输入控件组
keywords: [输入组, 字段组, input-group, TiInputGroup, 多字段录入, 组合输入, INPUT]
status: draft
---

# TiInputGroup 输入控件组

## 介绍

`TiInputGroup` 是输入类（`INPUT`）的输入控件组：把几个相关字段压在一行 / 一个网格里
一起录入，例如「类型 + 电话 + 备注」这样的复合联系人字段。它内部就是 `TiGridFields`，按
`fields` 声明逐个生成子输入控件，整组的值是一个 `Vars` 对象（字段名 → 值）。

适合把「逻辑上属于一个字段、界面上又要分开录入」的组合收拢在一处；不适合大表单——大表单
请用 `TiGridFields` / `TiForm`。

使用时需要注意：

- 子控件类型默认都是 `TiInput`，可通过 `defaultComType` / `defaultComConf` 改默认，或在
  每个 `fields` 项里单独指定。
- `changeMode: "all"`（默认）时，任意子控件变更都会把旧值与变更合并后整体发出；开启
  `ignoreNil` 后自动过滤掉空键值。
- 字段名默认会作为子输入框的 placeholder（`fieldTitleAs: "dft-placeholder"`）。

源码目录：`src/lib/input/group/`。

## 例子

### JSON 配置

```json
{
  "value": {
    "type": "work",
    "phone": "+86 13910110054",
    "phoneComment": "Ava from 8:00 a.m. to 5:00 p.m"
  },
  "layoutGridTracks": "60px,30%,1fr",
  "bodyPartGap": "t",
  "ignoreNil": true,
  "fields": [
    { "name": "type", "emptyAs": null },
    { "name": "phone", "emptyAs": null },
    { "name": "phoneComment", "emptyAs": null }
  ]
}
```

### Vue 标签调用

```xml
<TiInputGroup
  :value="{ type: 'work', phone: '+86 13910110054', phoneComment: 'Ava from 8:00 a.m. to 5:00 p.m' }"
  layout-grid-tracks="60px,30%,1fr"
  body-part-gap="t"
  :ignore-nil="true"
  :fields="[
    { name: 'type', emptyAs: null },
    { name: 'phone', emptyAs: null },
    { name: 'phoneComment', emptyAs: null }
  ]"
  @change="onChange"
/>
```

## 控件参数

### 数据

- **`value`（`Vars`，无默认值）**：整组字段值对象，键为字段名。
- **`fields`（`GridFieldsInput[]`，默认 `[]`）**：字段声明列表，逐项指定 `name`、
  控件类型与配置；结构与 `TiGridFields` 的 `fields` 一致。
- **`fieldSetName`（`string`，无默认值）**：使用注册的字段集；未指定时以 `fields` 为准。
- **`vars`（`Vars`，来自 `GridFieldsProps`）**：字段渲染模板的变量上下文。

### 行为

- **`changeMode`（`"all"`，默认 `"all"`）**：子控件变更后与旧值合并整体发出。
- **`ignoreNil`（`boolean`，默认 `false`）**：`changeMode: "all"` 时是否自动过滤空键值。
- **`fieldTitleAs`（`"dft-placeholder" | "placeholder" | "sep" | "title"`，默认
  `"dft-placeholder"`）**：字段名如何展示——`dft-placeholder` 作默认 placeholder、
  `placeholder` 强制作 placeholder、`sep` 作分隔符（默认 `-`，首个控件不显示）、
  `title` 作标题（首个控件不显示）。
- **`fieldSeparator`（`string | null`，默认 `"-"`）**：`fieldTitleAs` 为 `sep` /
  `placeholder` 时的分隔符。
- **默认子控件**：`defaultComType`（默认 `"TiInput"`）、`defaultComConf`、
  `defaultFieldType` 及变换 / 序列化选项，批量指定子控件默认行为。

### 外观

- **`layoutGridTracks`（来自 `GridFieldsProps`，无默认值）**：网格轨道定义，如
  `"60px,30%,1fr"`。
- **`bodyPartGap`（`AspectSize`，默认 `"s"`）**：子控件间距分级。
- **`bodyPartStyle` / `bodyPartFontSize` / `maxFieldNameWidth`（默认 `"auto"`）**：
  控件区内联样式、字号、字段名最大宽度。
- **`fieldLayoutMode`（默认 `"h-title-icon-suffix"`）**：单个字段标题与控件的排布模式。

### 回调

本组件无此组参数。

### 嵌套

本组件未提供插槽；子控件由 `fields` 声明驱动，不需要也不支持 slot 插入。

### 事件

- **`change`**：载荷为 `Vars`（合并后的整组值）；任意子控件变更后触发。

> 本组件同时继承 `CommonProps`，并从 `GridFieldsProps` 挑选布局 / 字段相关字段，含义见
> [共享 Props](../../10.concepts/02-common-props.md)。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 输入控件组（`simple`）

**JSON 配置**

```json
{
  "value": {
    "type": "work",
    "phone": "+86 13910110054",
    "phoneComment": "Ava from 8:00 a.m. to 5:00 p.m"
  },
  "layoutGridTracks": "60px,30%,1fr",
  "bodyPartGap": "t",
  "ignoreNil": true,
  "fields": [
    { "name": "type", "emptyAs": null },
    { "name": "phone", "emptyAs": null },
    { "name": "phoneComment", "emptyAs": null }
  ]
}
```

**Vue 标签**

```xml
<TiInputGroup
  :value="{ type: 'work', phone: '+86 13910110054', phoneComment: 'Ava from 8:00 a.m. to 5:00 p.m' }"
  layout-grid-tracks="60px,30%,1fr"
  body-part-gap="t"
  :ignore-nil="true"
  :fields="[
    { name: 'type', emptyAs: null },
    { name: 'phone', emptyAs: null },
    { name: 'phoneComment', emptyAs: null }
  ]"
/>
```

## 总结

`TiInputGroup` 适合「多字段捆绑成一行」的复合录入；字段多到需要标签列、校验与整体提交流
程时，改用 `TiGridFields` / `TiForm`。它的 `change` 始终是整组值对象，注意配合
`ignoreNil` 控制空键是否落库。

## 延伸阅读

- **源码入口**
  - `src/lib/input/group/ti-input-group-index.ts` —— 注册表信息与示例配置。
  - `src/lib/input/group/ti-input-group-types.ts` —— `InputGroupProps`。
  - `src/lib/input/group/TiInputGroup.vue` —— 接入 `TiGridFields` 的组合视图。
  - `src/lib/input/group/ti-input-group-api.ts` —— 字段声明合并逻辑。
- **相关文档**
  - 网格字段表单：[TiGridFields 栅格字段组](../shelf/ti-grid-fields.md)。
  - 共享 Props：[共享 Props](../../10.concepts/02-common-props.md)。
