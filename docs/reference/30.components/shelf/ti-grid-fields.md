---
title: TiGridFields 栅格字段组
keywords: [栅格字段组, grid fields, TiGridFields, 表单, 字段布局, 嵌套字段, SHELF]
status: draft
---

# TiGridFields 栅格字段组

## 介绍

`TiGridFields` 用 CSS Grid 把一组字段按行列排布成一张可录入的表。你给它一条记录 `data`，
再用 `fields` 数组声明每个字段叫什么、用什么控件编辑，它就负责把值分发到每个子控件、
把改动汇总回来。

它是一个可以无限嵌套的字段容器：`fields` 数组里的每一项按特征分成三种角色——

- **field（普通字段）**：声明了 `name`，绑定 `data` 里的某个键，由一个录入控件编辑。
- **group（字段组）**：声明了 `fields`，是一层子栅格，可带标题栏（`legend` / `bottom-line`
  / `bar` 三种外观），把若干字段再包成一块。
- **label（文本标签）**：既没有 `name` 也没有 `fields`，只渲染一段说明文字，用于在表格
  里占位或分组提示。

`TiForm` 与 `TiTabsForm` 都是在它之上做的封装，日常直接用这两个上层组件即可；
需要精细控制字段栅格时才直接用本组件。

使用时需要注意：

- 它注册的 `race` 是 `INNER`（内部栅格），不是独立业务控件；值改动通过 `change` 事件
  向外抛，本身不持有、不回写 `data`。
- 字段是否必填、只读、可见都是**动态**的：`required`、`readonly`、`visible` 接受
  `TiMatch` 匹配表达式，可随 `data` 联动变化。
- 字段校验失败时仍会发 `change-validate` 报错；是否阻断 `change` 由 `blockInvalid` 控制。

源码目录：`src/lib/shelf/grid-fields/`。

## 例子

### JSON 配置

```json
{
  "data": { "name": "Stripes", "age": 5 },
  "defaultComType": "TiInput",
  "fields": [
    { "title": "名称", "name": "name", "required": true },
    { "title": "年龄", "name": "age", "type": "Integer" }
  ]
}
```

### Vue 标签调用

```xml
<TiGridFields
  :data="formData"
  default-com-type="TiInput"
  :fields="fields"
  @change="onChange"
/>
```

## 控件参数

### 数据

- **`data`（`Vars`，默认 `{}`）**：要编辑的记录对象；每个 field 项的 `name` 从中取值、
  改动后经 `change` 带出。
- **`fields`（`FieldRefer[]`，默认 `[]`）**：字段 / 字段组 / 文本标签的定义数组，支持无限
  嵌套，详见「嵌套」。
- **`vars`（`Vars`，无默认值）**：动态解释 `title` / `tip` / `comConf` 时额外的上下文变量。
- **`fieldSetName`（`string`，无默认值）**：采用「快捷字段定义」集合名；`fields` 数组里
  可只写字段名或 `[name, partial]` 的引用形式，由该集合补全定义。
- **`title`（`string | TextArm | (ctx) => string`，无默认值）**：表单头部标题，支持 `i18n:`
  前缀、`Tmpl` 模板与按 `data` 动态计算；配 `titleType` 指定为 `text` 还是 `html`。
- **`tip`（`string | null`，无默认值）**：表单尾部说明文字，`tipType` 指定文本类型。
- **`emptyRoadblock`（`RoadblockProps`，无默认值）**：`data` 为空时显示的空数据占位块，
  默认文案为「empty-data」，可整对象覆盖。

### 行为

- **`changeMode`（`"diff" | "all"`，默认 `"diff"`）**：`change` 事件载荷形态；`diff` 只带
  差异，`all` 带合并后的整条记录。
- **`allowUndefinedFields`（`boolean`，默认 `true`）**：改动了 `fields` 里没定义的字段时，
  视为合法放行；置 `false` 则报 `FIELD_UNDEFINED`。
- **`makeVirtualField`（`true | (change) => field`，默认 `true`）**：遇到未定义字段时是否
  自动补一个虚拟字段继续处理；传函数可自定义虚拟字段构造。
- **`blockInvalid`（`boolean`，无默认值）**：校验失败时是否不发 `change`（仍会发
  `change-validate`）。
- **`linkFields`（`Record<uniqKey, loader>`，无默认值）**：字段联动；指定字段改动后异步
  回调，返回的字段改动会一并合并进本次 `change-fields`。
- **`ignoreActivedField`（`boolean`，无默认值）**：是否忽略字段激活态；表单里不关心
  「当前聚焦哪个字段」时开启，避免 radio 等控件因重渲染丢掉点击事件。
- **`fieldSetName` / 动态标题** 等见「数据」。

### 外观

- **`bodyPartGap`（`AspectSize`，默认 `"m"`）**：字段之间栅格间距分级 `t / s / m / b / h`。
- **`bodyPartFontSize`（`AspectSize`，默认 `"s"`）**：字段体字号分级。
- **`bodyPartDense`（`boolean`，无默认值）**：紧凑模式，压缩字段行高。
- **`bodyPartStyle`（`Vars`，无默认值）**：表单体区域追加的内联样式。
- **`maxFieldNameWidth`（`number | string`，默认 `"6em"`）**：字段标题（名称）最大宽度。
- **`fieldLayoutMode`（`FormFieldLayoutMode`，默认 `"h-title-icon-suffix"`）**：单个字段的
  标题 / 值 / 提示排布模式，可取 `h-wrap`、`h-bottom`、`v-wrap`，以及
  `h|v-title-icon-prefix|suffix`、`h|v-value-icon-prefix|suffix` 等 11 种图标位置变体。
- **`layoutHint`（`GridLayoutHint`，无默认值）**：栅格列数自适应规则——数字固定列数，
  `[[列数, 视口宽度], ...]` 按视口宽度断点决定列数。
- **`layoutGridTracks`（`string | string[]`，无默认值）**：按列下标定制每列轨道宽度，
  如 `"80px,200px,1fr"`。
- **`groupAspect`（`"legend" | "bottom-line" | "bar"`，无默认值）**：字段组标题栏外观，
  向下继承给下属字段组。

### 回调

- **`whenGrid`（`(grid: GridFieldsApi) => void`，无默认值）**：字段栅格编译完成后的回调，
  可拿到编译后的 `strictItems`、`fieldItems`、`title` 等中间结果做二次加工。
- **`fieldStatus`（`Record<name, FieldStatus>`，无默认值）**：逐字段状态（`ok / error /
  warn / pending`…），驱动字段标题、图标的着色与提示。
- **`fieldStatusIcons`（`FieldStatusIcons`，无默认值）**：每种状态对应的图标配置。

### 嵌套

子控件**不通过 slot 传入**，而是由 `fields` 数据数组描述；每个 field 项用 `comType` +
`comConf` 指定要渲染的录入控件：

- **`fields` 数组（顶层）**：数组每项是一个字段定义 `GridFieldsInput`：
  - 普通字段给 `name`、`title`、`comType`、`comConf`、`required`、`type`、`tip` 等；
  - 字段组给 `fields`（子数组）+ `title`，可无限嵌套；
  - 文本标签只给 `title` 即可。
- **`defaultComType` / `defaultComConf`**：未在 field 项里写 `comType` 时的默认控件与默认
  配置，对整组生效。
- **`defaultFieldTitleBy` / `defaultFieldTipBy`**：默认的字段标题 / 提示自定义渲染控件
  （`FieldComProps`），用于把字段名渲染成可编辑控件等场景。
- **`#head` slot**：覆盖默认的表单标题区（默认渲染 `title`）。
- **`#head_ext` / `#foot_ext` slot**：表单体上、下方的额外插槽（`TiTabsForm` 用 `head_ext`
  放标签条）。
- **`#foot` slot**：覆盖默认的表单尾部提示区（默认渲染 `tip`）。

### 事件

- **`change`**：载荷为 `Vars`；任一子控件改动并通过校验后触发。载荷形态由 `changeMode`
  决定（差异 / 整条记录）。
- **`change-fields`**：载荷为 `FieldChange[]`（`{uniqKey, name, value, oldVal}` 列表）；
  每次 `change` 同步发出，反映本次改动涉及的全部字段（含联动字段）。
- **`change-validate`**：载荷为 `{name, uniqKey, type: "error", text}`；字段必填为空、格式
  非法或未定义时报错；校验通过不发。
- **`name-change`**：载荷为 `FieldChange`；字段标题本身可编辑（`defaultFieldTitleBy`）时，
  标题值变化触发。
- **`dom-ready`**：载荷为 `{el, main}`；组件挂载后立即触发一次，给出根节点与表单体节点。

> 本组件同时继承 `CommonProps`（`className`、`style`）及字段级 `readonly` / `visible`
> 等共享能力，字段定义的 `comType/comConf/autoValue/readonlyComType/activatedComType`
> 等约定见 [组件模型](../../10.concepts/01-component-model.md) 与
> [共享 Props](../../10.concepts/02-common-props.md)，本篇不再罗列。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单栅格（`simple`）

**JSON 配置**

```json
{
  "data": {
    "id": "Um5Cub2yX",
    "name": "Mahanta Lloyd",
    "title": "pamperedly schmitz enne",
    "brief": "Earthy numerably abulia globus rosinweed. ",
    "client": "192.168.12.211",
    "age": 32,
    "role": "staff",
    "address": "stuck-uppishness pteromalid"
  },
  "defaultComType": "TiInput",
  "title": "<b style=\"color:red\">Hello</b> world",
  "titleType": "html",
  "bodyPartGap": "b",
  "bodyPartFontSize": "m",
  "layoutHint": "[[6,1400],[5,1150],[4,900],[3,750],[2,500],1]",
  "maxFieldNameWidth": 60,
  "bodyPartDense": true,
  "fields": [
    {
      "title": "Id",
      "name": "id",
      "tip": "This is ID",
      "fieldLayoutMode": "h-wrap",
      "className": "is-warn",
      "fieldTitleBy": {
        "comType": "TiHtmlSnippet",
        "comConf": { "content": "<b>Hello</b> <i class=\"zmdi zmdi-info\"></i>" }
      },
      "comType": "TiLabel"
    },
    { "title": "Age", "name": "age", "type": "Integer", "tip": "This is Age", "fieldLayoutMode": "h-bottom" },
    { "title": "Name", "name": "name", "tip": "This is Name", "required": true, "colSpan": 20, "fieldLayoutMode": "v-wrap" },
    { "title": "Title", "name": "title", "tip": "This is Title", "tipIcon": "zmdi-face", "fieldLayoutMode": "h-title-icon-prefix", "disabled": { "age": "[40,80]" } },
    { "title": "Brief", "name": "brief", "tip": "This is Brief", "fieldLayoutMode": "h-title-icon-suffix" },
    { "title": "Client", "name": "client", "tip": "This is Client", "fieldLayoutMode": "h-value-icon-prefix" },
    { "title": "Role", "name": "role", "tip": "This is Role", "fieldLayoutMode": "h-value-icon-suffix" },
    { "title": "Email", "name": "email", "fieldLayoutMode": "v-title-icon-prefix" },
    { "title": "Phone", "name": "phone", "tip": "This is Phone", "fieldLayoutMode": "v-title-icon-suffix" },
    { "title": "Address", "name": "address", "fieldLayoutMode": "v-value-icon-prefix" },
    { "title": "City", "name": "city", "tip": "This is City", "fieldLayoutMode": "v-value-icon-suffix" },
    { "title": "Country", "name": "country", "tip": "This is Country", "fieldLayoutMode": "h-wrap" },
    { "title": "Occupation", "name": "occupation", "tip": "This is Occupation", "fieldLayoutMode": "h-wrap" },
    { "title": "Company", "name": "company", "tip": "This is Company", "fieldLayoutMode": "v-wrap" },
    { "title": "Department", "name": "department", "tip": "This is Department", "fieldLayoutMode": "h-bottom", "maxFieldNameWidth": 100 }
  ]
}
```

**Vue 标签**

```xml
<TiGridFields
  :data="formData"
  default-com-type="TiInput"
  title="<b style=\"color:red\">Hello</b> world"
  title-type="html"
  body-part-gap="b"
  body-part-font-size="m"
  layout-hint="[[6,1400],[5,1150],[4,900],[3,750],[2,500],1]"
  :max-field-name-width="60"
  :body-part-dense="true"
  :fields="fields"
/>
```

### 嵌套字段组（`nested`）

**JSON 配置**

```json
{
  "data": {
    "company_name": "Innovative Tech Solutions",
    "job_title": "Senior Software Engineer",
    "name": "Mahanta Lloyd",
    "age": 32,
    "gender": "Male",
    "dob": "1991-04-15",
    "birth_place": "London, UK",
    "hobbies": ["Coding", "Mountain Biking", "Photography"],
    "email": "mahanta.lloyd@example.com",
    "phone": "+86 13910110054",
    "address": "1234 Tech Park, Silicon Alley",
    "city": "Beijing",
    "postal_code": "100080",
    "country": "China"
  },
  "bodyPartGap": "b",
  "bodyPartFontSize": "m",
  "layoutHint": 1,
  "maxFieldNameWidth": 120,
  "fieldLayoutMode": "h-wrap",
  "defaultComType": "TiInput",
  "fields": [
    {
      "title": "General",
      "rowSpan": 4,
      "layoutHint": "[[3,600],[2,400],1]",
      "groupAspect": "bar",
      "maxFieldNameWidth": 60,
      "fields": [
        { "title": "Name", "name": "name" },
        { "title": "Age", "name": "age" },
        { "title": "Gender", "name": "gender" },
        { "title": "Date of Birth", "name": "dob" },
        { "title": "Place of Birth", "name": "birth_place" }
      ]
    },
    { "title": "Client", "name": "client", "tip": "This is Client" },
    { "title": "City", "name": "city" },
    { "title": "Country", "name": "country" },
    { "title": "Hobbies", "name": "hobbies" },
    {
      "title": "Contact Info",
      "rowSpan": 4,
      "layoutHint": "[[3,600],[2,400],1]",
      "maxFieldNameWidth": 60,
      "fields": [
        { "title": "Email Address", "name": "email" },
        { "title": "Phone Number", "name": "phone" },
        { "title": "Address", "name": "address" },
        { "title": "Postal Code", "name": "postal_code" }
      ]
    },
    { "title": "Company Name", "name": "company_name" },
    { "title": "Job Title", "name": "job_title" },
    { "title": "Department", "name": "department", "tip": "This is Department" }
  ]
}
```

**Vue 标签**

```xml
<TiGridFields
  :data="formData"
  body-part-gap="b"
  body-part-font-size="m"
  :layout-hint="1"
  :max-field-name-width="120"
  field-layout-mode="h-wrap"
  default-com-type="TiInput"
  :fields="fields"
/>
```

### 整行字段（`sameline`）

**JSON 配置**

```json
{
  "data": {
    "type": "work",
    "phone": "+86 13910110054",
    "comment": "stuck-uppishness pteromalid"
  },
  "bodyPartGap": "s",
  "bodyPartFontSize": "m",
  "layoutHint": 3,
  "layoutGridTracks": "80px,200px,1fr",
  "maxFieldNameWidth": "auto",
  "fieldLayoutMode": "h-title-icon-prefix",
  "defaultComType": "TiInput",
  "fields": [
    { "name": "type" },
    { "title": "-", "name": "phone" },
    { "title": "-", "name": "comment" }
  ]
}
```

**Vue 标签**

```xml
<TiGridFields
  :data="formData"
  body-part-gap="s"
  body-part-font-size="m"
  :layout-hint="3"
  layout-grid-tracks="80px,200px,1fr"
  max-field-name-width="auto"
  field-layout-mode="h-title-icon-prefix"
  default-com-type="TiInput"
  :fields="fields"
/>
```

### 字段名可编辑（`editname`）

**JSON 配置**

```json
{
  "data": {
    "name": "Mahanta Lloyd",
    "age": 32,
    "title": "pamperedly schmitz enne",
    "brief": "Earthy numerably abulia globus rosinweed. ",
    "city": "BeiJing",
    "phone": "+86 13910110054",
    "address": "stuck-uppishness pteromalid"
  },
  "bodyPartGap": "t",
  "bodyPartFontSize": "b",
  "layoutHint": 1,
  "maxFieldNameWidth": 120,
  "fieldLayoutMode": "h-wrap",
  "defaultFieldTitleBy": {
    "dynamic": true,
    "comType": "TiInput",
    "comConf": { "value": "=name", "format": "=title" }
  },
  "fields": [
    { "title": "Name", "name": "name", "required": true, "comType": "TiInput" },
    { "title": "Age", "name": "age", "type": "Integer", "comType": "TiInput" },
    { "title": "Title", "name": "title", "comType": "TiInput" },
    { "title": "Brief", "name": "brief", "comType": "TiInput" },
    { "title": "City", "name": "city", "comType": "TiInput" },
    { "title": "Phone", "name": "phone", "comType": "TiInput" },
    { "title": "Address", "name": "address", "comType": "TiInput" }
  ]
}
```

**Vue 标签**

```xml
<TiGridFields
  :data="formData"
  body-part-gap="t"
  body-part-font-size="b"
  :layout-hint="1"
  :max-field-name-width="120"
  field-layout-mode="h-wrap"
  :default-field-title-by="{ dynamic: true, comType: 'TiInput', comConf: { value: '=name', format: '=title' } }"
  :fields="fields"
/>
```

### 字段状态（`status`）

**JSON 配置**

```json
{
  "data": {
    "id": "Um5Cub2yX",
    "name": "Mahanta Lloyd",
    "title": "pamperedly schmitz enne",
    "brief": "Earthy numerably abulia globus rosinweed. ",
    "client": "192.168.12.211",
    "age": 32,
    "role": "staff",
    "city": "BeiJing",
    "country": "China",
    "address": "stuck-uppishness pteromalid"
  },
  "title": "Show Field Status",
  "bodyPartDense": true,
  "defaultComType": "TiInput",
  "fieldStatus": {
    "name": { "type": "ok" },
    "age": { "type": "error" },
    "title": { "type": "warn" },
    "client": { "type": "pending" },
    "city": { "type": "pending" }
  },
  "fields": [
    { "title": "ID", "name": "id", "tip": "This is ID", "comType": "TiLabel" },
    { "title": "Age", "name": "age", "type": "Integer", "tip": "This is Age" },
    { "title": "Name", "name": "name", "tip": "This is Name", "required": true },
    { "title": "Title", "name": "title", "tip": "This is Title", "tipIcon": "zmdi-face", "disabled": { "age": "[40,80]" } },
    { "title": "Brief", "name": "brief", "tip": "This is Brief", "colSpan": 20 },
    { "title": "Client", "name": "client", "tip": "This is Client" },
    { "title": "Role", "name": "role", "tip": "This is Role" },
    { "title": "Email", "name": "email" },
    { "title": "Phone", "name": "phone", "tip": "This is Phone" },
    { "title": "Address", "name": "address" },
    { "title": "Location", "name": ["city", "country"], "type": "Object", "tip": "This is City", "comType": "TiLabel" }
  ]
}
```

**Vue 标签**

```xml
<TiGridFields
  :data="formData"
  title="Show Field Status"
  :body-part-dense="true"
  default-com-type="TiInput"
  :field-status="{ name: { type: 'ok' }, age: { type: 'error' }, title: { type: 'warn' }, client: { type: 'pending' }, city: { type: 'pending' } }"
  :fields="fields"
/>
```

## 总结

`TiGridFields` 是字段栅格的底层引擎：需要按行列自适应、字段组嵌套、逐字段动态校验与联动
时直接用它。绝大多数业务场景应改用更薄、带固定表头表尾样式的 `TiForm`；字段需要分页签
收纳时改用 `TiTabsForm`。它本身不管理数据提交与整体校验入口，只负责单条记录的字段级
分发与回写；`change` 默认只发差异，对接外层数据模型时留意 `changeMode` 选择。

## 延伸阅读

- **源码入口**
  - `src/lib/shelf/grid-fields/ti-grid-fields-index.ts` —— 注册表信息与示例配置。
  - `src/lib/shelf/grid-fields/ti-grid-fields-types.ts` —— `GridFieldsProps`、`GridFieldsInput`、`GridFieldsEmitter`。
  - `src/lib/shelf/grid-fields/TiGridFields.vue` —— 视图、插槽与事件接线。
  - `src/lib/shelf/grid-fields/use-grid-fields.ts` —— 字段定义编译。
  - `src/lib/shelf/grid-fields/build-grid-field.ts` —— 字段 / 组 / 标签三态解析。
  - `src/lib/shelf/grid-fields/GFItField.vue` —— 单个字段的标题 / 值 / 提示渲染。
  - `src/lib/_features/field/use-field-change.ts` —— `changeMode`、联动与校验。
- **相关文档**
  - 带表头表尾样式的上层封装：[ti-form](ti-form.md)。
  - 分页签收纳字段：[ti-tabs-form](ti-tabs-form.md)。
  - 子控件引用与只读 / 激活态约定：[组件模型](../../10.concepts/01-component-model.md)。
  - 字段改动事件回写：[事件绑定](../../10.concepts/03-event-binding.md)。
