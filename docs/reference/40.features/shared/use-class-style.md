---
title: use-class-style 类名与样式合并
keywords: [hook, useClassStyle, use-class-style, className, style, CssUtils, 类名合并, 内联样式, CommonProps]
status: draft
---

# `use-class-style` 类名与样式合并

## 解决什么问题

每个组件的根节点都要同时输出两类东西：组件内部写死的状态类名（如 `has-prefix`、
`hover-icon`），以及外部通过 `CommonProps` 传进来的自定义 `className` 与 `style`。
如果各组件自己用字符串拼接来合并类名，很容易漏掉条件类、重复类名，内联样式也需要
逐字段规范化。

`useClassStyle` 把这件事收敛成一次调用：用 `CssUtils.mergeClassName` 合并静态类与
条件类，用 `CssUtils.toStyle` 规范化 `style` 对象。它是 `CommonProps.className / style`
在 JS 侧的落地 hook，目前主要作为底层工具被 [use-icon-text](./use-icon-text.md) 内部
复用，尚未被组件直接调用。

## 输入 Props

`ClassStyleFeatureProps`（在 `use-class-style.ts` 内声明）：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `className` | `any` | 来自 `CommonProps.className`，字符串或类名对象 |
| `style` | `Vars` | 追加到根节点的内联样式对象 |

> `CommonProps` 的字段含义见 [共享 Props](../../10.concepts/02-common-props.md)，本篇
> 不重复展开。

函数签名还带两个可选参数：

- **`evalClass?: Convertor<T | undefined, any>`** —— 一个把 `payload` 转成条件类的
  转换函数；不传时只合并 `props.className`。
- **`payload?: T`** —— 传给 `evalClass` 的上下文，泛型 `T` 由调用方决定。

## 返回值 API

```ts
const feature = useClassStyle(props, evalClass?, payload?);
```

返回 `ClassStyleFeature`：

- **`className?: Vars`** —— 合并后的类名对象：
  `CssUtils.mergeClassName(props.className, evalClass ? evalClass(payload) : undefined)`。
  组件根模板直接把它绑到 `:class` 上即可。
- **`style?: Vars`** —— 规范化后的内联样式：`CssUtils.toStyle(props.style)`。

## 配合使用

- **与 `useIconText`**：`useIconText` 在本 hook 之上传入 `evalClassAndStyle`，把
  `hover-icon`、`hover-text` 等条件类一并合并进 `className`。
- **与 `CommonProps`**：本 hook 是 `className / style` 共享 Props 的唯一消费入口，组件
  不必再自行调用 `CssUtils`。

典型调用形态（`setup` 内，建议放入 `computed` 以跟随 Props 变化）：

```ts
import { useClassStyle } from '../_features';

// 合并外部 className 与一个条件类 has-focus
const { className, style } = useClassStyle(
  props,
  (focused: boolean) => ({ 'has-focus': focused }),
  isFocused.value
);
```

## 注意事项

- **本 hook 是同步的、一次性计算**：不在 `computed` 里调用时，Props 后续变化不会自动
  刷新结果。源码注释明确建议「想获得响应性就在 `computed` 里使用」。
- **当前无组件直接消费**：`useClassStyle` 仅被 `useIconText` 内部调用；`_features/index.ts`
  中也标注它「范围过大、仅个别控件使用」，后续可能重构，直接在组件里新引入前先确认
  是否已有上层 hook 可用。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/use-class-style.ts` —— 本 hook 实现。
  - `src/core/web/web-css-utils.ts` —— `CssUtils.mergeClassName / toStyle`。
  - `src/lib/_features/use-icon-text.ts` —— 当前唯一内部消费方。
- **相关文档**
  - `className / style` 共享字段定义：[共享 Props](../../10.concepts/02-common-props.md)。
  - JS 侧类名合并与样式体系：[样式体系](../../10.concepts/05-style-system.md)。
