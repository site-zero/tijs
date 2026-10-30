---
title: TiForm 表单
keywords: [表单, form, TiForm, 字段录入, 记录编辑, SHELF]
status: draft
---

# TiForm 表单

## 介绍

`TiForm` 是最常见的「编辑一条记录」的容器：顶部一个标题、中间一排字段、底部一行提示，
整体就是一块 `TiGridFields`。它把栅格字段组的默认值（差异通知、允许未定义字段、自动补
虚拟字段）调好，再加上粘性表头表尾的观感，让你用最少的配置拼出一个录入表单。

它本身不发明新能力：`FormProps` 就是 `GridFieldsProps`，字段怎么排布、怎么联动、怎么
校验，全部继承自 `TiGridFields`；本篇只标注差异，参数明细请回看那一篇。

使用时需要注意：

- 它是 `TiGridFields` 的薄封装，字段定义仍写在 `fields` 数组里，值仍从 `data` 取、经
  `change` 事件带出。
- 表头表尾是否粘性由外部 `className`（如 `title-sticky`）控制，组件本身只负责渲染。
- 字段较多、想分页签收纳时，改用 `TiTabsForm`。

源码目录：`src/lib/shelf/form/`（race：`SHELF`）。

## 例子

### JSON 配置

```json
{
  "data": { "species": "Tiger", "age": 5, "name": "Stripes" },
  "title": "Simple Form With Sticky Title",
  "className": "title-sticky",
  "fields": [
    { "title": "Species", "name": "species", "required": true, "comType": "TiInput" },
    { "title": "Age", "name": "age", "type": "Integer", "comType": "TiInput" },
    { "title": "Name", "name": "name", "comType": "TiInput" }
  ]
}
```

### Vue 标签调用

```xml
<TiForm
  :data="formData"
  title="Simple Form With Sticky Title"
  class-name="title-sticky"
  :fields="fields"
  @change="onChange"
/>
```

## 控件参数

### 数据

- 与 `TiGridFields` 完全一致：`data`、`fields`、`vars`、`fieldSetName`、`title`、`tip`、
  `emptyRoadblock` 等。字段定义写法见
  [TiGridFields 栅格字段组](./ti-grid-fields.md)。

### 行为

- **`changeMode`（`"diff" | "all"`，本组件默认 `"diff"`）**：本组件在此显式设为 `"diff"`，
  只向外抛差异。
- **`allowUndefinedFields`（`boolean`，本组件默认 `true`）**：允许改动 `fields` 里未声明
  的字段而不报错。
- **`makeVirtualField`（`true | (change) => field`，本组件默认 `true`）**：遇到未定义字段时
  自动补一个虚拟字段继续处理。
- 其余行为开关（`blockInvalid`、`linkFields`、`ignoreActivedField` 等）同 `TiGridFields`。

### 外观

- 与 `TiGridFields` 一致：`bodyPartGap`、`bodyPartFontSize`、`bodyPartDense`、
  `fieldLayoutMode`、`maxFieldNameWidth`、`layoutHint` 等。

### 回调

- 与 `TiGridFields` 一致：`whenGrid`、`fieldStatus`、`fieldStatusIcons`。

### 嵌套

子控件由 `fields` 字段配置数组进入（每个 field 项用 `comType` + `comConf` 指定录入控件），
并提供一个透传插槽：

- **`#head`**：覆盖默认表单标题；组件内部把它原样转给 `TiGridFields` 的同名插槽。
- 其余（`#head_ext` / `#foot_ext` / `#foot`）由 `TiGridFields` 提供，`TiForm` 未额外
  透传，需要时直接用 `TiGridFields`。

组件通过 `defineExpose` 暴露 `getUsedFields()`，返回编译后的平铺字段列表。

### 事件

`TiForm` 把 `TiGridFields` 的事件原样向外转发，载荷形态一致：

- **`change`**：载荷 `Vars`，改动并通过校验后触发。
- **`change-fields`**：载荷 `FieldChange[]`，本次改动涉及的字段列表。
- **`change-validate`**：载荷 `{name, uniqKey, type, text}`，字段校验失败时触发。
- **`name-change`**：载荷 `FieldChange`，字段标题可编辑时触发。
- **`dom-ready`**：载荷 `{el, main}`，挂载后触发一次。

> 本组件同时继承 `CommonProps`，共享 Props 见
> [共享 Props](../../10.concepts/02-common-props.md)；字段级参数明细见
> [TiGridFields 栅格字段组](./ti-grid-fields.md)，本篇不再罗列。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单表单（`simple`）

**JSON 配置**

```json
{
  "changeMode": "diff",
  "data": {
    "species": "Tiger",
    "age": 5,
    "name": "Stripes",
    "habitat": "Jungle",
    "diet": "Carnivore",
    "weight": "200 kg",
    "height": "1.2 meters",
    "color": "Orange with black stripes"
  },
  "title": "Simple Form With Sticky Title",
  "className": "title-sticky",
  "fields": [
    { "title": "Species", "name": "species", "required": true, "comType": "TiInput" },
    { "title": "Age", "name": "age", "type": "Integer", "comType": "TiInput" },
    { "title": "Name", "name": "name", "comType": "TiInput" },
    { "title": "Habitat", "name": "habitat", "comType": "TiInput" },
    { "title": "Diet", "name": "diet", "comType": "TiInput" },
    { "title": "Weight", "name": "weight", "comType": "TiInput" },
    { "title": "Height", "name": "height", "comType": "TiInput" },
    { "title": "Color", "name": "color", "comType": "TiInput" }
  ]
}
```

**Vue 标签**

```xml
<TiForm
  :change-mode="'diff'"
  :data="formData"
  title="Simple Form With Sticky Title"
  class-name="title-sticky"
  :fields="fields"
/>
```

### 动态字段标题（`dynamic_title`）

**JSON 配置**

```json
{
  "changeMode": "diff",
  "data": {
    "species": "fish",
    "age": 5,
    "name": "Stripes",
    "habitat": "Jungle",
    "diet": "Carnivore",
    "weight": "200 kg",
    "height": "1.2 meters",
    "color": "Orange with black stripes"
  },
  "title": "Simple Form With Sticky Title",
  "className": "title-sticky",
  "maxFieldNameWidth": 100,
  "fields": [
    {
      "title": "Species",
      "name": "species",
      "required": true,
      "comType": "TiDroplist",
      "comConf": {
        "prefixIconForClean": true,
        "options": [
          { "value": "otter", "text": "Otter", "icon": "fas-otter" },
          { "value": "fish", "text": "Fish", "icon": "fas-fish" },
          { "value": "dragon", "text": "Dragon", "icon": "fas-dragon" },
          { "value": "locust", "text": "Locust", "icon": "fas-locust" },
          { "value": "dove", "text": "Dove", "icon": "fas-dove" }
        ]
      }
    },
    {
      "title": [
        ["Fish Age", { "data.species": "fish" }],
        ["Dragon Age", { "data.species": "dragon" }],
        "Age"
      ],
      "name": "age",
      "type": "Integer",
      "comType": "TiInput"
    },
    { "title": "->${data.species<string:start>?} Name", "name": "name", "comType": "TiInput" },
    { "title": "Habitat", "name": "habitat", "comType": "TiInput" },
    { "title": "Diet", "name": "diet", "comType": "TiInput" },
    { "title": "Weight", "name": "weight", "comType": "TiInput" },
    { "title": "Height", "name": "height", "comType": "TiInput" },
    { "title": "Color", "name": "color", "comType": "TiInput" }
  ]
}
```

**Vue 标签**

```xml
<TiForm
  :data="formData"
  title="Simple Form With Sticky Title"
  class-name="title-sticky"
  :max-field-name-width="100"
  :fields="fields"
/>
```

> 示例里字段 `title` 用了 `TextArm` 数组与 `Tmpl` 模板两种动态写法：前者按 `data.species`
> 匹配出不同标题，后者用模板串按值前缀拼标题，二者都随 `data` 实时重算。

## 总结

`TiForm` 适合单条记录的标准录入：一行标题、若干字段、一行提示，顶部底部可粘性。需要把
字段按业务分组收进多个页签时用 `TiTabsForm`；需要直接控制栅格轨道、字段组外观、插槽位置
时用底层的 `TiGridFields`；只读回显一条记录则不必用表单，`TiGridFields` 配合只读字段即可。

## 延伸阅读

- **源码入口**
  - `src/lib/shelf/form/ti-form-index.ts` —— 注册表信息与示例配置。
  - `src/lib/shelf/form/ti-form-types.ts` —— `FormProps`（即 `GridFieldsProps`）。
  - `src/lib/shelf/form/TiForm.vue` —— 对 `TiGridFields` 的封装与事件转发。
- **相关文档**
  - 全部字段 / 外观 / 事件参数明细：[TiGridFields 栅格字段组](./ti-grid-fields.md)。
  - 分页签收纳的表单：[TiTabsForm 标签表单](./ti-tabs-form.md)。
  - 共享 Props：[共享 Props](../../10.concepts/02-common-props.md)。
