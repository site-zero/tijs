---
title: TiInputIcon 选择图标
keywords: [图标, 选择图标, icon, TiInputIcon, 图标挑选, scaffold, INPUT]
status: draft
---

# TiInputIcon 选择图标

## 介绍

`TiInputIcon` 是输入类（`INPUT`）的图标选择框，注册表带 `scaffold` 脚手架标签。它的
设计意图是提供一个图标库挑选器，让用户从内置图标集中选一个图标名。

**当前版本视图只是占位**：组件渲染一行固定文本 `I am input Icon`，没有图标网格、没有值、
没有事件。类型上也只声明了 `CommonProps`。

使用时需要注意：

- 不要在生产界面使用；它目前不收集值，也不发事件。
- 图标名目前可通过 `TiDroplist` / `TiInputCombo` 配合图标选项数据自行搭建选择器。

源码目录：`src/lib/input/icon/`。

## 例子

### JSON 配置

```json
{}
```

### Vue 标签调用

```xml
<TiInputIcon />
```

## 控件参数

### 数据

本组件无此组参数（`InputIconProps` 仅为 `CommonProps`，尚未声明值字段）。

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

### 图标选择占位（`simple`）

**JSON 配置**

```json
{}
```

**Vue 标签**

```xml
<TiInputIcon />
```

## 总结

`TiInputIcon` 是规划中的图标挑选输入，**当前版本为脚手架占位，无实际功能**。等它落地前，
需要让用户选图标时，用 `TiDroplist` 并把每个选项配上 `icon` 字段即可。

## 延伸阅读

- **源码入口**
  - `src/lib/input/icon/ti-input-icon-index.ts` —— 注册表信息与示例配置。
  - `src/lib/input/icon/ti-input-icon-types.ts` —— `InputIconProps`（仅 `CommonProps`）。
  - `src/lib/input/icon/TiInputIcon.vue` —— 占位视图。
- **相关文档**
  - 颜色选择输入（占位）：[TiInputColor 颜色框](./ti-input-color.md)。
  - 共享 Props：[共享 Props](../../10.concepts/02-common-props.md)。
