---
title: use-format-value 值格式化
keywords: [hook, useFormatValue, use-format-value, format, 格式化, 模板, Tmpl, valueKeyOfVars, vars, FormatValueFeature]
status: draft
---

# `use-format-value` 值格式化

## 解决什么问题

同样的值，不同控件展示口径可能差很多：金额要带货币符号、数量要拼成"共 N 条"、
带选项的盒子要把值和字典项拼成"张三(10001)"。把值渲染成展示文本这件事，需要一个
**统一入口**：既支持写一段字符串模板快速拼接，也允许传函数完全自定义。

`useFormatValue` 就是这个入口：根据 `format` 的形态（缺省 / 字符串模板 / 函数）生成
一个格式化函数，调用方只管喂值、拿文本。它当前被 `useValueBox` 内部用来把翻译后的
文本/字典项加工成最终 `boxInputing`；`TILE`、`EDIT` 类需要统一格式化口径的场景也
以它为底层。

## 输入 Props

`FormatValueProps`（声明于 `use-format-value.ts`）：

- **`vars?: Vars`** —— 格式化上下文：模板里除 `val` 外的占位变量从这里取。
- **`valueKeyOfVars?: string`** —— 把当前值放进上下文时用的键名，缺省 `"val"`；当你的 `vars` 已经有一个 `val` 键不想被覆盖时，换成 `_val2_` 这类名字。
- **`format?: string | ((input: any, item?: Vars) => string)`** —— 格式化器：
  - 字符串：当作 `Tmpl` 模板渲染，上下文为 `{ ...vars, [valueKeyOfVars]: 当前值 }`。
  - 函数：接收 `(input, item)`——`input` 是拼好的上下文对象，`item` 是带选项时的字典标准项，可缺省。

## 返回值 API

```ts
const formatValue = useFormatValue(props);
const text = formatValue(input, item);
```

返回 **`FormatValueFeature = (input: any, item?: Vars) => string`**：

- **`format` 缺省**：走默认格式化器 `nilFormat`，即 `Str.anyToStr(input)`。
- **`format` 为字符串**：走 `strFormat`——`Tmpl.parse(format)` 编译模板，渲染上下文 `{ ...vars, [valueKeyOfVars]: input }`。
- **`format` 为函数**：以 `(上下文, item)` 调用该函数，上下文同样合并 `vars` 与当前值。

hook 还接受第二个可选参数 `options: FormatValueOptions`，可整体替换 `nilFormat` 与
`strFormat` 两个默认实现（类型见源码），一般调用方不需要。

## 配合使用

- **与 `useValueBox`**：ValueBox 在 `doUpdateText` 里用本 hook 的输出决定 `boxInputing`，字典项经第二参数 `item` 传入。
- **与模板引擎**：字符串模板语法来自 `Tmpl.parse`，占位符写法与仓库 `Tmpl` 命名空间一致。

典型调用片段：

```ts
// 1. 模板形态：值会注入到 ${val}
const fmt = useFormatValue({
  format: '共 ${count} 条，当前页 ${val}',
  vars: { count: 128 },
});
fmt(3); // → "共 128 条，当前页 3"

// 2. 上下文键冲突时改名
const fmt2 = useFormatValue({
  format: '${_val2_} / ${total}',
  valueKeyOfVars: '_val2_',
  vars: { val: '旧的业务值', total: 100 },
});

// 3. 函数形态：带选项时可以同时拿到值和标准项
const fmt3 = useFormatValue({
  format: (ctx, item) => item ? `${item.text}（${ctx.val}）` : `${ctx.val}`,
});
```

## 注意事项

- **`vars` 每次渲染都会被深拷贝**：不会污染调用方传入的上下文对象。
- **函数形态的第一个参数是上下文而非裸值**：写自定义函数时从 `input[valueKeyOfVars]`（默认 `input.val`）取当前值，`item` 只在带选项场景下存在。
- **当前无组件直接调用**：仓库内唯一消费方是 `useValueBox`；而 `useValueBox` 本身暂无组件接入（见本篇注意事项的同类现状）。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/use-format-value.ts` —— 本 hook 实现。
  - `src/lib/_features/use-value-box.ts` —— 内部消费方。
- **相关文档**
  - 聚合本 hook 的 ValueBox 特性：[use-value-box](./use-value-box.md)。
  - 字典标准项 `DictItem`：[字典模型](../../10.concepts/06-dict-model.md)。
