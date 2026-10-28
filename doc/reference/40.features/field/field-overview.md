---
title: field 字段集与标准字段
keywords: [field, useObjFields, useObjColumns, init_ti_std_fields, init_ti_std_columns, 标准字段, 标准列, FormField, TableInputColumn, FieldRefer, ColumnRefer, 字段注册表]
status: draft
---

# `field/` 字段集与标准字段

## 解决什么问题

`TiForm` 的表单字段、`TiTable` 的表格列都用同一种"字段定义"描述：叫什么、标题是什么、
用哪个控件渲染、激活/只读时分别用什么控件、占几列……如果每个业务页面都要从零写这些定义，
会大量重复。TiJS 因此在库内置了两份全局注册表：

- **字段集（obj-fields）**：按名字（如 `#INPUT`、`obj.title`）登记一批标准表单字段定义，
  供 `TiForm` 的 `fields: FieldRefer[]` 直接引用。
- **列集（obj-columns）**：按名字登记一批标准表格列定义，供 `TiTable` 的列配置引用。

`main.ts` 引导时调用的 `init_ti_std_fields()` / `init_ti_std_columns()` 就是往这两份
注册表里填预置定义（见 [快速上手](../../00.start-here/01-getting-started.md) 第二步）。

## 对外导出

`field/index.ts` 统一再导出下列模块（源码 `src/lib/_features/field/`）：

- **`init_ti_std_fields()`** —— 把一批通用字段（`###` 分隔符、`#ID`、`#INPUT`、`#TEXT`、
  `#INPUT-I/INT/F2/F3/F6`、`#TOGGLE`、`#CHECK`、`#BOOL`、`#INPUT-DATE/DATETIME`、
  `#DROPLIST`）与标准对象字段（`obj.id/pid/title/nm/race/d0/d1/c/m/g/md/tp/mime/len/sha1/ct/lm/expi`）
  注册进默认字段集。
- **`init_ti_std_columns()`** —— 把对应的标准列（含 `ct/lm/ct-txt/lm-txt` 时间列、
  `obj.*` 对象列）注册进默认列集。
- **`useObjFields(name = '_DEFAULT_FIELD_SET'): ObjFieldsApi`** —— 按名字取/建字段集单例，
  返回增删改查 API（见下文）。
- **`useObjColumns(name = '_DEFAULT_COLUMN_SET'): ObjColumnsApi`** —— 按名字取/建列集单例。
- 一批**列构造助手函数**（`use-obj-columns.ts`）：`colID / colLabel / colLabelI /
  colLabelF2~F6 / colLabelDate / colLabelDT / colDroplist / colDroplistVT / colInput /
  colInputUpper / colInputText / colInputI / colInputF2~F6 / colToggle / colCheck / colBool /
  colInputDate / colInputDateTime` —— 各返回一份预置好只读/激活控件的 `TableInputColumn`。
- 一批**字段构造助手函数**（`use-obj-fields.ts`）：`fldID / fldLabel / fldLabelPfxCp /
  fldLabelI / fldLabelF2~F6 / fldLabelDate / fldLabelDT / fldSwitcher / fldMultiSwitcher /
  fldDroplist / fldDroplistVT / fldMultiDroplist / fldMultiDroplistAsStr / fldRadioList /
  fldChecklist / fldInputStrTags / fldInput / fldInputX / fldInputUpper / fldInputText /
  fldInputMultiLineText / fldInputI / fldInputF2~F6 / fldInputNumUnit / fldToggle / fldCheck /
  fldCheckStr / fldBool / fldInputDate / fldInputDateTime / fldInputCode / fldFilterID /
  fldFilterInput / fldFilterInputUpper / fldInputDateRange / fldInputDateRangeUTC /
  fldInputNumRange` —— 各返回一份预置 `FormField`。
- **`parseNameForObjField(key)` / `parseNameColumn(key)`** —— 把简写键（如 `'*name=名称:1/2'`、
  `'~type:!read'`）解析成字段/列信息（`!` 只读、`*` 必选、`~` 禁用、`a/b` 列起止、`c>tip` 提示）。
- 本目录另有 5 个 hook 单独成篇：
  [use-field-change](./use-field-change.md)、[use-field-com](./use-field-com.md)、
  [use-field-serializer](./use-field-serializer.md)、[use-field-tranformer](./use-field-tranformer.md)、
  [use-form-field-change](./use-form-field-change.md)。

## 模块职责分组

```text
字段集（use-obj-fields.ts）            列集（use-obj-columns.ts）
  useObjFields() 单例                     useObjColumns() 单例
  addField / setField                     addColumn / addColumnIfNoExists
  getField / getFieldBy / getFieldList    getColumn / getColumnBy / getColumnList
  getFieldGroup                           colXxx 列构造助手
  fldXxx 字段构造助手
        │                                       │
        ▼                                       ▼
  init_ti_std_fields.ts  ── 注册预置字段 ──┐
  init_ti_std_columns.ts ── 注册预置列 ──┴── main.ts 引导第二步调用
```

- **`useObjFields` 返回的 `ObjFieldsApi`**：`getName`、`getField(uniqKey, field?)`、
  `getFieldBy(fld, field?)`（支持字符串键 / `[键,覆盖]` / 完整自定义）、`getFieldList(keys)`、
  `getFieldGroup(title, keys, setup?)`、`setField`（即 `addField`）、`addFieldIfNoExists`、
  `addFieldSetIfNoExists`、`setDateTimeLabelField`。同名键重复 `setField` 会 `console.warn`。
- **`useObjColumns` 返回的 `ObjColumnsApi`**：`getName`、`getColumn(uniqKey, editable?, column?)`、
  `getColumnBy(col, editable?, column?)`、`getColumnList(cols, editable?, column?)`、
  `addColumn`、`addColumnIfNoExists`。列在只读/不可编辑时会自动去掉激活控件定义；
  表格内 `TiLabel` 默认 `boxRadius: 'none'`，输入类默认 `boxRadius: 'none' + hideBorder: true`。

## 配合使用

- **被引导流程调用**：`init_ti_std_fields()` / `init_ti_std_columns()` 在 [快速上手](../../00.start-here/01-getting-started.md)
  的 `main.ts` 第二步执行，必须在 `installTiComponents(app)` 之前完成。
- **被表单/表格引用**：`TiForm` 的 `fields: FieldRefer[]`、`TiTable` 的列配置直接写标准键
  （`'#INPUT'`、`'obj.title'`），运行时由 `useObjFields().getField(...)` 取出完整定义。
- **被变更/校验 hook 消费**：[use-form-field-change](./use-form-field-change.md) 与
  [validate/use-data-validate](../validate/use-data-validate.md) 都通过 `useObjFields()`
  取字段集来解析 `FieldRefer`。

典型调用片段：

```ts
// 业务自定义字段集：独立命名空间，不污染默认集
const ofs = useObjFields('MY_FORM');
ofs.setField('#INPUT', { name: 'code', comType: 'TiInput', comConf: { trimed: true } });

// 用列构造助手快速拼一列只读数字 + 激活输入
const col = colInputF2('amount', '金额');
```

## 注意事项

- **两份注册表都是按名字缓存的单例**：`useObjFields()` / `useObjColumns()` 不传名字时取
  默认集，二次调用返回同一实例，对它 `setField` 会全局生效。
- **简写键解析规则**：`!` 只读、`*` 必选、`~` 禁用、`=标题`、`/字段名`、`>提示`、`:列起/列跨`、
  `:列起/列跨:行跨`；`===` / `---` 连续符识别为分隔字段。
- **`init_ti_std_columns` 里 `#INPUT-DATETIME` 用的是 `comConf: 'DATETIME'`**（其余列多用
  `$DT`），引用时按源码为准。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/field/use-obj-fields.ts` —— 字段集单例与 `fldXxx` 助手。
  - `src/lib/_features/field/use-obj-columns.ts` —— 列集单例与 `colXxx` 助手。
  - `src/lib/_features/field/init-ti-std-fields.ts`、`init-ti-std-columns.ts` —— 预置注册。
  - `src/lib/_features/field/index.ts` —— 统一导出。
- **相关文档**
  - 引导调用点：[快速上手](../../00.start-here/01-getting-started.md)。
  - 字段变更流水线：[use-form-field-change](./use-form-field-change.md)。
  - 字段到控件的选择：[use-field-com](./use-field-com.md)。
