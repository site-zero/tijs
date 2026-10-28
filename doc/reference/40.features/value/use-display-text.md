---
title: use-display-text 显示文本取值
keywords: [hook, useDisplayText, use-display-text, getDisplayText, useRawValue, displayText, 选项文本, PickDisplayText, text|value]
status: draft
---

# `use-display-text` 显示文本取值

## 解决什么问题

字典翻译出来的标准项里同时有 `text`、`value`、`tip` 好几个字段：显示时用哪个？
默认当然是 `text`，拿不到再退到 `value`；但有些场景想优先显示 `tip`，或者反过来——
直接显示值。这个"按优先级从选项对象里挑一个字段当显示文本"的小决定，在
`TiInputCombo`、`TiInput`（box3）、`TiLabel` 里都要用到，于是抽成一个 hook。

`useDisplayText` 读取 `getDisplayText` / `useRawValue` 两个 Props，编译出一个
`(item) => string` 取值函数：按你声明的字段优先级，返回第一个非空字段。

## 输入 Props

`DisplayTextProps`（声明于 `use-display-text.ts`）：

- **`getDisplayText?: string`** —— 取值优先级串，用 `|` 分隔字段名，如 `"text|value"`、`"tip|value|text"`。未声明时按 `useRawValue` 决定默认值。
- **`useRawValue?: boolean`** —— 为 `true` 时等价于把 `getDisplayText` 设为 `"value"`，直接显示值本身。

解析规则：`getDisplayText` 缺省时，`useRawValue` 为真取 `"value"`，否则取 `"text|value"`。

## 返回值 API

```ts
const pick = useDisplayText(props);
const text = pick(optionItem);
```

返回 **`PickDisplayText = (item: Vars) => string`**：

- 按 `|` 拆分出的键顺序逐个取 `item[key]`，遇到第一个非 `null/undefined` 的字段就返回；全部为空返回 `""`。

取值函数在 `setup` 时一次性编译完成；Props 变化后需重建（消费方均把它放在 `computed` 里）。

## 配合使用

- **与字典翻译结果**：输入是字典标准项经 `toOptionItem()` 后的对象，`text/value/tip/icon` 字段齐备，见 [字典模型](../../10.concepts/06-dict-model.md)。
- **与 `useValueBox` 的 `getDisplayText`**：同名 Props 在 ValueBox 里是 `string | 函数` 双形态，本 hook 只承担其中的字符串优先级形态。
- **与 `useValuePipe`**：典型链路是先 `useDisplayText` 挑出字段，再 `useValuePipe` 加工。

典型调用片段（`use-label.ts` 风格）：

```ts
// 建议放 computed 以跟随 props 重建
const pickDisplay = computed(() => useDisplayText(props));

// 字典项 → 显示文本（默认取 text，空则退到 value）
const text = pickDisplay.value(stdItem.toOptionItem());

// 想优先显示提示，再退到值、文本
useDisplayText({ getDisplayText: 'tip|value|text' });
```

## 注意事项

- **判空用 `_.isNil`**：空字符串 `""` 会被当作有效值返回，不会继续往下一个键回退。
- **只接受字符串优先级串**：与 `use-value-box` 同名 Props 不同，这里不能传函数；需要函数形态的自定义显示文本请走 ValueBox 层。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/use-display-text.ts` —— 本 hook 实现。
  - `src/lib/input/combo/use-input-combo-api.ts`、`src/lib/input/box3/use-ti-input-box3-api.ts`、`src/lib/tile/label/use-label.ts` —— 消费方。
- **相关文档**
  - ValueBox 层的同名 Props（函数形态）：[use-value-box](./use-value-box.md)。
  - 展示前文本加工：[use-value-pipe](./use-value-pipe.md)。
  - 消费方 `TiLabel`：[ti-label](../../30.components/tile/ti-label.md)。
