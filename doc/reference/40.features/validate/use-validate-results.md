---
title: use-validate-results 校验结果按行存储
keywords: [hook, useValidateResults, use-validate-results, getVarifyResult, hasVarifyError, validateDelta, FieldValidateResult, 按行校验, 表格校验]
status: draft
---

# `use-validate-results` 校验结果按行存储

## 解决什么问题

表格、列表这类场景里，校验是按"每一行数据"独立进行的：第 1 行的名字错了、第 2 行的年龄
错了，错误要分别挂到各自行上，渲染时在对应行/单元格出红。提交前还要能快速判断"有没有
任何一行存在错误"。

[use-data-validate](./use-data-validate.md) 只负责算出某一行的状态表，`useValidateResults`
负责把它按行 `id` 存进一个响应式 `ref`，并提供取、判错、增删改结果的一整套方法。

## 输入 Props

```ts
useValidateResults(options: ValidateResultsOptions)
```

- **`options: ValidateResultsOptions`**：
  - **`getValidation: () => DataValidation | undefined`** —— 返回 [use-data-validate](./use-data-validate.md)
    编译好的校验器（每次调用时取，便于懒加载）。
  - **`getId: (item: Vars) => string | null | undefined`** —— 从一行数据取出主键 id；
    返回空则该行不参与存储。

## 返回值 API

```ts
const vr = useValidateResults({ getValidation, getId });
```

- **`_results: Ref<Record<string, FieldValidateResult>>`** —— 响应式结果表，键为行 id。
- **`getVarifyResult(id?)`** —— 取某行的字段状态表；`id` 为空返回 `{}`。
- **`hasVarifyError(id?)`** —— 指定行是否有错；不传 `id` 时遍历全部行，任一行有错即返回 `true`。
- **`validate(item?)`** —— 对整行数据做全量校验（`validateData`，固定 `checkRequired: true`），
  先清空该行旧结果再写入；`item` 空或取不到 id 时直接返回。
- **`validateDelta(item, delta, options?)`** —— 对改动做增量校验（`validateChange`，默认
  `okAs: 'null'`），返回本次状态表；先清空该行再写入。
- **`setVarifyResult(id, result)`** —— 整行覆盖写入。
- **`assignVarifyResult(id, result)`** —— 合并写入（不删旧键）。
- **`updateVarifyResult(id, result, prefix?)`** —— 按条目写入：状态为 `null` 的键删除，
  否则写入；`prefix` 可给字段名加层级前缀。
- **`setVarifyField(id, name, status)`** —— 写单个字段；`status.type === 'ok'` 时删除该键。
- **`clearVarifyResult(id, name?)`** —— 清空整行（不传 `name`）或删指定字段。

## 配合使用

- **与 `useDataValidate`**：`getValidation` 返回的对象必须来自 [use-data-validate](./use-data-validate.md)；
  本 hook 不做字段编译，只调度与存储。
- **与表格行**：行编辑控件在值变化时调 `validateDelta(row, delta)`，提交前对每行调 `validate(row)`，
  渲染时用 `getVarifyResult(rowId)[fieldName]` 决定是否出错误样式。

典型调用片段：

```ts
const dv = useDataValidate({ fields });
const vr = useValidateResults({
  getValidation: () => dv,
  getId: (row) => row.id,
});

// 单元格改了值：增量校验这一行
await vr.validateDelta(row, { age: 40 });

// 提交前看有没有任何一行有错
if (vr.hasVarifyError()) return;
```

## 注意事项

- **`status.type === 'ok'` 的键会被删除**：存储里只留错误，`getVarifyResult` 返回的表天然
  不含通过项；判错用 `hasVarifyError`，不要靠数键。
- **`validate / validateDelta` 都会先清空该行旧结果**，再写入新结果，不会与旧错误合并；
  要合并用 `assignVarifyResult`。
- **`getId` 返回空的行不会被存储**，这类行的校验结果直接丢弃。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/validate/use-validate-results.ts` —— 本 hook 实现。
- **相关文档**
  - 校验执行入口：[use-data-validate](./use-data-validate.md)。
  - 错误结果类型与 `has_validate_error`：[validate 概述](./validate-overview.md)。
