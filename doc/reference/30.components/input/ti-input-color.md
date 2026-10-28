---
title: TiInputColor 颜色框
keywords: [颜色, 颜色选择, color, TiInputColor, 取色器, scaffold, INPUT]
status: draft
---

# TiInputColor 颜色框

## 介绍

`TiInputColor` 是输入类（`INPUT`）的颜色选择框，注册表带 `scaffold` 脚手架标签。它的
设计意图是提供一个「色板 / 取色器」输入，让用户选一个颜色值。

**当前版本视图只是占位**：组件渲染一行固定文本 `I am input Color`，没有任何取色交互、
没有值、没有事件。类型上也只声明了 `CommonProps`。

使用时需要注意：

- 不要在生产界面使用；它目前不收集值，也不发事件。
- 配色需求现阶段请直接用 `TiLabel` 展示颜色块，或自行接入原生 `<input type="color">`。

源码目录：`src/lib/input/color/`。

## 例子

### JSON 配置

```json
{}
```

### Vue 标签调用

```xml
<TiInputColor />
```

## 控件参数

### 数据

本组件无此组参数（`InputColorProps` 仅为 `CommonProps`，尚未声明值字段）。

### 行为

本组件无此组参数。

### 外观

本组件无此组参数（仅继承 `className`、`style`，见
[共享 Props](../../10.concepts/02-common-props.md)）。

### 回调

本组件无此组参数。

### 嵌套

本组件未提供插槽。

### 事件

本组件无对外声明事件。

> 本组件仅继承 `CommonProps`，共享字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 颜色框占位（`simple`）

**JSON 配置**

```json
{}
```

**Vue 标签**

```xml
<TiInputColor />
```

## 总结

`TiInputColor` 是规划中的颜色取色输入，**当前版本为脚手架占位，无实际功能**。等它落地前，
颜色值录入请走原生控件或自定义实现；展示颜色块可配合 `TiLabel`。

## 延伸阅读

- **源码入口**
  - `src/lib/input/color/ti-input-color-index.ts` —— 注册表信息与示例配置。
  - `src/lib/input/color/ti-input-color-types.ts` —— `InputColorProps`（仅 `CommonProps`）。
  - `src/lib/input/color/TiInputColor.vue` —— 占位视图。
- **相关文档**
  - 图标选择输入（占位）：[TiInputIcon 选择图标](./ti-input-icon.md)。
  - 共享 Props：[共享 Props](../../10.concepts/02-common-props.md)。
