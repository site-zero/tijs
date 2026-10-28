---
title: TiEditPairs 名值对编辑
keywords: [名值对编辑, EditPairs, TiEditPairs, 对象表单, JSON 编辑, 分组表单, tabs 表单, EDIT]
status: draft
---

# TiEditPairs 名值对编辑

## 介绍

`TiEditPairs` 是编辑类（`EDIT`）控件，用来把一个普通 JavaScript 对象直接变成一张可编辑的
表单：传入 `value` 对象，它自动遍历对象的键，按值的类型挑合适的输入控件（布尔用开关、
数字用数字框、字符串用输入框、对象内嵌代码编辑器），不需要你手写一份字段定义。

它适合「拿到一个结构未知 / 多变的配置对象，先让用户改起来」的场景：环境变量、接口配置、
对象属性面板。需要按业务精细控制每个字段时，再改用 `TiForm` 手工排字段。

使用时需要注意：

- `value` 传字符串时会用 JSON5 解析成对象；传对象则直接使用。
- 嵌套对象默认一路递归展开成点路径字段（如 `general.name`），用 `fieldDepth` 控制递归
  层数。
- `formMode` 为 `"tabs"` 时必须配 `groups` 分组，否则没有可见的表单页。

源码目录：`src/lib/edit/pair/`。

## 例子

### JSON 配置

```json
{
  "value": {
    "name": "xiaobai",
    "age": 12,
    "actived": true
  }
}
```

### Vue 标签调用

```xml
<TiEditPairs :value="configObj" @change="onConfigChange" />
```

## 控件参数

### 数据

- **`value`（`Vars | string`，无默认值）**：要编辑的对象；传字符串按 JSON5 解析，传对象
  直接使用。`null` / `undefined` 按空对象处理。
- **`valueType`（`"obj" | "str" | "auto"`，默认 `"auto"`）**：声明 `value` 的形态；
  `"auto"` 时按当前传入值自动判断对象还是字符串。
- **`fieldDepth`（`number`，默认 `0`）**：递归分析对象的层数。`0` 表示无穷递归，所有
  非叶子键都展平为点路径字段；`1` 表示只把第一层当字段（嵌套对象整体成一个字段）；
  `2` 以此类推。
- **`fields`（`Record<string, FieldRefer>`，无默认值）**：按字段名（点路径，如
  `general.name`）精细指定每个字段用哪个控件配置；支持按路径前缀试退——声明了 `general`
  则所有 `general.*` 字段默认套用，更细的路径再覆盖。
- **`defaultFields`（`Partial<Record<FieldValueType, FieldRefer>>`，无默认值）**：按值类型
  覆盖默认控件映射。内置映射为：布尔 → `TiToggle`、数字 → `TiInputNum`、字符串 →
  `TiInput`、数组 → `TiInputMultiLines`、时间 → `TiInputDateTime`、普通对象 →
  `TiCodeEditor`（json 模式）。
- **`groups`（`EditPairsGroup[]`，无默认值）**：字段分组定义。每组形如
  `{ text, value, fields }`，`fields` 是字段名列表，支持 `*` 通配、`^` 正则、
  `---` 分隔标签。通常需要一个 `{ text: "Other", value: "o", fields: ["*"] }` 兜底
  容纳未归入任何组的字段。
- **`titles` / `icons` / `tips`（`Record<string, ...>`，无默认值）**：按字段名点路径
  覆盖字段标题、标题图标、提示信息，优先级高于 `fields` 里的同名配置。

### 行为

- **`readonly`（`boolean`，无默认值）**：只读模式，透传给底层表单。
- **`formMode`（`"tabs" | "form"`，默认 `"form"`）**：呈现方式。`"form"` 用 `TiForm`
  渲染单页表单；`"tabs"` 用 `TiTabsForm` 按 `groups` 分标签页渲染。
- **`nameEditable`（`boolean`，无默认值）**：类型已声明，当前版本视图未接线，保留备用
  （用于允许编辑字段名 / 新增键值对）。
- **`newButton`（`ButtonProps`，无默认值）**：类型已声明，当前版本视图未接线，保留备用
  （用于声明「新增自定义键」按钮）。

### 外观

- **`formConf`（`Omit<FormProps, "data" | "fields">`，无默认值）**：底层 `TiForm` 的
  补充配置，会覆盖内置的布局默认值（`layoutHint: 1`、`maxFieldNameWidth: 80`、
  `bodyPartGap: "s"` 等）。
- **`tabsConf`（`TabsAspect`，无默认值）**：仅 `formMode` 为 `"tabs"` 时生效，单独指定
  Tabs 的外观配置。

### 回调

本组件无此组参数（字段级控件选择通过 `fields` / `defaultFields` 数据配置完成，不接受
函数注入）。

### 嵌套

本组件本身不暴露插槽，内部按 `formMode` 渲染 `TiForm` 或 `TiTabsForm`；表单的列、分组、
字段控件全部由上述数据属性驱动。

### 事件

- **`change`**：载荷为编辑后的完整对象（`Vars`）；底层表单内容变化时触发。当前模板里
  仅 `TiForm` 分支显式绑定了 `@change`，`TiTabsForm` 分支未显式接事件，tabs 模式下的
  事件回写需以实际运行结果为准。

> 本组件同时继承 `CommonProps` 与 `TabsAspect`，字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)，本篇不再罗列。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单对象（`simple`）

**JSON 配置**

```json
{
  "value": {
    "name": "xiaobai",
    "age": 12,
    "website": "www.site0.xyz",
    "actived": true
  }
}
```

**Vue 标签**

```xml
<TiEditPairs
  :value="{ name: 'xiaobai', age: 12, website: 'www.site0.xyz', actived: true }"
/>
```

### 分组表单（`groups`）

**JSON 配置**

```json
{
  "formMode": "form",
  "groups": [
    { "text": "General", "value": "g", "fields": ["general.*"] },
    { "text": "Address", "value": "a", "fields": ["address.*"] },
    { "text": "Other", "value": "o", "fields": ["*"] }
  ],
  "value": {
    "general": {
      "name": "xiaobai",
      "title": "XiaoBai",
      "age": 12,
      "website": "www.site0.xyz",
      "actived": true
    },
    "address": {
      "city": "Beijing",
      "street": "My Home Is Here",
      "postcode": "10086",
      "email": "zozoh@site0.xyz",
      "mobile": "13910110054",
      "phone": "88765543"
    },
    "note": "xxx",
    "comment": "hello world"
  }
}
```

**Vue 标签**

```xml
<TiEditPairs
  form-mode="form"
  :groups="[
    { text: 'General', value: 'g', fields: ['general.*'] },
    { text: 'Address', value: 'a', fields: ['address.*'] },
    { text: 'Other', value: 'o', fields: ['*'] }
  ]"
  :value="obj"
/>
```

### 标签页表单（`tabs`）

**JSON 配置**

```json
{
  "formMode": "tabs",
  "groups": [
    { "text": "General", "value": "g", "fields": ["general.*"] },
    { "text": "Address", "value": "a", "fields": ["address.*"] },
    { "text": "Other", "value": "o", "fields": ["*"] }
  ],
  "value": {
    "general": {
      "name": "xiaobai",
      "title": "XiaoBai",
      "age": 12,
      "website": "www.site0.xyz",
      "actived": true
    },
    "address": {
      "city": "Beijing",
      "street": "My Home Is Here",
      "postcode": "10086",
      "email": "zozoh@site0.xyz",
      "mobile": "13910110054",
      "phone": "88765543"
    },
    "note": "xxx",
    "comment": "hello world"
  }
}
```

**Vue 标签**

```xml
<TiEditPairs
  form-mode="tabs"
  :groups="[
    { text: 'General', value: 'g', fields: ['general.*'] },
    { text: 'Address', value: 'a', fields: ['address.*'] },
    { text: 'Other', value: 'o', fields: ['*'] }
  ]"
  :value="obj"
/>
```

## 总结

`TiEditPairs` 适合「结构动态、先跑起来再说」的对象编辑：拿到对象自动生成表单，省去手写
字段定义。需要固定业务字段、校验规则、复杂布局时，直接用 `TiForm` 更可控；需要编辑一段
裸 JSON 文本而非结构化对象时，改用 `TiCodeEditor`。注意 `nameEditable`、`newButton`
当前未接线，不要依赖它们做「新增键值对」交互。

## 延伸阅读

- **源码入口**
  - `src/lib/edit/pair/ti-edit-pairs-index.ts` —— 注册表信息与示例配置。
  - `src/lib/edit/pair/edit-pairs-types.ts` —— `EditPairsProps`、`EditPairsEmitter`、
    `EditPairsGroup`。
  - `src/lib/edit/pair/TiEditPairs.vue` —— 视图，按 `formMode` 切换 `TiForm` / `TiTabsForm`。
  - `src/lib/edit/pair/use-edit-pairs-api.ts` —— 输入值归一化与形态判断。
  - `src/lib/edit/pair/gui-edit-pairs-form.ts` —— 表单配置装配。
  - `src/lib/edit/pair/support/` —— 字段递归构建、分组、按值类型挑控件。
- **相关文档**
  - 手工排字段的普通表单：[TiForm 表单](../shelf/ti-form.md)。
  - 字段控件注册表机制：[组件模型](../../10.concepts/01-component-model.md)。
  - 事件回写规则：[事件绑定](../../10.concepts/03-event-binding.md)。
