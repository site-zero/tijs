---
title: TiTabsForm 标签表单
keywords: [标签表单, tabs form, TiTabsForm, 分页签表单, 多页录入, SHELF]
status: draft
---

# TiTabsForm 标签表单

## 介绍

`TiTabsForm` 把一张表单切成多个页签：顶层 `fields` 数组里的**每一项自动变成一个标签页**，
标签文字取自该项的 `title`、图标取自 `titleIcon`、提示取自 `tip`；切到哪个页签，就把那个
字段组的 `fields` 交给一块 `TiGridFields` 渲染。它适合字段很多、想按「基本信息 / 联系信息 /
更多设置」分组收纳的录入界面。

它本质上是「`TiTabs` + `TiGridFields`」的组合，标签条可粘在顶部或底部，当前页签可以持久
化。`TabsFormProps` = `FormProps` + `TabsAspect`，所以除标签条外观外，表单参数与 `TiForm`
一致。

使用时需要注意：

- 顶层每个字段项应当是一个**字段组**（声明 `fields`），其标题就是标签名；普通字段直接放在
  顶层会变成一个空标签。
- 组件只向外转发 `change`、`change-fields`、`name-change`、`dom-ready`；`TiGridFields`
  的 `change-validate` 在本组件里**未转发**。
- 标签切换不改动 `data`，不同页签共享同一条记录。

源码目录：`src/lib/shelf/form/`（race：`SHELF`）。

## 例子

### JSON 配置

```json
{
  "data": { "name": "Stripes", "age": 5 },
  "defaultComType": "TiInput",
  "fields": [
    {
      "title": "General",
      "fields": [
        { "title": "Name", "name": "name", "comType": "TiInput" }
      ]
    },
    {
      "title": "More",
      "fields": [
        { "title": "Habitat", "name": "habitat", "comType": "TiInput" }
      ]
    }
  ]
}
```

### Vue 标签调用

```xml
<TiTabsForm
  :data="formData"
  default-com-type="TiInput"
  :fields="fields"
  tabs-at="top"
  @change="onChange"
/>
```

## 控件参数

### 数据

- **`data`（`Vars`，默认 `{}`）**：整表共享的记录对象，所有页签读写同一份。
- **`fields`（`FieldRefer[]`）**：顶层数组每一项成为一个标签页；该项的 `title` / `titleIcon`
  / `tip` 渲染成标签，该项的 `fields` 是该页签内的字段组。
- 其余 `FormProps` 数据属性（`vars`、`title`、`tip`、`emptyRoadblock`、`fieldSetName`）同
  `TiGridFields`。

### 行为

- **`tabsAt`（`"top" | "bottom"`，默认 `"top"`）**：标签条贴在表单顶部还是底部。
- **`tabsAlign`（`"left" | "right" | "center"`，默认 `"center"`）**：标签组横向对齐。
- **`wrapTabs`（`boolean`，默认 `false`）**：标签过多时是否允许换行。
- **`tabItemSpace`（`AspectSize`，默认 `"m"`）**：标签之间间距分级。
- **`tabMaxWidth`（`string | number`，无默认值）**：单个标签最大宽度。
- **`defaultTab`（`string | number`，无默认值）**：默认激活的页签（标签 value 或下标）。
- **`keepTab`（`KeepInfo | string`，无默认值）**：把当前页签持久化到 `localStorage` /
  `sessionStorage`，刷新后恢复；传字符串即持久化键名。
- 表单行为（`changeMode`、`allowUndefinedFields`、`makeVirtualField`、`blockInvalid`、
  `linkFields`）同 `TiGridFields`，本组件默认 `changeMode: "diff"`、`allowUndefinedFields:
  true`、`makeVirtualField: true`。

### 外观

- **`className` / `style`**：组件根类与样式；示例常用 `title-sticky`、`foot-sticky`、
  `body-stretch` 让表头表尾与标签条吸附。
- 字段栅格外观（`bodyPartGap`、`bodyPartFontSize`、`fieldLayoutMode`、`maxFieldNameWidth`、
  `layoutHint` 等）会作为默认值下发给每个页签的 `TiGridFields`，单个页签可在其字段组上
  覆盖。

### 回调

- 同 `TiGridFields`：`whenGrid`、`fieldStatus`、`fieldStatusIcons`。

### 嵌套

- **顶层 `fields` 数组即页签定义**：每个字段组 = 一个标签页，页内字段写在该组的 `fields`
  里；这是本组件放置子控件的唯一方式，不提供具名插槽。
- 标签条由组件内部用 `TiTabs` 渲染，插入 `TiGridFields` 的 `head_ext`（顶部）或
  `foot_ext`（底部）插槽。

### 事件

- **`change`**：载荷 `Vars`；任一页签内字段改动后触发，形态由 `changeMode` 决定。
- **`change-fields`**：载荷 `FieldChange[]`；本次改动涉及的字段列表。
- **`name-change`**：载荷 `FieldChange`；字段标题可编辑时转发。
- **`dom-ready`**：载荷 `{el, main}`；挂载后触发一次，组件据此测量表头表尾高度以让标签条
  正确吸附。
- `TiGridFields` 的 `change-validate` 本组件未向外转发，校验错误只在页签内部呈现。

> 本组件同时继承 `CommonProps`，共享 Props 见
> [共享 Props](../../10.concepts/02-common-props.md)；表单字段参数明细见
> [TiGridFields 栅格字段组](./ti-grid-fields.md)。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 普通标签表单（`tabs`）

**JSON 配置**

```json
{
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
  "className": "body-stretch title-sticky foot-sticky",
  "tabsAt": "top",
  "keepAt": "Ti-Demo-Form-Tab-Current",
  "defaultComType": "TiInput",
  "bodyPartFontSize": "b",
  "bodyPartGap": "b",
  "fields": [
    {
      "title": "General",
      "titleIcon": "zmdi-bike",
      "uniqKey": "general",
      "fields": [
        { "title": "Age", "name": "age", "type": "Integer", "tip": "This is Age" },
        { "title": "Name", "name": "name", "tip": "This is Name", "required": true },
        { "title": "Title", "name": "title", "tip": "This is Title", "tipIcon": "zmdi-face" },
        { "title": "Brief", "name": "brief", "tip": "This is Brief" },
        { "title": "Client", "name": "client", "tip": "This is Client" },
        { "title": "Role", "name": "role", "tip": "This is Role" },
        { "title": "Email", "name": "email" },
        { "title": "Phone", "name": "phone", "tip": "This is Phone" }
      ]
    },
    {
      "title": "More",
      "titleIcon": "zmdi-pin-help",
      "uniqKey": "more",
      "layoutHint": 1,
      "fields": [
        { "title": "Habitat", "name": "habitat", "comType": "TiInput" },
        { "title": "Diet", "name": "diet", "comType": "TiInput" },
        { "title": "Weight", "name": "weight", "comType": "TiInput" },
        { "title": "Height", "name": "height", "comType": "TiInput" },
        { "title": "Color", "name": "color", "comType": "TiInput" }
      ]
    }
  ]
}
```

**Vue 标签**

```xml
<TiTabsForm
  :data="formData"
  title="Simple Form With Sticky Title"
  class-name="body-stretch title-sticky foot-sticky"
  tabs-at="top"
  default-com-type="TiInput"
  body-part-font-size="b"
  body-part-gap="b"
  :fields="fields"
/>
```

> 注册表原示例在顶层写的是 `keepAt`，但类型声明中持久化键应为 `keepTab`（`KeepInfo |
> string`）；按当前源码，应传 `keepTab: "Ti-Demo-Form-Tab-Current"` 才能真正恢复上次页签。

## 总结

`TiTabsForm` 适合单条记录字段多、需要按业务分组分页签录入的场景；字段少、一屏放下时直接
用 `TiForm` 更简单。页签之间共享同一份 `data`，切换页签不会丢未提交的输入。需要的是
「标签页里各放一块完全独立的布局块」而非字段录入时，应改用布局类的 `TiLayoutTabs`。

## 延伸阅读

- **源码入口**
  - `src/lib/shelf/form/ti-tabs-form-index.ts` —— 注册表信息与示例配置。
  - `src/lib/shelf/form/ti-tabs-form-types.ts` —— `TabsFormProps`。
  - `src/lib/shelf/form/TiTabsForm.vue` —— 标签条与当前页签表单装配。
  - `src/lib/shelf/form/use-tabs-form.ts` —— 由顶层字段生成标签页、取出当前页签表单参数。
- **相关文档**
  - 单页签表单：[TiForm 表单](./ti-form.md)。
  - 字段栅格参数明细：[TiGridFields 栅格字段组](./ti-grid-fields.md)。
  - 布局意义上的标签页：[TiLayoutTabs 标签布局](./ti-layout-tabs.md)。
