---
title: use-visibility 显隐与禁用判定
keywords: [hook, useVisibility, use-visibility, visibility, visible, hidden, disabled, enabled, isHidden, isDisabled, TiMatch]
status: draft
---

# `use-visibility` 显隐与禁用判定

## 解决什么问题

表单字段、列表项、操作按钮经常要按上下文决定显隐或禁用：`visible` 满足才显示、`hidden`
满足就隐藏、`disabled` 满足即禁用、`enabled` 满足才可用。这些条件是 `Match` 匹配描述，
且「是/否」两侧要成对求值，各组件各写一套会口径不一。

`useVisibility` 把四个条件编译成两个判定函数 `isHidden`、`isDisabled`，统一「是/否」
配对规则。它被侧边栏菜单项、操作栏构建、网格字段构建、校验构建与旧筛选面板使用。

## 输入 Props

`VisibilityProps`（定义在 `src/_type/core-types.ts`，被本 hook 直接消费）：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `visible` | `any` | `TiMatch`，满足条件才可见 |
| `hidden` | `any` | `TiMatch`，满足条件就隐藏 |
| `disabled` | `any` | `TiMatch`，满足条件即禁用 |
| `enabled` | `any` | `TiMatch`，满足条件才启用 |

调用时还要传入第二个参数：

- **`traceName: string`** —— 调试用追踪名，仅在内部（当前已注释的）日志里使用，
  不影响判定结果。

## 返回值 API

```ts
const vis = useVisibility(props, 'MyCom.field1');
```

返回 `VisibilityFeature`：

- **`isDisabled(vars: Vars): boolean`** —— 按 `disabled`（是）与 `enabled`（否）成对求值。
- **`isHidden(vars: Vars): boolean`** —— 按 `hidden`（是）与 `visible`（否）成对求值。

配对规则（`buildMatcher`，两组一致）：

- 「是」「否」都声明：先判是条件命中 → 返回 `true`；再判否条件命中 → 返回 `false`；
  都不命中 → 返回缺省值 `false`。
- 只声明「是」条件：命中返回 `true`，否则 `false`。
- 只声明「否」条件：命中返回 `false`，否则 `true`。
- 两个都未声明：直接返回缺省 `false`（即不隐藏、不禁用）。

## 配合使用

- **与 `Match`**：四个条件都由 `Match.parse` 编译，匹配目标是传入的 `vars`（表单上下文
  `FormContext`）。
- **与字段/项构建管线**：本 hook 多在「构建单个字段/菜单项」时调用一次，把
  `isHidden / isDisabled` 合并进该项的计算属性。

典型调用片段：

```ts
import { useVisibility } from '../_features';

const vis = useVisibility(fieldProps, 'form.field.' + fieldName);

// 渲染时按表单上下文决定是否隐藏/禁用
const hidden = vis.isHidden(formCtx);
const disabled = vis.isDisabled(formCtx);
```

```xml
<div v-if="!hidden" :class="{ 'is-disabled': disabled }">…</div>
```

## 注意事项

- **`traceName` 当前未参与行为**：仅传给内部（已注释的）调试日志，传任意字符串即可。
- **缺省值都是 `false`**：未声明任何条件时，既不隐藏也不禁用。
- **`isDisabled / isHidden` 是同步函数**：在 hook 调用时编译匹配器；Props 后续变化需外层
  重新调用或包 `computed`。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/use-visibility.ts` —— 本 hook 实现与 `buildMatcher`。
  - `src/_type/core-types.ts` —— `VisibilityProps` 定义。
  - `src/lib/shelf/grid-fields/build-grid-field.ts`、`src/lib/action/actionbar/build-action-bar-items.ts` —— 典型消费方。
- **相关文档**
  - `visible / hidden / disabled / enabled` 配对语义：[共享 Props](../../10.concepts/02-common-props.md)。
