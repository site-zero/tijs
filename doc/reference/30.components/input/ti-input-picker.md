---
title: TiInputPicker 挑选输入框
keywords: [挑选, 弹窗选择, picker, TiInputPicker, 模态选择, scaffold, INPUT]
status: draft
---

# TiInputPicker 挑选输入框

## 介绍

`TiInputPicker` 是输入类（`INPUT`）的挑选输入框，注册表带 `scaffold` 脚手架标签。它的
设计意图是：一个普通输入框，点击后弹出模态框在更大的界面里挑选值（比如从树形目录、
大列表、地图里选一个记录），再把结果回填进输入框。

**当前版本它只是 `TiInput`（box3）的一层薄包装**：视图里直接渲染 `<TiInput v-bind="props" />`，
所有参数原样透传，还没有实现「点击弹出挑选对话框」的行为。`dialog` 属性已经在类型里声明，
但视图尚未消费，保留备用。

使用时需要注意：

- 现在用它和直接用 `TiInput` 效果相同，不要指望 `dialog` 已经生效。
- 如果需要「输入框 + 弹出日历 / 颜色板」这类已落地的弹出选择，请直接用 `TiInputDate`、
  `TiInputColor` 等具体控件。

源码目录：`src/lib/input/picker/`。

## 例子

### JSON 配置

```json
{
  "value": "Some Value"
}
```

### Vue 标签调用

```xml
<TiInputPicker value="Some Value" @change="onChange" />
```

## 控件参数

### 数据

- **`value`（`any`，来自 `InputBoxProps`）**：控件当前值，透传给内部 `TiInput`。
- **选项与显示**：`DictProps`、`DisplayTextProps`、`BoxOptionsDataProps`、`BoxDropListProps`
  等全部继承自 `InputBoxProps`（box3 输入框基类），规则见
  [字典模型](../../10.concepts/06-dict-model.md)。
- **值管道**：`ValuePipeProps` 字段含义见
  [值规整管线](../../40.features/value/use-value-input.md)。

### 行为

- **`dialog`（`AppModalProps`，无默认值）**：挑选对话框的配置；**类型已声明，当前版本
  视图未接线，保留备用**。
- 其余交互开关（`readonly`、`autoFocus`、`autoSelect`、`useTextWhenFocus`、
  `tipShowTime`、`tipShowDelay`、`keepEmptyValue` 等）均来自 `InputBoxProps`，透传给
  内部 `TiInput`。

### 外观

全部外观通道（`BoxAspectProps`、前后缀图标 `BoxPrefixSuffixProps`、尺寸提示
`ShowBoxSizeProps`）来自 `InputBoxProps`，透传渲染；变量来源见
[样式系统](../../10.concepts/05-style-system.md)。

### 回调

本组件无此组参数（选择器回调属于后续脚手架规划，当前未声明）。

### 嵌套

本组件未提供插槽；内部 `TiInput` 的插槽也没有向外转发。

### 事件

- **`change`**：视图透传内部 `TiInput` 的 `change`，载荷为新值；类型标注写成了
  `payload: number`，与 box3 实际载荷（`any`）不符，按 `any` 对待。
- **`focus` / `blur` / `click` / `click:prefix-icon` / `click:suffix-icon`**：随内部
  `TiInput` 透传。

> 本组件参数主体继承自 `InputBoxProps`（即 box3 输入框基类），共享字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)，本篇不再罗列。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单挑选框（`simple`）

**JSON 配置**

```json
{}
```

**Vue 标签**

```xml
<TiInputPicker />
```

## 总结

`TiInputPicker` 是面向未来「弹窗式挑选」场景预留的脚手架组件，**当前版本没有实际功能，
等价于 `TiInput`**。不要在生产界面依赖它；需要弹出面板选择时，按场景选择已落地的
`TiInputDate` / `TiInputDatetime`（日历浮层）、`TiInputColor`、`TiInputIcon`（规划中）
等具体控件。

## 延伸阅读

- **源码入口**
  - `src/lib/input/picker/ti-input-picker-index.ts` —— 注册表信息与示例配置。
  - `src/lib/input/picker/ti-input-picker-types.ts` —— `InputPickerProps`（`InputBoxProps`
    加 `dialog`）。
  - `src/lib/input/picker/TiInputPicker.vue` —— 薄包装视图，透传 `TiInput`。
- **相关文档**
  - 被透传的输入框基类：[TiInput 输入框](./ti-input.md)（box3）。
  - 共享 Props：[共享 Props](../../10.concepts/02-common-props.md)。
