---
title: use-readonly 只读状态判定
keywords: [hook, useReadonly, use-readonly, readonly, 只读, ReadonlyProps, Match, isReadonly, 表单上下文]
status: draft
---

# `use-readonly` 只读状态判定

## 解决什么问题

输入类控件要不要变成只读，常常不是写死的布尔值，而是按表单上下文动态判定的——例如
「某字段填了特定值时，关联字段只读」。每个控件自己解析布尔值、函数、匹配描述会重复。

`useReadonly` 把 `readonly` 编译成一个匹配器，对外只暴露一个按上下文求值的
`isReadonly(ctx)`。它被输入文本、密码、组合、多选下拉、Box3 输入框，以及 `use-boolean-input`
与表格字段渲染 `GFItField` 使用。

## 输入 Props

`ReadonlyProps`（在 `use-readonly.ts` 内声明）：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `readonly` | `any` | 只读条件：布尔值、`(ctx) => boolean`，或 `Match` 匹配描述 |

> `readonly` 的 `Match` 形态说明见 [共享 Props](../../10.concepts/02-common-props.md)，
> 本篇只讲 hook 的输入输出。

## 返回值 API

```ts
const ro = useReadonly(props);
```

返回 `ReadonlyFeature`（`ReturnType<typeof useReadonly>`）：

- **`isReadonly(_ctx: any): boolean`** —— 按传入的上下文求值当前是否只读。
  内部先 `Match.parse(props.readonly, false)` 编译匹配器（缺省 `false`，即未声明时
  非只读），再用 `am.test(_ctx)` 判定。

调用时机：在渲染或处理输入前调用，传入当前表单上下文；返回 `true` 时控件切到只读/展示态。

## 配合使用

- **与输入类 api hook**：各输入控件用
  `const _readonly = computed(() => useReadonly(props))` 包一层，再在处理输入前读
  `_readonly.value.isReadonly(ctx)`。
- **与 `useVisibility`**：`readonly` 与 `disabled` 是两条独立判定——只读仍可展示值，
  禁用则整体不可交互；两者可同时使用。

典型调用片段：

```ts
import { computed } from 'vue';
import { useReadonly } from '../_features';

const _readonly = computed(() => useReadonly(props));

// 提交/改值前按表单上下文判断
if (_readonly.value.isReadonly(formCtx)) {
  return; // 只读，不处理输入
}
```

## 注意事项

- **未声明 `readonly` 时匹配器缺省 `false`**：即默认可编辑，不会误伤。
- **`isReadonly` 是同步函数**：编译发生在 hook 调用时；想响应 `props.readonly` 变化，
  外层需包 `computed`（与现有消费方一致）。
- `_features/index.ts` 将本 hook 与 `use-boolean-input`、`use-format-value` 归为
  「设计得不好、应该重构」的一组；新组件引入前先确认是否已有上层输入 api hook 封装。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/use-readonly.ts` —— 本 hook 实现。
  - `src/lib/input/text/ti-input-text-api.ts`、`src/lib/_features/use-boolean-input.ts` —— 典型消费方。
- **相关文档**
  - `ReadonlyProps` 字段与 `Match` 匹配语义：[共享 Props](../../10.concepts/02-common-props.md)。
