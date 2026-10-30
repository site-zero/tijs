---
title: use-prefix-suffix 前后缀单元
keywords: [hook, usePrefixSuffix, use-prefix-suffix, PrefixSuffix, prefix, suffix, 前缀, 后缀, prefixIcon, suffixText, has-prefix]
status: draft
---

# `use-prefix-suffix` 前后缀单元

## 解决什么问题

输入框、值展示框常在左右两侧挂图标或文字：左侧一个放大镜、右侧一个清除按钮。左右两侧
结构完全对称，都要处理显隐、悬浮切换、分区样式与点击事件；外层容器还要根据「有没有
前缀/后缀」切换 grid 列模板（对应 `has-prefix`、`no-suffix` 等状态类）。

`usePrefixSuffix` 用 [use-icon-text](./use-icon-text.md) 各算一格，拼出 `Prefix` 与
`Suffix` 两个单元，并额外输出一组容器状态类名。它被 `useValueBox` 聚合，输入类控件经由
ValueBox 特性间接使用。

## 输入 Props

`PrefixSuffixProps`（在 `use-prefix-suffix.ts` 内声明），左右对称各一组：

| 分区 | 属性 | 类型 | 说明 |
| --- | --- | --- | --- |
| 外层 | `prefixClass / prefixStyle`、`suffixClass / suffixStyle` | `any` / `Vars` | 整格外层类名与样式 |
| 图标 | `prefixIcon / prefixIconClass / prefixIconStyle`、`suffixIcon / suffixIconClass / suffixIconStyle` | `IconInput` / `any` / `Vars` | 图标内容与分区样式 |
| 文字 | `prefixText / prefixTextClass / prefixTextStyle`、`suffixText / suffixTextClass / suffixTextStyle` | `string` / `any` / `Vars` | 文字内容与分区样式 |
| 悬浮 | `prefixHoverIcon / prefixHoverText`、`suffixHoverIcon / suffixHoverText` | `IconInput` / `string` | 悬浮时替换的图标与文字 |
| 可点击 | `prefixIconClickable / prefixTextClickable`、`suffixIconClickable / suffixTextClickable` | `boolean` | 对应格是否可点击 |

调用时还要传入：

- **`state: PrefixSuffixState`** —— 四个布尔值
  `prefixIconHovered / prefixTextHovered / suffixIconHovered / suffixTextHovered`。
- **`emit: PrefixSuffixEmits`** —— 组件的 `emit`，需声明四个事件：
  `click-prefix-icon`、`click-prefix-text`、`click-suffix-icon`、`click-suffix-text`。

## 返回值 API

```ts
const box = usePrefixSuffix(state, props, emit);
```

返回 `PrefixSuffixFeature`：

- **`Prefix: IconTextFeature & ClassStyleFeature`** —— 左侧单元，接口同
  `useIconText` 的返回值（`showIcon / showText / OnClickIcon / OnClickText / ...`）。
- **`Suffix: IconTextFeature & ClassStyleFeature`** —— 右侧单元，结构与 `Prefix` 对称。
- **`getClass(): () => Vars`** —— 容器状态类名对象：
  `no-prefix` / `has-prefix` / `has-prefix-icon` / `has-prefix-text`，
  `no-suffix` / `has-suffix` / `has-suffix-icon` / `has-suffix-text`。
- **`setPrefixIconHover / setPrefixTextHover / setSuffixIconHover / setSuffixTextHover`**
  —— 四个 `Callback1<boolean>`，绑定到模板悬浮进出，直接写入 `state` 对应字段。

> 注意：这四个 `set*Hover` 直接改 `state`，不再像 `useIconText` 那样判断 `canHover*`；
> 是否可点仍由 `Prefix / Suffix` 单元内部的 `OnClick*` 把关。

## 配合使用

- **与 `useIconText`**：本 hook 内部用它各算一格，调用方拿到的 `Prefix / Suffix` 已是
  完整 `IconTextFeature`，模板直接绑字段。
- **与 ValueBox 特性**：`useValueBox` 在本 hook 之上叠加值规整、占位、只读等能力，是
  输入类控件直接对接的特性层。
- **与样式功能类**：`getClass()` 输出的 `has-prefix` / `no-suffix` 等类配合
  `prefix-suffix-box.scss` 的 grid 布局切换列模板（见
  [样式体系](../../10.concepts/05-style-system.md)）。

典型调用片段：

```ts
import { reactive } from 'vue';
import { usePrefixSuffix } from '../_features';

const state = reactive({
  prefixIconHovered: false,
  prefixTextHovered: false,
  suffixIconHovered: false,
  suffixTextHovered: false,
});
const emit = defineEmits<{
  (e: 'click-prefix-icon'): void;
  (e: 'click-prefix-text'): void;
  (e: 'click-suffix-icon'): void;
  (e: 'click-suffix-text'): void;
}>();

const box = usePrefixSuffix(state, props, emit);
```

```xml
<!-- 容器绑 getClass()，左右两格分别绑 Prefix / Suffix -->
<div :class="box.getClass()">
  <i :class="box.Prefix.iconClass" @click="box.Prefix.OnClickIcon"
     @mouseenter="() => box.setPrefixIconHover(true)"
     @mouseleave="() => box.setPrefixIconHover(false)" />
</div>
```

## 注意事项

- **`Prefix / Suffix` 的 `text` 不自动国际化**：本 hook 转交给 `useIconText` 的 props
  里没有 `autoI18n`，前后缀文字若需 `i18n:` 解析，要在组件侧自行处理。
- **当前无组件直接调用本 hook**：消费方是 `useValueBox`；组件篇通常只写「经 ValueBox
  特性支持前后缀」，不直接引用本 hook。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/use-prefix-suffix.ts` —— 本 hook 实现。
  - `src/lib/_features/use-icon-text.ts` —— 底层「图标 + 文字」单元。
  - `src/lib/_features/use-value-box.ts` —— 聚合本 hook 的 ValueBox 特性。
- **相关文档**
  - `PrefixSuffixProps` 字段总览：[共享 Props](../../10.concepts/02-common-props.md)。
  - 前后缀输入框的 grid 布局功能类：[样式体系](../../10.concepts/05-style-system.md)。
