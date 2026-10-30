---
title: use-tipable 悬浮提示挂载
keywords: [hook, useTipable, use-tipable, Tipable, tip, 提示, tooltip, 悬浮提示, data-tip, TipBox]
status: draft
---

# `use-tipable` 悬浮提示挂载

## 解决什么问题

开关、复选这类小控件在鼠标悬浮时要弹出一段说明文字。提示内容、位置、延迟、修饰键等配置
都收敛在全局 `TipBox` 机制里，组件自己不渲染浮层，只要「注册一段提示 + 在目标元素上打个
标识」即可。

`useTipable` 封装了这段注册/替换/注销流程，并输出挂到目标元素上的 `data-tip` 标识属性。
它目前被 `TiToggle`、`TiCheck` 直接使用。

## 输入 Props

`TipableProps = Omit<TipBoxProps, "content">`（在 `use-tipable.ts` 内声明）。

> 注意：**`useTipable()` 不接收 Props 参数**。`TipableProps` 类型只是约束
> `registerTip(content, config)` 第二个参数的形态，不随组件 props 自动传入。
> `TipBoxProps` 的完整字段（`dockMode`、`delay`、`modifier`、`vars`、`canDisabled`、
> `type`、尺寸档位等）见 `src/lib/_tipbox/lib-tip-types.ts`。

## 返回值 API

```ts
const tip = useTipable();
```

返回 `TipableApi`（`ReturnType<typeof useTipable>`）：

- **`TipDataConfig: ComputedRef<{ "data-tip": string } | undefined>`** —— 已注册提示时
  输出 `{ "data-tip": "::<tip_id>" }`，未注册时为 `undefined`。把它展开绑到目标元素上，
  全局提示机制凭此标识找到对应提示。
- **`registerTip(tipContent: string | null | undefined, tipConfig: TipableProps = {})`**
  —— 注册或替换提示：
  - `tipContent` 为空 → 直接调用 `deposeTip()` 注销；
  - 已有 `tip_id` → 走 `replaceTip(id, { ...tipConfig, content })` 原地替换；
  - 否则 `addTip({ ...tipConfig, content })` 新建并记下返回的 `tip_id`。
- **`deposeTip()`** —— 主动注销当前提示：`removeTip(id)` 并清空 `tip_id`；未注册时
  直接返回。

底层通过 `getAppTipsApi()` 拿到全局提示 API，组件自身不持有浮层 DOM。

## 配合使用

- **与模板绑定**：把 `TipDataConfig` 展开到目标根元素，再在适当时机调用 `registerTip`。
- **与 `TipBoxProps`**：位置、延迟、修饰键、变量上下文等都通过 `registerTip` 第二个
  参数传入，不在组件 Props 上重复声明。

典型调用片段：

```ts
import { watch } from 'vue';
import { useTipable } from '../_features';

const tip = useTipable();

// 提示内容随 props 变化时重新注册
watch(
  () => props.tip,
  (content) => tip.registerTip(content, { delay: 600, vars: { name: '开关' } }),
  { immediate: true }
);
```

```xml
<!-- 把 data-tip 标识展开到目标元素 -->
<span v-bind="tip.TipDataConfig">…</span>
```

## 注意事项

- **hook 无参**：不要把组件 `props` 传进去；配置走 `registerTip` 第二参。
- **`TipDataConfig` 是 computed**：注册/注销会自动刷新标识属性，无需手动重算。
- **当前消费方仅 `TiToggle`、`TiCheck`**；其他需要悬浮提示的控件多通过全局 `TipBox`
  机制或 `data-tip` 约定挂载，而非直接调用本 hook。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/use-tipable.ts` —— 本 hook 实现。
  - `src/lib/_tipbox/lib-tip-types.ts` —— `TipBoxProps` 完整字段。
  - `src/lib/input/toggle/TiToggle.vue`、`src/lib/input/check/TiCheck.vue` —— 消费方。
- **相关文档**
  - `TipableProps` 在共享 Props 体系中的位置：[共享 Props](../../10.concepts/02-common-props.md)。
