---
title: use-data-validate 整行数据校验
keywords: [hook, useDataValidate, use-data-validate, validateChange, validateData, ValidateOptions, okAs, minLen, maxLen, required]
status: draft
---

# `use-data-validate` 整行数据校验

## 解决什么问题

提交一个表单对象前，要逐字段检查：必选是不是空、长度是否在 `minLen/maxLen` 内、自定义
校验规则过不过；并且要支持两种时机——只校验本次改动的几个键（输入过程中），或一次性校验
整行（提交前）。校验通过时怎么记结果也有讲究：增量场景下错误修好后要把旧错误抹掉，全量
场景下又不想给每个字段都写一条 `ok`。

`useDataValidate` 把"字段引用列表 → 编译成可校验字段 → 按改动/按整行执行校验"固定下来，
输出一个 `{ [uniqKey]: FieldStatus | null }` 的状态表。

## 输入 Props

```ts
useDataValidate(props: DataValidationProps)
```

- **`props: DataValidationProps`**：
  - **`fields?: ValidatableFieldRefer[]`** —— 待校验字段引用列表；元素可为字符串键（从
    标准字段集取定义）、`[键, 覆盖 | 转换函数]` 元组或完整 `ValidatableField` 对象。编译细节见
    [validate 概述](./validate-overview.md)。

校验执行时的选项（调用 `validateChange / validateData` 时传）：

- **`checkRequired?: boolean`** —— 是否检查必选字段为 nil。
- **`okAs?: 'null' | 'ignore' | 'ok'`** —— 校验通过时如何写状态：`'null'` 写 `null`（增量
  场景，修好即抹掉旧错）、`'ignore'` 不写任何值、`'ok'` 写 `{ type: 'ok' }`。
- **`checkHidden?: boolean`** —— 隐藏字段是否也校验，默认 `false`。
- **`checkDisabled?: boolean`** —— 禁用字段是否也校验，默认 `false`。

## 返回值 API

```ts
const dv = useDataValidate({ fields });
```

- **`_field_list: DataValidatableField[]`** —— 编译后的可校验字段列表。
- **`_field_map: Map<string, DataValidatableField>`** —— `uniqKey → 字段` 映射。
- **`validateChange(delta, data, options?)`** —— 只校验 `delta` 里出现的键；返回
  `Record<string, FieldStatus | null>`。
- **`validateData(data, options?)`** —— 遍历全部 `_field_list`，从整行数据取值后校验；
  返回同一形态的状态表。
- **`toCSV()`** —— 把字段名/标题/原始校验配置导成 CSV 文本，便于调试。

校验规则的执行顺序（每个字段）：跳过禁用/隐藏（按选项）→ nil/空串时只做必选检查 →
`minLen/maxLen` 长度检查 → `field.validate`（由 [use-field-validate](./use-field-validate.md)
编译出的校验器组）。错误时写入 `{ type: 'error', text: ... }`，文案形如
`Field '<标题>' is required` / `... too short, it should be at least N characters` /
`... Invalid: <自定义 message>`。

## 配合使用

- **与字段集**：字符串键形式的 `fields` 通过 `useObjFields()` 取定义，见
  [field 概述](../field/field-overview.md)。
- **与校验器编译**：`field.validate` 由 [use-field-validate](./use-field-validate.md) 的
  `buildFieldValidatorGroup` 生成（支持正则、`#字典名`、`@全局规则名`、函数、对象）。
- **与结果收集**：[use-validate-results](./use-validate-results.md) 按数据行 `id` 存放本
  hook 产出的状态表。

典型调用片段：

```ts
const dv = useDataValidate({ fields: ['*name', ['age', { minLen: 1 }]] });

// 输入过程中：只校验改动的键，修好即抹错
const st = await dv.validateChange({ age: 40 }, rowData, { checkRequired: true, okAs: 'null' });

// 提交前：整行全量校验
const all = await dv.validateData(rowData, { checkRequired: true });
```

## 注意事项

- **隐藏/禁用字段默认跳过**：要校验它们必须显式传 `checkHidden / checkDisabled`。
- **`okAs` 默认不是 `'ok'`**：不传时通过的字段不写状态，调用方不要假设表里全是条目。
- **错误文案当前是英文模板**，仅用 `field.title` 插值；多语言化需要上层自行处理。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/validate/use-data-validate.ts` —— 本 hook 实现。
- **相关文档**
  - 校验规则编译与全局规则注册：[use-field-validate](./use-field-validate.md)。
  - 按行收集校验结果：[use-validate-results](./use-validate-results.md)。
  - 字段引用如何编译：[validate 概述](./validate-overview.md)。
