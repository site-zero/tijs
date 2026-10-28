---
title: use-form-field-change 表单字段变更处理
keywords: [hook, useFormFieldChange, use-form-field-change, buildGridFields, FieldRefer, buildErrorMessageAsHtml, getWatchedFields, 表单校验]
status: draft
---

# `use-form-field-change` 表单字段变更处理

## 解决什么问题

[use-field-change](./use-field-change.md) 直接接收"已经解析好的字段对象列表"；但 `TiForm`、
表格行编辑拿到的往往是一份 `FieldRefer` 配置（字符串键、`[键, 覆盖]` 元组或完整自定义对象），
还要递归展开字段组、从标准字段集里取出真正的字段定义。

`useFormFieldChange` 在 `useFieldChange` 之上包了一层：先用 `useObjFields(fieldSetName)`
取字段集、用 `buildGridFields` 把 `FieldRefer[]` 编译成表单字段树，递归收集其中 `race === 'field'`
的真实字段（跳过 `group`），再交给 `useFieldChange` 跑变更流水线，并额外提供"把错误列表
拼成 HTML"的工具。

## 输入 Props

```ts
useFormFieldChange(props, fields, fieldSetName?)
```

- **`props: FieldChangeProps<FormFieldItem>`** —— 与 [use-field-change](./use-field-change.md)
  完全相同的变更配置（`changeMode`、`allowUndefinedFields`、`blockInvalid`、`makeVirtualField`、
  `linkFields`）。
- **`fields: FieldRefer[]`** —— 受监控的字段引用列表，元素可为字符串键、`[键, 覆盖]` 元组
  或完整字段对象。
- **`fieldSetName?: string`** —— 指定取哪一份标准字段集（传给 `useObjFields(name)`），
  缺省为默认集。

## 返回值 API

```ts
const fc = useFormFieldChange(props, fields, fieldSetName);
```

返回类型 `FormFieldChangeApi`：**`useFieldChange` 的全部 API**（`getField`、
`applyFieldChange`、`verifyFieldChange`、`makeChangeData`、`getDiffData`、`tidyValueChange`、
`handleValueChange`、`getValidationErrorMessage`）外加两个方法：

- **`getWatchedFields()`** —— 返回当前真正监控的字段列表（已递归展开字段组后的
  `FormFieldItem[]`）。
- **`buildErrorMessageAsHtml(errors, data?, vars?)`** —— 把校验错误列表拼成一段 `<ol>`
  HTML 字符串：每个 `<li>` 输出字段标题（支持 `titleType === 'html'`）、当前值（数字/布尔/
  日期/非空文本时输出 `<code>`）和错误文本；`vars` 与 `data` 并入标题解析上下文。

## 配合使用

- **与标准字段集**：`FieldRefer` 字符串键对应 [field 概述](./field-overview.md) 中
  `init_ti_std_fields` 注册的字段（如 `#INPUT`、`obj.title`）。
- **与字段组**：`buildGridFields` 产出的树里 `race === 'group'` 的节点会被递归展开，
  只有 `race === 'field'` 的叶子进入监控列表。
- **与错误展示**：`buildErrorMessageAsHtml` 的产出可直接喂给对话框/提示区做汇总报错。

典型调用片段：

```ts
const fc = useFormFieldChange(
  { changeMode: 'all', blockInvalid: true },
  ['*name', ['age', { required: true }]],
);

await fc.handleValueChange(
  { uniqKey: 'name', value: 'Tom', oldVal: '' },
  { emit, data: rowData }
);

// 汇总报错时把错误列表转成 HTML
const html = fc.buildErrorMessageAsHtml(errors, rowData);
```

## 注意事项

- **字段组会被递归展开**：声明在 `group` 下的字段也会被监控，不止顶层 `field`。
- **`buildErrorMessageAsHtml` 跳过找不到字段的错误项**（`getField` 返回空时 `continue`）。
- **本 hook 是同步构建的**：`FieldRefer` 列表在调用时一次性编译，运行期增删字段需重新调用。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/field/use-form-field-change.ts` —— 本 hook 实现。
  - `src/lib/_features/field/use-field-change.ts` —— 被包装的底层变更流水线。
- **相关文档**
  - 标准字段注册：[field 概述](./field-overview.md)。
  - 整行数据校验：[validate/use-data-validate](../validate/use-data-validate.md)。
