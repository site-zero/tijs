---
title: use-placeholder 占位文本
keywords: [hook, usePlaceholder, use-placeholder, placeholder, 占位符, 占位文本, autoI18n, 空值提示]
status: draft
---

# `use-placeholder` 占位文本

## 解决什么问题

输入框、标签、多选框在值为空时要显示一段灰色提示文字，这段文字常需要走 `i18n:`
国际化解析。每个组件自己写一遍「`placeholder` 为空就显示空串、否则过一遍 `I18n.text`」
会重复且口径不一。

`usePlaceholder` 只做一件事：把 `placeholder` 规范化成最终要展示的字符串，缺省开启
国际化。它被输入类组件（文本、密码、组合、下拉标签、Box3 输入框）以及 `TiTags`、
`TiLabel` 等空值展示控件使用。

## 输入 Props

`PlaceholderProps`（在 `use-placeholder.ts` 内声明）：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `placeholder` | `string` | 空值时展示的占位文本，支持 `i18n:` 前缀 |
| `autoI18n` | `boolean` | 是否对 `placeholder` 做国际化解析（取自 `TextShowProps`） |

## 返回值 API

```ts
const placeholder = usePlaceholder(props);
```

- **返回 `string`** —— 规范化后的占位文本。计算规则：
  - `props.placeholder ?? ""`，未声明时返回空串而不是 `undefined`；
  - `props.autoI18n ?? true`，缺省开启国际化；
  - 当 `autoI18n` 为真且 `placeholder` 非空时，经 `I18n.text(placeholder)` 解析。

> 与概念篇描述的差异：源码注释里曾规划过 `getPlaceholder(dft?)`（输入为 nil 才返回
> placeholder、否则返回 undefined），该类型已注释停用；当前版本只返回一个字符串。

## 配合使用

- **与 `TextShowProps.autoI18n`**：开关缺省 `true`，组件若不希望占位文本被国际化，需
  在 `withDefaults` 里显式关掉。
- **与输入类 api hook**：各输入控件在 `setup` 内用
  `const Placeholder = computed(() => usePlaceholder(props))` 包一层，跟随 Props 变化。

典型调用片段：

```ts
import { computed } from 'vue';
import { usePlaceholder } from '../_features';

// 包进 computed 以响应 props.placeholder 变化
const Placeholder = computed(() => usePlaceholder(props));
```

```xml
<!-- 值为空时显示占位文本 -->
<span v-if="!modelValue" class="placeholder">{{ Placeholder }}</span>
```

## 注意事项

- **总是返回字符串**：`placeholder` 未声明时返回 `""`，模板里直接插值即可，不必再判
  `undefined`。
- **缺省 `autoI18n = true`**：与多数输入控件默认一致；若组件另有 `autoI18n` 默认值，
  以组件 `withDefaults` 为准。
- **当前返回类型是 `string` 而非计算属性**：想响应式必须像上面那样外层套 `computed`。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/use-placeholder.ts` —— 本 hook 实现。
  - `src/lib/input/text/ti-input-text-api.ts`、`src/lib/tile/tags/TiTags.vue` —— 典型消费方。
- **相关文档**
  - `placeholder / autoI18n` 共享字段：[共享 Props](../../10.concepts/02-common-props.md)。
  - `i18n:` 前缀解析规则：[国际化 i18n](../../10.concepts/04-i18n.md)。
