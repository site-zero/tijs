---
title: TiBatchForm 批量表单
keywords: [批量表单, batch form, TiBatchForm, 批量修改, 字段勾选, 部分更新, EDIT]
status: draft
---

# TiBatchForm 批量表单

## 介绍

`TiBatchForm` 是编辑类（`EDIT`）的批量修改表单：它在普通表单的每个字段标题前加一个勾选框，
只有勾中的字段才会被编辑、才会出现在回传的数据里。这是「批量更新多条记录时只改指定字段」
的经典交互——比如批量改用户，只想改「部门」就勾「部门」，没勾的字段保持原值不动。

它本质是对 `TiForm` 的封装：除了 `defaultFieldTitleBy` 被接管用于渲染勾选标题外，表单的
`data`、`fields`、`layoutHint`、`changeMode` 等都按 `TiForm` 的方式配置。

使用时需要注意：

- 未勾选的字段会被禁用（`disabled` / `readonly`），编辑不了。
- 回传的 `change` 载荷只包含勾中的字段；如果一个字段都没勾、且原 `data` 非空，会抛一个空
  对象表示「不做任何更新」。
- 字段仍用表单的快速语法声明，如 `"#INPUT=name/姓名"`。

源码目录：`src/lib/edit/batch-form/`。

## 例子

### JSON 配置

```json
{
  "data": { "age": 23, "name": "xiaobai" },
  "fields": [
    "#INPUT=name/Name",
    "#INPUT-INT=age/Age",
    "#TOGGLE=is_admin/Is Admin"
  ]
}
```

### Vue 标签调用

```xml
<TiBatchForm
  :data="formData"
  :fields="[
    '#INPUT=name/Name',
    '#INPUT-INT=age/Age',
    '#TOGGLE=is_admin/Is Admin'
  ]"
  @change="onBatchChange"
/>
```

## 控件参数

`BatchFormProps` 是 `Omit<FormProps, "defaultFieldTitleBy">`，除下述接管点外，所有
`TiForm` 的参数（`data`、`fields`、`layoutHint`、`changeMode`、`style` 等）都可直接用。

### 数据

- **`data`（`Vars`，无默认值）**：表单初始数据；与 `TiForm` 的 `data` 同义。
- **`fields`（表单字段定义，无默认值）**：字段列表，支持 `"#类型=字段名/标题"` 快速语法；
  字段的勾选状态由本控件在标题渲染时附加，不需要单独配置。

### 行为

- **`changeMode`（`DataChangeMode`，默认 `"all"`）**：对外默认按 `all` 理解；组件内部实际
  把底层表单设为 `"diff"`，再只挑出勾中的字段合并后抛出。
- **勾选过滤**：未勾中的字段在视图上被禁用 / 只读，且其值不会进入 `change` 载荷。

### 外观

- **`style`、`layoutHint`、`maxFieldNameWidth` 等布局属性**：透传给底层 `TiForm`，用法与
  普通表单一致。

### 回调

本组件无此组参数（字段勾选交互由标题渲染组件 `BatchFormName` 内置完成）。

### 嵌套

本组件内部渲染 `TiForm`，字段标题统一由 `BatchFormName`（勾选框 + 标题）接管；不对外
暴露插槽。

### 事件

- **`change`**：载荷为仅含勾中字段的数据对象（`Vars`）；字段值变化或勾选状态变化时触发。
  无勾中字段且原 `data` 非空时抛空对象 `{}`。

> 本组件同时继承 `CommonProps`，并复用 `TiForm` 的共享字段配置机制，含义见
> [共享 Props](../../10.concepts/02-common-props.md) 与
> [组件模型](../../10.concepts/01-component-model.md)。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 批量修改表单（`simple`）

**JSON 配置**

```json
{
  "data": { "age": 23, "name": "xiaobai" },
  "style": { "width": "300px" },
  "layoutHint": 1,
  "changeMode": "all",
  "maxFieldNameWidth": "120px",
  "fields": [
    "#INPUT=name/Name is for very long text",
    "#INPUT-INT=age/Age",
    "#TOGGLE=is_admin/Is Admin"
  ]
}
```

**Vue 标签**

```xml
<TiBatchForm
  :data="{ age: 23, name: 'xiaobai' }"
  style="width: 300px"
  :layout-hint="1"
  change-mode="all"
  max-field-name-width="120px"
  :fields="[
    '#INPUT=name/Name is for very long text',
    '#INPUT-INT=age/Age',
    '#TOGGLE=is_admin/Is Admin'
  ]"
/>
```

## 总结

`TiBatchForm` 适合「批量更新、只改指定字段」的场景：勾选框决定哪些字段参与更新，回传载荷
天然就是一份「部分更新」对象。普通单条记录编辑用 `TiForm`；需要编辑结构动态的对象用
`TiEditPairs`。它只是 `TiForm` 的一层勾选过滤封装，表单能力以 `TiForm` 为准。

## 延伸阅读

- **源码入口**
  - `src/lib/edit/batch-form/ti-batch-form-index.ts` —— 注册表信息与示例配置。
  - `src/lib/edit/batch-form/ti-batch-form-types.ts` —— `BatchFormProps`、
    `BatchFormEmitter`。
  - `src/lib/edit/batch-form/TiBatchForm.vue` —— 视图，接管字段标题为勾选框并组装表单。
  - `src/lib/edit/batch-form/use-ti-batch-form-api.ts` —— 勾选状态、字段过滤与回写。
  - `src/lib/edit/batch-form/name/` —— `BatchFormName` 勾选标题渲染组件。
- **相关文档**
  - 普通表单：[TiForm 表单](../shelf/ti-form.md)。
  - 事件回写规则：[事件绑定](../../10.concepts/03-event-binding.md)。
