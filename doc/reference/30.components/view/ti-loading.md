---
title: TiLoading 加载标牌
keywords: [加载, loading, TiLoading, 等待, spinner, 加载中, 视图]
status: draft
---

# TiLoading 加载标牌

## 介绍

`TiLoading` 是视图类（`VIEW`）的加载占位标牌，用来在数据加载、运算等待时遮盖一块区域，
给出一个旋转图标加"加载中"文字的提示。它本身没有独立的属性定义，而是**内置参数**的
`TiRoadblock`：默认图标是旋转的 `fas-spinner fa-spin`，文字是 `i18n:loading`（即
"加载中"），并自动开启 `autoI18n`。

使用时需要注意：

- 它把所有传入参数原样 `v-bind` 给内部 `TiRoadblock`，因此 `TiRoadblock` 的
  `icon`、`text`、`size`、`mode`、`links` 等参数对它同样有效，只是给了一套加载默认值。
- 想换提示文字或图标，直接覆盖 `text`、`icon` 即可；想做成满屏遮罩，用 `mode: 'cover'`。

源码目录：`src/lib/view/loading/`。

## 例子

### JSON 配置

```json
{}
```

### Vue 标签调用

```xml
<TiLoading />
```

## 控件参数

`TiLoading` 没有自定义 Props，它复用 `TiRoadblock` 的全部参数，并预设了加载态默认值
（`icon: 'fas-spinner fa-spin'`、`text: 'i18n:loading'`、`autoI18n: true`）。下面按六组
列出其可配置范围，参数语义以 `TiRoadblock` 为准。

### 数据

- **`text`（`string`，默认 `"i18n:loading"`）**：加载提示文字，`autoI18n` 开启时支持
  `i18n:` 前缀；覆盖默认文字即可自定义提示语。
- **`icon`（`IconInput`，默认 `"fas-spinner fa-spin"`）**：提示图标，默认是一个旋转
  沙漏图标。
- **`links`（`RoadblockLink[]`，无默认值）**：底部链接列表，加载标牌一般不用。

### 行为

- **`autoI18n`（`boolean`，默认 `true`）**：是否对 `text` 做 `i18n:` 前缀解析。
- **`iconClickable` / `textClickable`（`boolean`，无默认值）**：是否让图标 / 文字可点击，
  并因此能触发对应的点击事件。

### 外观

- **`mode`（`"cover" | "fit" | "auto"`，无默认值）**：填充模式，`cover` 铺满父容器、
  `fit` 按内容自适应、`auto` 由样式决定。
- **`layout`（`"A" | "B" | "C"`，无默认值）**：图标与文字的排版方向。
- **`size`（`AspectSize`，无默认值）**：图标与文字的尺度分级 `t / s / m / b / h`。
- **`opacity`（`"faint" | "shadowy" | number`，无默认值）**：遮罩透明度。
- **`iconStyle` / `textStyle` / `style`（`Vars`，无默认值）**：图标、文字、整体的内联样式。

### 回调

本组件无独立回调参数；图标、文字、链接的样式微调通过上述外观参数完成。

### 嵌套

本组件未提供插槽，图标与文字由 `icon`、`text` 属性决定。

### 事件

- **`click-icon`**：`iconClickable` 为真时点击图标触发，无业务载荷。
- **`click-text`**：`textClickable` 为真时点击文字触发，无业务载荷。

> 本组件继承 `CommonProps`（`className`、`style`），完整参数与样式变量见
> [TiRoadblock](ti-roadblock.md) 与 [共享 Props](../../10.concepts/02-common-props.md)。

## 更多例子

### 简单加载标牌（`simple-loading`）

**JSON 配置**

```json
{}
```

**Vue 标签**

```xml
<TiLoading />
```

## 总结

`TiLoading` 适合"等待中"的轻量占位：数据区加载、文件上传、运算进行中。需要满屏阻断式
遮罩时配合 `mode: 'cover'`；需要表达空态、错误态、成功态等非加载提示时，直接用
`TiRoadblock` 并指定 `icon` / `text`；需要进度百分比时改用 `TiProcess`。

## 延伸阅读

- **源码入口**
  - `src/lib/view/loading/ti-loading-index.ts` —— 注册表信息与示例配置。
  - `src/lib/view/loading/TiLoading.vue` —— 以默认参数包裹 `TiRoadblock`。
- **相关文档**
  - 通用占位 / 空态 / 提示牌：[ti-roadblock](ti-roadblock.md)。
  - 带进度条与日志的处理过程：[ti-process](ti-process.md)。
  - 空态默认占位：[ti-roadblock](ti-roadblock.md)。
