---
title: use-field-validate 校验规则编译
keywords: [buildFieldValidator, buildFieldValidatorGroup, addGlobalValidation, getGlobalValidation, removeGlobalValidation, FieldValidation, Match, 字典校验, 全局校验规则]
status: draft
---

# `use-field-validate` 校验规则编译

> 本文件虽以 `use-field-validate.ts` 命名，但**没有导出 `useFieldValidate` hook**；它导出的
> 是一组"把字段校验规则编译成校验函数"的纯函数与一个全局规则注册表。按模块组文档写。

## 解决什么问题

字段定义里的 `validation` 字段可以写得很灵活：正则、字符串、`#字典名`、`@全局规则名`、
对象 `{ test, not, message }` 或自定义函数。要能执行这些写法，需要一个编译器把它们统一
收敛成 `(value, field, data) => Promise<ValidateResult>` 的异步校验函数；多个规则时再串成
一个"遇错即停"的校验器组。

另外业务侧常想共享一批通用规则（如手机号、邮箱），不必每个字段都重写——因此本模块还提供
一个按名字存取的全局规则注册表。

## 对外导出

- **`buildFieldValidator(validation?)`** —— 把单条规则编译成异步校验函数，返回
  `AyncFieldValidator | FieldValidator | undefined`。规则形态：
  - **`'#xxx'`** —— 按 `xxx` 查字典（`Dicts.checkDict`），值能取到项则 `OK`，否则
    `VALUE_INVALID`；
  - **`'@xxx'`** —— 从全局注册表取 `xxx` 对应的规则再编译；
  - **正则 / 字符串** —— 用 `Match.parse(...)` 编译成匹配器，通过返回 `{ type: 'OK' }`，
    否则 `{ type: 'VALUE_INVALID' }`；
  - **函数** —— 原样返回；
  - **对象 `{ test, not?, message? }`** —— `test` 走 `Match.parse`，`not` 取反，失败带 `message`。
- **`buildFieldValidatorGroup(validations?)`** —— 接收单条或数组规则，逐条编译后串成一个
  异步校验器：顺序执行，遇到第一个 `type != 'OK'` 就返回该结果，全部通过返回 `{ type: 'OK' }`。
- **`addGlobalValidation(name, validation)` / `getGlobalValidation(name)` / `removeGlobalValidation(name)`**
  —— 全局规则注册表（模块级 `Map`）的增删查；重名时 `add` 会 `console.warn` 并覆盖。

## 模块职责分组

```text
字段定义.validation
        │
        ▼
buildFieldValidator ──┬── '#dict'  → 字典查项
                      ├── '@name'  → 全局注册表
                      ├── RegExp/Str → Match.parse
                      ├── function   → 原样
                      └── object     → { test, not, message }
        │
        ▼
buildFieldValidatorGroup  → 遇错即停的校验器组
        │
        ▼
被 _build_validatable_field 挂到字段.validate，由 useDataValidate 执行
```

## 配合使用

- **被 [validate 概述](./validate-overview.md) 的 `_build_validatable_field` 调用**：字段的
  `validation` 配置经 `buildFieldValidatorGroup` 编译后存到 `DataValidatableField.validate`。
- **被 [use-data-validate](./use-data-validate.md) 执行**：`validateChange / validateData`
  在长度检查之后调用 `field.validate`。
- **业务共享规则**：在引导阶段 `addGlobalValidation('phone', /^1\d{10}$/)`，之后字段里
  写 `validation: '@phone'` 即可复用。

典型调用片段：

```ts
// 注册一条全局规则
addGlobalValidation('email', { test: /\S+@\S+\.\S+/, message: '邮箱格式不正确' });

// 编译字段规则
const validate = buildFieldValidatorGroup(['@email', '#user-dict']);
const re = await validate('a@b.com', field, data); // => { type: 'OK' }
```

## 注意事项

- **全局注册表是模块级单例**：`addGlobalValidation` 跨页面共享，重名覆盖且只 warn。
- **`#字典名` 走 `Dicts.checkDict`**：字典不存在会抛错，不是静默跳过。
- **本模块无 hook 形态**：不读 Props、不返回响应式 API，直接同步调用即可。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/validate/use-field-validate.ts` —— 本模块实现（无 hook）。
- **相关文档**
  - 校验执行入口：[use-data-validate](./use-data-validate.md)。
  - 字段编译流程：[validate 概述](./validate-overview.md)。
  - 字典模型：[字典模型](../../10.concepts/06-dict-model.md)。
