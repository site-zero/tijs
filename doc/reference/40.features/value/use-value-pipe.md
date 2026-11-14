---
title: use-value-pipe 值处理管道
keywords: [hook, useValuePipe, use-value-pipe, 管道, pipe, 处理器, $TRIM, $CASE, valuePiping, pipeProcessers, 格式化]
status: draft
---

# `use-value-pipe` 值处理管道

## 解决什么问题

把一个值显示出来之前，常常要按固定工序过几道"加工"：去前后空白、转命名风格、数字补
小数位、日期格式化、敏感信息打码、超长文本省略号……每道工序都是一个小函数，工序的
顺序又随场景变化。如果把这些写死在组件里，加一道工序就要改一处组件代码。

`useValuePipe` 把这件事抽象成一条**命名处理器管道**：预置一批带名字的处理器
（`$TRIM`、`$F2`、`$DT`……），用一段像 `"$TRIM | $F2"` 这样的声明指定执行顺序，
再允许你用 `pipeProcessers` 注入自己的命名处理器。它被 `TiLabel`、`TiInputCombo`、
`TiInput`（box3）和应用内提示框（`lib-app-prompt`）用来做展示前的文本加工。

## 输入 Props

`ValuePipeProps`（声明于 `use-value-pipe.ts`）：

- **`valueCase?: StrCaseMode`** —— 声明后把 `$CASE` 处理器替换为对应命名风格转换函数（`Str.getCaseFunc`）。
- **`trimed?: boolean`** —— 按注释约定对应 `$TRIM` 开关；**当前实现未据此开关**：`$TRIM` 永远注册在默认管道里（见注意事项）。
- **`valuePiping?: string | string[]`** —— 管道工序声明。字符串用 `|` 分隔处理器名；数组则逐元素取名。缺省 `["$TRIM", "$CASE"]`。名字在处理器表里不存在时自动跳过，不报错。
- **`pipeContext?: Vars`** —— 传给每个处理器的公共上下文，缺省 `{}`；像 `$DT` 会从这里读 `dateFormat`、`timezone`。
- **`pipeProcessers?: Record<string, ValueProcesser>`** —— 自定义处理器 `{ $NAME: (v, ctx) => any }`，会覆盖同名默认处理器。

内置处理器（`val-pipes/dft-val-pipes.ts`）：

| 名字 | 作用 |
| --- | --- |
| `$TRIM` | `_.trim(v)` 去前后空白 |
| `$CASE` | 由 `valueCase` 注入命名风格转换 |
| `$I3`/`$F1`…`$F6` | 银行数字格式，小数位 0~6 位 |
| `$DT` / `$DATE` | 日期时间 / 日期格式化，读 `pipeContext.dateFormat` 与 `timezone` |
| `$SIZE_TEXT` | 字节数转人类可读尺寸 |
| `$TIME_TEXT` | 时长转文本 |
| `$DESENS` | 敏感信息打码（按长度夹取 3~6 个 `*`） |
| `$ELLIPSIS` | 超长截断省略号，`at` 支持 `head/center/end` |
| `$MOD_OCT` / `$MOD_STR` | 对象权限模式数转八进制/文本 |

## 返回值 API

```ts
const pipe = useValuePipe(props);
const text = pipe(rawValue);
```

`useValuePipe` **返回的是一个处理函数本身**（类型 `ValuePipeApi = (val: any) => any`），
不是 feature 对象：

- **`(val) => 加工后的值`** —— 按 `valuePiping` 声明的顺序，把 `val` 逐道喂给处理器，每道都带上 `pipeContext`；全部同步执行，返回最终值。

处理器表与工序数组都是 `computed` 派生的，因此 Props 变化后再次调用 `pipe(val)` 会拿到新结果——建议在 `computed` 里调用本 hook 以保持整条链路响应式。

## 配合使用

- **与 `useDisplayText`**：`TiLabel` 的典型链路是"先 `useDisplayText` 从字典项挑出文本，再过 `useValuePipe` 加工"。
- **与字典**：`$DT`/`$DATE` 这类处理器加工的往往就是字典翻译出来的值。

典型调用片段（`TiLabel.vue` 风格）：

```ts
// 建议放进 computed，跟随 props 重建
const _pipe = computed(() => useValuePipe(props));

// 把原始值按声明的工序加工成展示文本
const displayText = computed(() => _pipe.value(rawValue));

// 自定义管道：去空白后打码，再按 20 字符居中省略
const secret = useValuePipe({
  valuePiping: ['$TRIM', '$DESENS', '$ELLIPSIS'],
  pipeContext: { maxLen: 20, at: 'center' },
});
```

## 注意事项

- **`trimed` 目前是"声明了但未接线"**：默认处理器表里 `$TRIM` 无条件注册，`valuePiping` 又默认包含 `$TRIM`，所以值总是会被 trim；想用 `trimed: false` 关掉，需要在 `valuePiping` 里显式重排工序。
- **处理器不存在就跳过**：写错名字（如 `$F7`）不会报错，只是该工序静默消失，排查时先核对管道声明与处理器表。
- **管道全程同步**：与 `useValueInput` 的异步规整管线不同，本 hook 不做字典查询、不处理取消。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/use-value-pipe.ts` —— 本 hook 实现。
  - `src/lib/_features/val-pipes/dft-val-pipes.ts` —— 内置处理器清单。
- **相关文档**
  - 从字典项里挑显示文本：[use-display-text](./use-display-text.md)。
  - 输入侧异步规整管线：[use-value-input](./use-value-input.md)。
  - 消费方 `TiLabel`：[ti-label](../../30.components/tile/ti-label.md)。
