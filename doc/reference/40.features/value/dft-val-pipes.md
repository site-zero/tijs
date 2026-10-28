---
title: dft-val-pipes 默认值管道集
keywords: [getDefaultValPipes, dft-val-pipes, 默认管道, ValueProcesser, $TRIM, $F2, $DT, $DESENS, $ELLIPSIS, $MOD_OCT, valuePiping]
status: draft
---

# `dft-val-pipes` 默认值管道集

## 解决什么问题

[use-value-pipe](./use-value-pipe.md) 用一段 `"$TRIM | $F2"` 式的声明驱动值加工，但它自己
不内置任何处理器——处理器表来自一个独立的默认管道集模块。`dft-val-pipes.ts` 就是这份
"开箱即用"的命名处理器清单：去空白、银行数字格式、日期格式化、字节尺寸、敏感信息打码、
超长省略、权限模式转换……`useValuePipe` 在构建处理器表时先把这份默认表整体并入，再叠加
`$CASE`（由 `valueCase` 注入）与用户 `pipeProcessers` 的自定义处理器。

## 对外导出

- **`getDefaultValPipes(): Record<string, ValueProcesser>`** —— 返回一份全新的默认处理器
  映射（每次调用都新建对象，可安全修改而不污染他人）。处理器签名统一为
  `(val: any, pipeContext?: Vars) => any`。

内置处理器清单（与 [use-value-pipe](./use-value-pipe.md) 的处理器表同一份实现）：

| 名字 | 作用 |
| --- | --- |
| `$TRIM` | `_.trim(v)` 去前后空白 |
| `$I3` | 银行数字格式，0 位小数 |
| `$F1` ~ `$F6` | 银行数字格式，1~6 位小数（`Bank.toBankText`） |
| `$DT` | 日期时间格式化，读 `pipeContext.dateFormat`（缺省环境变量 `DFT_DATETIME_FORMAT`）与 `timezone` |
| `$DATE` | 日期格式化，缺省格式读环境变量 `DFT_DATE_FORMAT` |
| `$SIZE_TEXT` | 字节数转人类可读尺寸（`Str.sizeText`） |
| `$TIME_TEXT` | 时长转文本（`DateTime.timeText`） |
| `$DESENS` | 敏感信息打码：按值长度夹取 3~6 个 `*` |
| `$ELLIPSIS` | 超长截断省略号；读 `pipeContext.maxLen`（默认 10）、`ellipsis`（默认 `...`）、`at`（`head/center/end`） |
| `$MOD_OCT` | 对象权限模式数 → 八进制文本（`Alg.parseObjMode`） |
| `$MOD_STR` | 对象权限模式数 → 模式文本 |

> `$CASE` **不在本模块**：它由 `useValuePipe` 根据 Props `valueCase` 动态注入，不在默认表里。

## 模块职责分组

```text
getDefaultValPipes() ──返回默认处理器表──▶ useValuePipe 构建 _pp_map
                                              │ 叠加 $CASE（valueCase 注入）
                                              │ 叠加 pipeProcessers（用户自定义，同名覆盖）
                                              ▼
                                          按 valuePiping 顺序执行
```

## 配合使用

- **被 [use-value-pipe](./use-value-pipe.md) 调用**：`useValuePipe` 内部
  `_.forEach(getDefaultValPipes(), (fn, k) => map.set(k, fn))` 并入默认表。
- **被字段/列配置引用**：`init_ti_std_fields` 等标准字段的 `comConf.valuePiping`（如
  `"$DT"`、`"$F2"`、`"$SIZE_TEXT"`）与 `pipeProcessers` 依赖本表提供的名字，见
  [field 概述](../field/field-overview.md)。

典型调用片段（一般不直接用，了解合并顺序即可）：

```ts
// useValuePipe 内部等价逻辑
const map = new Map<string, ValueProcesser>();
Object.entries(getDefaultValPipes()).forEach(([k, fn]) => map.set(k, fn));
map.set('$CASE', Str.getCaseFunc(props.valueCase)); // 注入命名风格
Object.entries(props.pipeProcessers ?? {}).forEach(([k, fn]) => map.set(k, fn)); // 自定义覆盖
```

## 注意事项

- **同名自定义处理器覆盖默认**：`pipeProcessers` 后注入，可整体替换 `$DT` 等默认实现。
- **`$ELLIPSIS` / `$DESENS` 的选项走 `pipeContext`**，不是 Props；要调 `maxLen` 需在
  `pipeContext` 里传。
- **`$DT` / `$DATE` 的缺省格式来自环境变量**（`getEnv(ENV_KEYS.DFT_DATETIME_FORMAT / DFT_DATE_FORMAT)`），
  业务可通过环境配置统一调整。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/val-pipes/dft-val-pipes.ts` —— 默认处理器清单实现。
- **相关文档**
  - 管道驱动 hook：[use-value-pipe](./use-value-pipe.md)。
  - 标准字段如何引用管道名：[field 概述](../field/field-overview.md)。
