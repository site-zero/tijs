---
title: TiFalls 瀑布贴
keywords: [瀑布贴, falls, TiFalls, waterfall, 瀑布流, 视图]
status: draft
---

# TiFalls 瀑布贴

## 介绍

`TiFalls` 是视图类（`VIEW`）的瀑布流容器，定位是把一组卡片以不等高的多列瀑布形式
排布。当前版本它还只是一个**骨架占位组件**：注册表里已经登记、可以被 schema 动态渲染
出来，但视图本身只渲染一行提示文字，`FallsProps` 也还没有任何业务字段。

使用时需要注意：

- 现在不要把它当成可用的瀑布流直接接数据；列数、间距、数据源、卡片渲染等能力尚未接线。
- 它与 `TiWall`（墙贴，固定网格）在产品定位上相邻，未来瀑布流能力应在本篇落地。

源码目录：`src/lib/view/falls/`。

## 例子

### JSON 配置

```json
{}
```

### Vue 标签调用

```xml
<TiFalls />
```

## 控件参数

### 数据

本组件当前无此组参数（`FallsProps` 尚未声明数据源、列定义等字段）。

### 行为

本组件当前无此组参数。

### 外观

本组件当前无此组参数。

### 回调

本组件当前无此组参数。

### 嵌套

本组件未提供插槽，内容由视图内部写死，不支持通过 slot 自定义。

### 事件

本组件当前无对外声明的标准 `emit` 事件。

> 本组件同时继承 `CommonProps`（`className`、`style`），字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)，本篇不再罗列。

## 更多例子

### 简单瀑布贴（`simple`）

**JSON 配置**

```json
{}
```

**Vue 标签**

```xml
<TiFalls />
```

## 总结

`TiFalls` 目前是预留的瀑布流容器，尚未实现真实排布逻辑；需要多列不等高卡片时，暂时
用 `TiWall` 的固定网格或自行用 CSS columns 实现，待本篇字段落地后再迁移。与相邻视图的
选择：固定行列网格用 `TiWall`，纵向列表用 `TiList`。

## 延伸阅读

- **源码入口**
  - `src/lib/view/falls/ti-falls-index.ts` —— 注册表信息与示例配置。
  - `src/lib/view/falls/ti-falls-types.ts` —— `FallsProps`（当前仅继承 `CommonProps`）。
  - `src/lib/view/falls/TiFalls.vue` —— 占位视图。
- **相关文档**
  - 固定网格卡片墙：[ti-wall](ti-wall.md)。
  - 组件模型与注册表机制：[组件模型](../../10.concepts/01-component-model.md)。
