---
title: validate 字段编译与类型
keywords: [validate, DataValidatableField, ValidatableFieldRefer, _build_validatable_field, has_validate_error, FieldValidateResult, 校验类型]
status: draft
---

# `validate/` 字段编译与类型

## 解决什么问题

[use-data-validate](./use-data-validate.md)、[use-validate-results](./use-validate-results.md)
与 [use-field-validate](./use-field-validate.md) 三者配合工作，但它们之间要共享一组类型
定义和一道"把 `FieldRefer` 编译成可校验字段"的工序。本目录的另外三个文件就负责这两件事：
类型集中放在 `data-validate-types.ts`，编译工序放在 `build-validation.ts`，`index.ts` 是
统一 barrel。

## 对外导出

- **`_build_validatable_field(fieldSet, fld_ref): DataValidatableField`**
  （`build-validation.ts`，注意带下划线前缀，是内部函数）—— 把一个字段引用编译成可校验
  字段：
  - 字符串键 → `fieldSet.getField(key)` 取标准字段；元组 `[键, 覆盖/转换函数]` → 取字段后
    覆盖或经函数改造；完整对象 → 直接采用。
  - 用 `useVisibility(field, uniqKey)` 计算可见/禁用；`field.readonly` 时强制 `isDisabled`
    返回真。
  - 把 `field.required`（布尔或 `Match` 描述）编译成 `isRequired(data)`。
  - 用 [use-field-validate](./use-field-validate.md) 的 `buildFieldValidatorGroup` 编译
    `field.validation`，并把原始配置存到 `srcValidation` 以便动态展示规则。
- **`data-validate-types.ts`** 导出：
  - **`DataValidationProps`** —— `{ fields?: ValidatableFieldRefer[] }`。
  - **`ValidatableField`** —— `VisibilityProps & ReadonlyProps` 加 `uniqKey?/name/type/title/
    required?/validation?/minLen?/maxLen?`。
  - **`ValidatableFieldInfo`** —— 元组形态 `[键, 覆盖 | (field) => field]`。
  - **`ValidatableFieldRefer`** —— 上述三者的联合类型。
  - **`DataValidatableField`** —— 编译后的字段（`AbstractField & ReadonlyProps &
    VisibilityFeature` + `title/srcValidation/minLen/maxLen`）。
  - **`FieldValidateResult`** —— `Record<string, FieldStatus>`。
  - **`has_validate_error(result?)`** —— 任一状态 `type !== 'ok'` 即判有错。
- **`index.ts`** 统一再导出 `data-validate-types`、`use-data-validate`、`use-field-validate`、
  `use-validate-results`。

## 模块职责分组

```text
ValidatableFieldRefer (字符串键/元组/对象)
        │
        ▼
_build_validatable_field（build-validation.ts）
   ├─ useVisibility → isDisabled / isHidden
   ├─ required (bool | Match) → isRequired(data)
   └─ buildFieldValidatorGroup → field.validate
        │
        ▼
DataValidatableField ──▶ useDataValidate 执行 ──▶ FieldValidateResult
                                              ──▶ useValidateResults 按行存储
```

## 配合使用

- **被 [use-data-validate](./use-data-validate.md) 调用**：它在内部 `for (fld of props.fields)`
  循环里逐条调用 `_build_validatable_field`。
- **被 [use-validate-results](./use-validate-results.md) 使用**：结果表类型
  `FieldValidateResult` 与判错函数 `has_validate_error` 来自本模块。
- **与字段集**：编译依赖 `useObjFields()` 返回的字段集，见 [field 概述](../field/field-overview.md)。

## 注意事项

- **`_build_validatable_field` 是内部函数**（下划线前缀），barrel 没有导出它，外部应通过
  `useDataValidate` 间接使用。
- **`readonly` 字段会被强制视为禁用**：校验时按禁用处理（默认跳过，除非显式 `checkDisabled`）。
- **`srcValidation` 保留原始校验配置**，供 UI 动态展示规则文案用，不参与执行。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/validate/build-validation.ts` —— 字段编译工序。
  - `src/lib/_features/validate/data-validate-types.ts` —— 类型与判错函数。
  - `src/lib/_features/validate/index.ts` —— barrel。
- **相关文档**
  - 校验执行：[use-data-validate](./use-data-validate.md)。
  - 规则编译：[use-field-validate](./use-field-validate.md)。
  - 结果存储：[use-validate-results](./use-validate-results.md)。
