---
title: use-icon-text 图标文字单元
keywords: [hook, useIconText, use-icon-text, IconText, icon, text, hoverIcon, hoverText, 图标, 文字单元, 可点击]
status: draft
---

# `use-icon-text` 图标文字单元

## 解决什么问题

按钮、标签、路障、前后缀输入框里反复出现同一种小单元：左边一个图标、右边一段文字，
悬浮时图标或文字可以换成另一套内容，点击时要判断这一格到底可不可点、要不要发事件。
如果每个组件各自判断「`icon` 有没有声明」「`hoverIcon` 换不换」「能不能点击」，代码会
高度重复。

`useIconText` 把「图标 + 文字」这一格的显隐、悬浮切换、分区类名样式、点击回调一次性算好。
它是 [use-prefix-suffix](./use-prefix-suffix.md) 的底层单元，也被路障组件
（`TiRoadblock`）直接使用。

## 输入 Props

`IconTextProps`（在 `use-icon-text.ts` 内声明）：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `className` | `any` | 外层自定义类名（取自 `CommonProps`） |
| `style` | `Vars` | 外层内联样式 |
| `autoI18n` | `boolean` | 是否对 `text` 走 `I18n.text` 解析 `i18n:` 前缀（取自 `TextShowProps`） |
| `icon` | `IconInput` | 图标内容 |
| `text` | `string` | 文字内容 |
| `hoverIcon` | `IconInput` | 悬浮时替换的图标 |
| `hoverText` | `string` | 悬浮时替换的文字 |
| `iconClass` | `any` | 图标分区类名 |
| `iconStyle` | `Vars` | 图标分区内联样式 |
| `textClass` | `any` | 文字分区类名 |
| `textStyle` | `Vars` | 文字分区内联样式 |
| `iconClickable` | `boolean` | 图标是否可点击 |
| `textClickable` | `boolean` | 文字是否可点击 |

除了 Props，调用时还要传入两样东西：

- **`state: IconTextState`** —— `{ iconHovered?: boolean; textHovered?: boolean }`，
  由调用方持有悬浮态，hook 据此决定是否切到 `hoverIcon / hoverText`。
- **`options: IconTextOptions<I, T>`** —— `{ emit?, emitIcon?, emitText? }`：组件的
  `emit` 函数与点击图标/文字时要发出的事件名。

## 返回值 API

```ts
const unit = useIconText(state, props, options);
```

返回 `IconTextFeature`：

- **`show: boolean`** —— 图标或文字任一非空即 `true`，整格是否需要渲染。
- **`showIcon / showText: boolean`** —— `icon` / `text` 是否非空（`!_.isEmpty(...)`）。
- **`canHoverIcon / canHoverText: boolean`** —— 对应内容非空且 `*Clickable` 为真，
  即「可点击」的最终判定。
- **`icon?: IconInput`、`text?: string`** —— 按悬浮态切换后的最终内容；`text` 在
  `autoI18n` 时先过 `I18n.text`。
- **`className / style`** —— 外层合并结果（含 `hover-icon`、`hover-text` 条件类）。
- **`iconClass / iconStyle / textClass / textStyle`** —— 图标、文字分区各自合并后的
  类名与样式。
- **`getClassName(className?, ...others)`** —— 工具函数，再合并一层类名并带上
  `hover-icon / hover-text` 条件类。
- **`OnClickIcon / OnClickText: Callback`** —— 绑定到模板的点击回调；只有
  `show && canHover && emit && emitIcon/emitText` 都成立时才真正 `emit`。
- **`setIconHover / setTextHover: Callback1<boolean>`** —— 绑定到模板的悬浮进出回调；
  仅在对应格 `canHover*` 为真时才写入 `state.*Hovered`。

## 配合使用

- **与 `useClassStyle`**：本 hook 内部三次调用 `useClassStyle`（外层、图标分区、文字分区），
  调用方不必再合并类名。
- **与 `usePrefixSuffix`**：前后缀 hook 用本 hook 各算一格 `Prefix` 与 `Suffix`，再叠加
  状态类名。
- **悬浮态响应性**：`state.*Hovered` 是普通对象字段，需放在 `reactive` / `computed`
  中才能驱动模板刷新。

典型调用片段：

```ts
import { reactive } from 'vue';
import { useIconText } from '../_features';

const state = reactive({ iconHovered: false, textHovered: false });
const emit = defineEmits<{ (e: 'click-icon'): void; (e: 'click-text'): void }>();

const unit = useIconText<'click-icon', 'click-text'>(state, props, {
  emit,
  emitIcon: 'click-icon',
  emitText: 'click-text',
});
```

```xml
<!-- 模板里把 unit 各字段绑到图标与文字节点 -->
<i :class="unit.iconClass" :style="unit.iconStyle"
   @click="unit.OnClickIcon"
   @mouseenter="() => unit.setIconHover(true)"
   @mouseleave="() => unit.setIconHover(false)" />
```

## 注意事项

- **`*Clickable` 默认 `false`**：不显式声明 `iconClickable / textClickable` 时，
  `OnClickIcon / OnClickText` 不会发出事件，悬浮态也不会切换。
- **本 hook 是同步计算**：源码注释建议放在 `computed` 里以跟随 Props 与悬浮态。
- **`setIconHover` 当前残留一行 `console.log`**，属于调试代码，调用行为不受影响。
- `_features/index.ts` 将本 hook 标注为「可能要移除」（范围偏大、仅个别控件使用），
  新增组件优先确认能否直接复用 `usePrefixSuffix` 或上层 ValueBox 特性。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/use-icon-text.ts` —— 本 hook 实现。
  - `src/lib/_features/use-prefix-suffix.ts` —— 以本 hook 为单元的前后缀组合。
  - `src/lib/view/roadblock/use-roadblock.ts` —— 直接消费本 hook 的路障特性。
- **相关文档**
  - `IconTextProps` 在共享 Props 体系中的位置：[共享 Props](../../10.concepts/02-common-props.md)。
  - 文本 `i18n:` 前缀解析：[国际化 i18n](../../10.concepts/04-i18n.md)。
