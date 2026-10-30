---
title: use-value-box 值显示框聚合
keywords: [hook, useValueBox, use-value-box, ValueBox, 输入框, 前后缀, 值翻译, doUpdateValue, doChangeValue, autoPrefixIcon]
status: draft
---

# `use-value-box` 值显示框聚合

## 解决什么问题

一个"既能显示值、又能接收输入"的盒子，除了值本身，还要同时照顾一整组横切能力：
只读判断、占位文本、前后缀图标与文字、值规整与字典翻译、显示格式化。这些能力在
[共享 Props](../../10.concepts/02-common-props.md) 与 [use-value-input](./use-value-input.md)
里各自已经有独立 hook，但**怎么把它们编排成一个"逻辑值 ↔ 显示文本"双向同步的整体**，
每个输入控件重写一遍必然走样。

`useValueBox` 就是这层编排：它把 `useValueInput`（字典 + 规整 + 翻译）、
`useFormatValue`（显示格式化）、`usePrefixSuffix`（前后缀）组装在一起，并把同步规则
固定下来——逻辑值 `state.boxValue` 变了就重算 `state.boxInputing`；用户输入了内容就走
规整管线再 `emit('change')`；聚焦时直接显示原始值，失焦时显示翻译/格式化后的文本。

> **现状提示**：当前 `src/` 内没有组件直接调用 `useValueBox`（`_features/index.ts`
> 也标注它"可能要移除"）。现行输入盒子走的是 `input/box3`（`TiInput`）自有的
> `use-ti-input-box3-api`。本篇描述的是这套聚合设计本身。

## 输入 Props

`ValueBoxProps<T>` 是多组 Props 的交叉叠加：

```text
ValueBoxProps = CommonProps
              & ValueInputProps        // 字典、规整、翻译，见 use-value-input
              & FormatValueProps       // format / vars / valueKeyOfVars
              & ReadonlyProps          // readonly，见共享 Props
              & PlaceholderProps       // placeholder，见共享 Props
              & PrefixSuffixProps      // 前后缀，见共享 Props
              & { …下列追加字段… }
```

追加字段（类型声明于 `use-value-box.ts`）：

- **`value?: T`** —— 盒子的初始逻辑值；未声明时用 `tiGetDefaultComPropValue(COM_TYPE, 'value')` 兜底。
- **`autoSelect?: boolean`** —— 类型已声明，当前版本未接线，保留备用。
- **`prefixIconForClean?: boolean`** —— 前缀图标作为"清除"按钮：非只读时默认补 `zmdi-close` 并可点击。
- **`suffixIconForCopy?: boolean`** —— 后缀图标作为"复制"按钮：非只读时默认补 `zmdi-copy` 并可点击。
- **`autoPrefixIcon?: boolean`** —— 有字典且翻译出 `boxIcon` 时，自动把它接到前缀图标上。
- **`useRawValue?: boolean`** —— 值命中选项时直接显示 `item.value`，而非 `item.text`。
- **`getDisplayText?: string | ((item: Vars) => string)`** —— 指定显示文本的取值键（如 `"tip|value|text"`，按 `|` 依次回退）或自定义函数；指定后 `useRawValue` 不生效。
- **`useTextWhenFocus?: boolean`** —— 开启后即使聚焦、可编辑，输入框也保持显示翻译后的文本（如 `TiInputCode` 的 `[text][tip]` 模式）。
- **`canInput?: boolean`** —— 输入框是否允许用户键入。
- **`showCleanOption?: boolean`** —— 类型已声明，当前版本本 hook 未消费，由选项列表侧的 hook（见 [use-options-filter](../options/use-options-filter.md)）实际使用。

## 返回值 API

```ts
const box = useValueBox(state, props, options);
```

入参除 `props` 外还有：

- **`state: ValueBoxState<string>`** —— 组件持有的响应式状态，hook 直接读写：`boxValue`（逻辑值）、`boxInputing`（输入框文本）、`boxFocused`、`boxIcon`/`boxTip`/`boxItem`（字典翻译结果）、`boxErrMsg`、键盘修饰键等。
- **`options: ValueBoxOptions`** —— `{ emit, getBoxElement, COM_TYPE }`；`getBoxElement` 返回顶层元素，复制成功闪烁与提示框定位都以它为参照。

返回 `ValueBoxFeature`，在 `PrefixSuffixFeature` 与 `ValueInputFeature`（即
`dict / tidyValue / translateValue / cookValHint`）之上追加：

- **`doUpdateValue(val)`** —— 外部初值变化时调用：写入 `state.boxValue` 并重算显示文本（异步）。
- **`doChangeValue(val, tidyModes?)`** —— 用户键入后调用：只读时直接忽略；否则按 `tidyValue` 规整后 `emit('change', 规整值)`。
- **`doUpdateText()`** —— 按 `state.boxValue` 重算 `state.boxInputing`（异步）；`doUpdateValue` 内部也会调它。
- **`OnClickPrefixIcon()` / `OnClickSuffixIcon()`** —— 前后缀图标点击：只读时忽略；`prefixIconForClean` 触发清空、`suffixIconForCopy` 复制 `boxValue` 并闪烁盒子，否则透传默认事件。
- **`OnHoverPrefixIcon(hovered)` / `OnHoverSuffixIcon(hovered)`** —— 只读时忽略；否则在可悬浮时切换 `state.prefixIconHovered` / `state.suffixIconHovered`。

显示文本的计算顺序（`doUpdateText` 内）：聚焦且可编辑且未开 `useTextWhenFocus` 时显示原始值；否则先 `cookValHint` 加工再 `translateValue` 翻译——命中字典项时按 `useRawValue` / `getDisplayText` 选出文本，并把 `icon/tip/item` 写回 `state`；最后过 `useFormatValue` 输出。

## 配合使用

- **与 `useValueInput`**：本 hook 内部先 `useValueInput(boxProps)` 拿到字典与规整管线，控件不必再建。
- **与 `useFormatValue` / `usePrefixSuffix`**：同样在内部组装；格式化结果决定 `boxInputing`，前后缀状态挂在 `state` 上。
- **与字典模型**：`options` 三种形态、`dictVars` 动态上下文统一见 [字典模型](../../10.concepts/06-dict-model.md)。

典型调用形态（组件 `setup` 内）：

```ts
// state 由组件持有，hook 直接读写它
const state = reactive<ValueBoxState<string>>({
  boxInputing: '',
  boxFocused: false,
  altKey: false, ctrlKey: false, shiftKey: false, metaKey: false,
  boxErrMsg: '',
});
const box = useValueBox(state, props, { emit, getBoxElement, COM_TYPE: 'TiXxx' });

// 外部值变了：同步内部显示
watch(() => props.value, (v) => box.doUpdateValue(v));

// 用户键入：规整后通知外部
function onInput(v: string) {
  box.doChangeValue(v); // 内部会 emit('change', 规整后的值)
}
```

## 注意事项

- **不做响应式重建**：hook 在调用时一次性解析 `props` 并初始化 `state.boxValue`；后续 `props.value` 变化需要组件自己 `watch` 并调用 `doUpdateValue`。
- **只读拦截**：`doChangeValue`、前后缀点击在 `readonly` 时全部直接返回。
- **翻译/格式化失败容错**：`translateValue` 抛错时退回 `Str.anyToStr(val)` 并打印警告，不会让盒子白屏。
- **`useTextWhenFocus` 的用途**：存储值是 UUID 这类不可读主键时，避免聚焦就让用户看到一串乱码。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/use-value-box.ts` —— 本 hook 实现。
  - `src/lib/_features/use-value-input.ts` —— 本 hook 聚合的值规整/翻译层。
  - `src/lib/_features/use-format-value.ts` —— 本 hook 聚合的格式化层。
  - `src/lib/input/box3/use-ti-input-box3-api.ts` —— 现行输入盒子（`TiInput`）的等价实现。
- **相关文档**
  - 输入值规整管线：[use-value-input](./use-value-input.md)。
  - 字典数据模型：[字典模型](../../10.concepts/06-dict-model.md)。
  - 前后缀/只读/占位等横切 Props：[共享 Props](../../10.concepts/02-common-props.md)。
