---
title: 共享 Props
keywords: [共享属性, CommonProps, readonly, placeholder, prefix, suffix, icon, tipable, docking, visibility, props mixin]
status: draft
---

# 共享 Props

## 要解决的问题

这套组件里有大量重复的需求：外面套一层自定义类、加一段内联样式、控制只读、显示占位
文本、前后缀放图标、悬浮提示、按上下文决定显隐……如果每个组件各写一套判断逻辑，代码
会成倍膨胀，行为口径也会不一致。

**TiJS 的做法是把这些横切需求拆成一组独立的 Props 类型 + 对应的 `use-*` hook。**
组件声明自己 `extends` 哪几组 Props，在 `setup` 里调用对应 hook 取得计算结果；组件篇
只需要写一句"本组件继承哪些共享 Props"，不必重复抄字段表。

## 解决思路

### 分组总览

| 分组 | Props 类型 | 背后 hook | 主要服务对象 |
| --- | --- | --- | --- |
| 基础类名/样式 | `CommonProps` | `useClassStyle` | 全部组件 |
| 文本自动国际化 | `TextShowProps` | 各组件内调用 `I18n.text` | 带文本的控件 |
| 只读 | `ReadonlyProps` | `useReadonly` | 输入/编辑类控件 |
| 占位文本 | `PlaceholderProps` | `usePlaceholder` | 输入/展示类控件 |
| 显隐/禁用 | `VisibilityProps` | `useVisibility` | 表单字段、列表项 |
| 前后缀 | `PrefixSuffixProps` | `usePrefixSuffix` | 输入框、值展示框 |
| 图标+文字单元 | `IconTextProps` | `useIconText` | 前后缀、按钮、标签 |
| 悬浮提示 | `TipableProps` | `useTipable` | 任意可挂载提示的控件 |
| 弹出停靠 | `DockingProps` | `useDocking` | 弹层、气泡、下拉 |
| 行缩进 | `RowIndentProps` | `use-row-indent` | 列表、表格、树 |
| 事件适配 | `EmitAdaptorProps` | `useEmitAdaptor` | 表单/容器类组件 |

> 事件适配器 `EmitAdaptorProps` 的机制单独在 [事件绑定](03-event-binding.md) 讲解，
> 本篇只列出 Props 归属，不展开。

### 基础：`CommonProps`

所有组件都继承的最小组合：

- **`className?: any`** —— 追加到组件根节点的自定义类名，支持字符串或类名对象。
- **`style?: Vars`** —— 追加到组件根节点的内联样式对象。

`useClassStyle` 负责把 `className`、`style` 与组件内部状态类名合并成最终的
`className` / `style`，组件根模板上直接使用合并结果。

### 文本自动国际化：`TextShowProps`

- **`autoI18n?: boolean`** —— 是否对组件文本自动走 `I18n.text` 解析 `i18n:` 前缀，
  缺省由各组件 `withDefaults` 决定（多数输入/按钮类组件默认为 `true`）。

### 只读：`ReadonlyProps`

- **`readonly?: any`** —— 只读条件，取值可以是布尔值、函数，或一个 `Match` 匹配描述。

`useReadonly(props)` 内部用 `Match.parse(props.readonly, false)` 编译出匹配器，返回

- **`isReadonly(ctx)`** —— 按传入的上下文求值，返回当前是否只读。

### 占位文本：`PlaceholderProps`

- **`placeholder?: string`** —— 空值时展示的占位文本，支持 `i18n:` 前缀。
- **`autoI18n?: boolean`** —— 是否对 `placeholder` 做国际化解析，缺省 `true`。

`usePlaceholder(props)` 返回处理后的占位文本字符串；未声明或非 `autoI18n` 时原样返回。

### 显隐与禁用：`VisibilityProps`

四个条件都是 `TiMatch` 匹配描述，匹配目标是**表单上下文 `FormContext`**：

- **`visible?: any`** —— 满足条件才可见。
- **`hidden?: any`** —— 满足条件就隐藏。
- **`disabled?: any`** —— 满足条件即禁用。
- **`enabled?: any`** —— 满足条件才启用。

`useVisibility(props, traceName)` 返回：

- **`isDisabled(vars)`** —— `disabled` 与 `enabled` 成对求值，缺省不禁用。
- **`isHidden(vars)`** —— `hidden` 与 `visible` 成对求值，缺省不隐藏。

配对规则：两个条件都声明时先判"是"条件、再判"否"条件，都不命中返回缺省值；只声明一个
条件时，不满足"是"条件即否定。

### 前后缀：`PrefixSuffixProps`

在组件左右两侧同时挂"图标 + 文字"单元，前缀与后缀结构对称。每一侧都有：

- **`prefixIcon? / prefixText?`、`suffixIcon? / suffixText?`** —— 图标与文字内容。
- **`prefixHoverIcon? / prefixHoverText?`、`suffixHoverIcon? / suffixHoverText?`**
  —— 悬浮时替换的图标与文字。
- **`prefixIconClickable? / prefixTextClickable?`、`suffixIconClickable? / suffixTextClickable?`**
  —— 该单元是否可点击。
- **`prefixClass? / prefixStyle?`、`prefixIconClass? / prefixIconStyle?`、
  `prefixTextClass? / prefixTextStyle?`**（后缀同理）—— 外层与图标、文字各自的类名/样式。

`usePrefixSuffix(state, props, emit)` 返回 `Prefix`、`Suffix` 两个 `IconTextFeature`，
以及 `getClass()` 输出的一组状态类名（`has-prefix`、`no-suffix` 等）。
点击可点击单元时发出 `click-prefix-icon`、`click-prefix-text`、
`click-suffix-icon`、`click-suffix-text` 事件。

### 图标 + 文字单元：`IconTextProps`

`PrefixSuffixProps` 的底层单元，也被按钮、标签等直接使用：

- **`icon? / text?`、`hoverIcon? / hoverText?`** —— 常规与悬浮内容。
- **`iconClickable? / textClickable?`** —— 是否可点击。
- **`iconClass? / iconStyle?`、`textClass? / textStyle?`** —— 分区样式。
- **`className? / style?`、`autoI18n?`** —— 外层样式与文本国际化。

`useIconText(state, props, options)` 计算出 `show`、`showIcon`、`showText`、
`canHoverIcon`、`canHoverText`，以及 `OnClickIcon`、`OnClickText` 等回调；
悬浮时若声明了 `hoverIcon / hoverText` 则切换内容。

### 悬浮提示：`TipableProps`

`TipableProps = Omit<TipBoxProps, "content">`，提示位置、延迟、修饰键、变量上下文等
配置统一收敛在 `TipBoxProps`（见延伸阅读源码）。`useTipable()` 返回：

- **`registerTip(content, config?)`** —— 注册或替换提示；`content` 为空则注销。
- **`deposeTip()`** —— 主动注销提示。
- **`TipDataConfig`** —— 计算属性，输出挂到目标元素上的 `data-tip` 标识属性。

### 弹出停靠：`DockingProps`

- **`width? / height? / minWidth? / maxWidth? / minHeight? / maxHeight?`**
  —— 弹层尺寸约束。

`useDocking(options)` 返回 **`genDockingStyle()`**：根据目标元素与视口所在象限，
计算出 `top / left / right / bottom` 与宽高约束，让弹层自动选择上方/下方、左对齐/
右对齐停靠。`space` 为目标元素与弹层间距，默认 4px。

### 行缩进：`RowIndentProps`

服务列表、表格与树形结构：

- **`rowIndents?: Map<TableRowID, number>`** —— 各行缩进级数，0 表示不缩进。
- **`rowStauts?: Map<TableRowID, 'open' | 'closed'>`** —— 各行展开/折叠状态。
- **`rowIndicators?: Record<'open' | 'closed', string>`** —— 展开/折叠指示图标。
- **`getRowIcon?`** —— 行状态图标的取值路径、转换函数或自定义获取器。

## 关键细节

- **共享 Props 不重复抄表**：组件篇只声明继承了哪几组，字段含义以本篇为准。
- **`readonly`、`visible` 等不是简单布尔值**：它们可以是 `Match` 描述，运行时结合
  上下文求值；写死布尔值只是其中一种最简形态。
- **`autoI18n` 缺省值由组件决定**：本篇只定义开关，具体缺省 `true/false` 以对应
  组件类型与 `withDefaults` 为准。
- **`useIconText` 建议在 `computed` 中使用**，才能跟随 Props 与悬浮状态保持响应性。

## 主要代码入口

- `src/_type/core-types.ts` —— `CommonProps`、`VisibilityProps`、`EmitAdaptorProps`。
- `src/lib/_features/_com_props.ts` —— `TextShowProps`。
- `src/lib/_features/use-readonly.ts`、`use-placeholder.ts`、`use-visibility.ts`
- `src/lib/_features/use-prefix-suffix.ts`、`use-icon-text.ts`
- `src/lib/_features/use-tipable.ts`、`use-docking.ts`
- `src/_type/lib-type-row-indent.ts` —— `RowIndentProps`
- `src/lib/_tipbox/lib-tip-types.ts` —— `TipBoxProps` 完整字段

## 延伸阅读

- 事件适配器 `events` 属性：[事件绑定](03-event-binding.md)。
- 文本 `i18n:` 前缀如何解析：[国际化 i18n](04-i18n.md)。
- 共享 Props 在组件目录中的抽取位置：`docs/skill/write-tijs-doc.skill.md` 第 5 节。
