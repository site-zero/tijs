---
title: use-value-input 输入值规整
keywords: [hook, useValueInput, use-value-input, 输入规整, tidyValue, translateValue, 字典校验, renderHint, 选项, 处理器管线]
status: draft
---

# `use-value-input` 输入值规整

## 解决什么问题

带选项的输入控件（下拉、可输入单选、多选等）在值流转时要串联好几步处理：先执行外部
自定义前置处理，再做去空白、命名风格转换，若要求"必须来自选项"还要走字典查项校验，最后
执行后置自定义处理；失焦或选中后，又要把存储的值翻译成展示文本与图标。

这些步骤如果写在每个控件里会高度重复，且字典查询需要处理**上一次请求未完成的取消**。
`useValueInput` 把这条处理管线固定下来，并在 `useOptions` 构建的字典之上叠加值规整与
值翻译能力。它被 `useValueBox` 聚合复用，输入类控件经由 ValueBox 特性间接使用。

## 输入 Props

`ValueInputProps` 继承 `OptionsProps`，先具备字典构建能力（`options`、`dictVars`、
`mustInOptions`、`getOptionIcon / Text / Tip / Value`，规则见
[字典模型](../../10.concepts/06-dict-model.md)），再追加下列字段：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `valueCase` | `StrCaseMode` | 输入后做命名风格转换（`camel/snake/kebab/…`） |
| `trimed` | `boolean` | 是否去掉前后空白 |
| `beforeValueProcessors` | `FuncA1 \| FuncA1[]` | 内置管线之前执行的自定义处理器 |
| `afterValueProcessors` | `FuncA1 \| FuncA1[]` | 内置管线之后执行的自定义处理器 |
| `boxVars` | `Vars` | `renderHint` 模板的变量上下文 |
| `renderHint` | `string \| (vars: Vars) => string` | 编译查询提示串的模板或函数 |

处理器统一被 `wrapPromiseFunc` 包成异步函数，因此前置/后置处理器既可以是同步函数，
也可以是 `Promise` 函数。

## 返回值 API

```ts
const feature = useValueInput(props);
```

返回 `ValueInputFeature`（在 `OptionsFeature` 的 `dict` 之上扩展）：

- **`dict?: TiDict`** —— 由 `useOptions` 构建出的字典实例；无 `options` 时为 `undefined`。
- **`cookValHint(val?)`** —— 按 `renderHint` 生成传给字典查询的提示串；上下文为
  `{ ...boxVars, hint: 输入内容 }`，`hint` 会覆盖 `boxVars` 中的同名键。
- **`tidyValue(val, mode?)`** —— 异步执行值规整管线，见下文。
- **`translateValue(val)`** —— 异步把存储值翻译成标准字典项；字典不存在时原样返回值。

### 规整管线 `tidyValue`

处理器按固定顺序分成四段，`mode` 可选择只执行其中几段，缺省四段全部执行：

```text
head  →  main  →  dict  →  tail
前置自定义  去空白/命名转换  字典查项校验  后置自定义
```

- **`head`**：`beforeValueProcessors`。
- **`main`**：`trimed` 去空白；`valueCase` 命名风格转换。
- **`dict`**：`mustInOptions` 且存在字典时，先用 `cookValHint` 加工提示串，
  `AbortController` 取消上一次查询，再 `dict.getStdItem(v, signal)` 取标准项，
  返回其 `value`；未命中则保留原输入。
- **`tail`**：`afterValueProcessors`。

`mode` 取值为 `"head" | "main" | "dict" | "tail"` 的数组；任一段抛错都会
`reject` 并打印错误。

### 值翻译 `translateValue`

- 存在字典时：`dict.getItem(val)` 取原始项，`dict.toStdItem` 转标准项；
  若声明了 `getOptionIcon`，再按路径或转换函数覆盖 `icon`。
- 字典未命中：`mustInOptions` 开启时解析为 `undefined`，否则原样返回 `val`。
- 无字典时直接返回 `val`。

## 配合使用

- **与 `useOptions`**：本 hook 内部先调用 `useOptions(props)` 得到 `dict`，不需要控件
  再重复构建字典。
- **与字典模型**：`options` 的三种形态（静态数组、`DictSetup`、字典名）与 `dictVars`
  动态上下文均由字典模型统一解析。
- **与 `useValueBox`**：`useValueBox` 在本 hook 之上再叠加占位文本、前后缀、只读、格式化
  等能力，是输入类控件直接对接的特性层。

典型调用形态（控件 `setup` 内，建议放入 `computed` 以获得响应性）：

```ts
const input = useValueInput(props);

// 输入规整：执行完整管线
const tidy = await input.tidyValue(rawInput);

// 展示翻译：把存储值换成标准项或原文
const item = await input.translateValue(storedValue);
```

## 注意事项

- **查询取消**：`dict` 段每次执行都会 abort 上一次未完成的 `AbortController`，避免旧查询
  结果覆盖新输入。
- **`renderHint` 字符串走 `Tmpl.parse`**；函数形态则直接作为模板渲染器。
- **不要在 `boxVars` 里使用 `hint` 键**：运行时会被当前输入内容覆盖。
- **`mustInOptions` 只影响 `translateValue` 未命中分支**；`tidyValue` 的字典段未命中时
  保留原值，不抛错。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/use-value-input.ts` —— 本 hook 实现。
  - `src/lib/_features/use-options.ts` —— 字典构建基础 `useOptions`。
  - `src/lib/_features/use-value-box.ts` —— 聚合本 hook 的 ValueBox 特性。
- **相关文档**
  - 字典数据模型与 `OptionsProps` 字段：[字典模型](../../10.concepts/06-dict-model.md)。
  - `valueCase` 命名转换模式：[10-str](../../20.core-utils/10-str.md)。
