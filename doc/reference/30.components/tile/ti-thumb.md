---
title: TiThumb 缩略图
keywords: [缩略图, thumb, thumbnail, TiThumb, 图片预览, 指示标记, 进度条, TILE]
status: draft
---

# TiThumb 缩略图

## 介绍

`TiThumb` 是小片类（`TILE`）的卡片式缩略图容器，把「预览图 + 标题文字 + 扩展信息」叠在
一张卡片里，并能在预览区四角 / 中心叠放状态指示标记，底部还能再压一条进度条。它适合列表、
网格里展示一个对象的概览：商品卡、文件卡、用户头像卡。

它由四个子件拼合而成：预览用 `TiImage`，标题 / 扩展信息用 `TiTextSnippet`，进度用
`TiProgressBar`；你只需要分别把它们的配置传进来。

使用时需要注意：

- `text` / `more` 传字符串会包成 `{ text }`，传 `TextSnippetProps` 可定制样式。
- `indicators` 按 `position` 分位叠放；`icon` 在左侧位自动当前缀图标、右侧位当后缀图标。
- `progress` 声明后才渲染底部进度条。

源码目录：`src/lib/tile/thumb/`。

## 例子

### JSON 配置

```json
{
  "width": 100,
  "preview": { "src": "https://picsum.photos/500", "objectFit": "cover", "height": 100 },
  "text": "Gift For You"
}
```

### Vue 标签调用

```xml
<TiThumb :width="100" :preview="{ src: 'https://picsum.photos/500', objectFit: 'cover', height: 100 }" text="Gift For You" />
```

## 控件参数

### 数据

- **`preview`（`ImageProps`，无默认值）**：预览区配置，内部用 `TiImage` 渲染。
- **`text`（`string | TextSnippetProps`，无默认值）**：预览区下方的主标题文字；字符串简写或
  完整文字片段配置。
- **`more`（`string | TextSnippetProps`，无默认值）**：标题下方的扩展信息行。
- **`progress`（`ProgressBarProps`，无默认值）**：底部进度条配置；声明后渲染 `TiProgressBar`。
- **`indicators`（`ThumbIndicator[]`，无默认值）**：叠在预览区上的状态标记数组，每项：
  - **`position`（`ThumbIndicatorPosition`，必填）**：`"left-top" | "right-top" | "bottom-left" | "bottom-right" | "center"`。
  - **`type`（`LogicType`，无默认值）**：标记状态色，叠加 `is-<type>` 类。
  - **`icon`（`IconInput`，无默认值）**：标记图标，按所在位置自动当前缀 / 后缀图标。
  - **`text`（`string | TextSnippetProps`，无默认值）**：标记文字。
  - **`tip`（`string | TextSnippetProps`，无默认值）**：标记悬浮提示。
  - **`className` / `style`（`string` / `Vars`，无默认值）**：标记追加的类与样式。

### 行为

- **`flexGrow`（`"text" | "more" | "none"`，默认 `"text"`）**：卡片纵向布局中哪一部分占据
  剩余空间。

### 外观

- **`width` / `height`（`string | number`，无默认值）**：卡片宽高。
- **`style`（`Vars`，无默认值）**：卡片根容器追加的内联样式。
- **`textSize`（`AspectSize`，默认 `"m"`）**：标题字号分级。
- **`textPadding`（`AspectSize`，默认 `"s"`）**：标题内边距分级。
- **`textAlign`（`CssAlignment`，默认 `"center"`）**：标题对齐。
- **`moreSize`（`AspectSize`，默认 `"s"`）**：扩展信息字号分级。
- **`morePadding`（`AspectSize`，默认 `"s"`）**：扩展信息内边距分级。
- **`moreAlign`（`CssAlignment`，默认 `"center"`）**：扩展信息对齐。

### 回调

本组件无此组参数。

### 嵌套

本组件未提供插槽；预览、标题、扩展信息、进度、标记全部由上述数据属性配置，内部由
`TiImage` / `TiTextSnippet` / `TiProgressBar` 组合，不支持通过 slot 替换。

### 事件

本组件无对外声明的 `emit` 事件。

> 本组件同时继承 `CommonProps`（`className`、`style`），字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)，本篇不再罗列。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单缩略图（`simple`）

**JSON 配置**

```json
{
  "width": 100,
  "preview": {
    "src": "https://picsum.photos/500",
    "objectFit": "cover",
    "height": 100
  },
  "text": "Gift For You"
}
```

**Vue 标签**

```xml
<TiThumb
  :width="100"
  :preview="{ src: 'https://picsum.photos/500', objectFit: 'cover', height: 100 }"
  text="Gift For You"
/>
```

### 彩色文本（`color-text`）

**JSON 配置**

```json
{
  "width": 100,
  "height": 200,
  "style": { "background": "yellow" },
  "preview": {
    "src": { "type": "font", "value": "zmdi-card-giftcard", "style": { "fontSize": "64px" } },
    "objectFit": "contain",
    "height": 100
  },
  "text": {
    "text": "Gift For You",
    "style": {
      "background": "red",
      "color": "white",
      "textShadow": "1px 1px 2px var(--ti-color-mask-heavy)"
    }
  }
}
```

**Vue 标签**

```xml
<TiThumb :width="100" :height="200" :style="{ background: 'yellow' }" :preview="{ src: { type: 'font', value: 'zmdi-card-giftcard', style: { fontSize: '64px' } }, objectFit: 'contain', height: 100 }" :text="{ text: 'Gift For You', style: { background: 'red', color: 'white', textShadow: '1px 1px 2px var(--ti-color-mask-heavy)' } }" />
```

### 多重指示标记（`multi-indicators`）

**JSON 配置**

```json
{
  "width": 120,
  "height": 200,
  "style": { "border": "1px dashed var(--ti-color-border-dark)" },
  "preview": {
    "src": { "type": "font", "value": "zmdi-bike", "style": { "fontSize": "64px" } },
    "objectFit": "contain",
    "height": 100
  },
  "text": "I like bike",
  "indicators": [
    { "position": "left-top", "type": "info", "icon": "zmdi-city", "text": "city" },
    { "position": "right-top", "type": "warn", "icon": "zmdi-cutlery" },
    { "position": "bottom-left", "type": "danger", "icon": "zmdi-fire" },
    { "position": "bottom-right", "type": "text", "icon": "zmdi-lock" },
    { "position": "center", "type": "primary", "icon": "zmdi-map" }
  ]
}
```

**Vue 标签**

```xml
<TiThumb
  :width="120"
  :height="200"
  :style="{ border: '1px dashed var(--ti-color-border-dark)' }"
  :preview="{ src: { type: 'font', value: 'zmdi-bike', style: { fontSize: '64px' } }, objectFit: 'contain', height: 100 }"
  text="I like bike"
  :indicators="[
    { position: 'left-top', type: 'info', icon: 'zmdi-city', text: 'city' },
    { position: 'right-top', type: 'warn', icon: 'zmdi-cutlery' },
    { position: 'bottom-left', type: 'danger', icon: 'zmdi-fire' },
    { position: 'bottom-right', type: 'text', icon: 'zmdi-lock' },
    { position: 'center', type: 'primary', icon: 'zmdi-map' }
  ]"
/>
```

### 带进度条（`in-progress`）

**JSON 配置**

```json
{
  "width": 120,
  "height": 200,
  "style": { "border": "1px dashed var(--ti-color-border-dark)" },
  "preview": {
    "src": { "type": "font", "value": "zmdi-bike", "style": { "fontSize": "64px" } },
    "objectFit": "contain",
    "height": 100
  },
  "text": "I like bike",
  "progress": { "value": 0.8, "trackStyle": { "height": "6px" } }
}
```

**Vue 标签**

```xml
<TiThumb
  :width="120"
  :height="200"
  :style="{ border: '1px dashed var(--ti-color-border-dark)' }"
  :preview="{ src: { type: 'font', value: 'zmdi-bike', style: { fontSize: '64px' } }, objectFit: 'contain', height: 100 }"
  text="I like bike"
  :progress="{ value: 0.8, trackStyle: { height: '6px' } }"
/>
```

## 总结

`TiThumb` 适合用一张卡片概览一个对象：商品、文件、用户、任务。它只做组合展示，不带点击、
选中、删除等交互；需要可上传、可预览、可删除的文件卡片，请改用 `TiUploadTile`；只需要
裸图不需要标题和标记时用 `TiImage`。

## 延伸阅读

- **源码入口**
  - `src/lib/tile/thumb/ti-thumb-index.ts` —— 注册表信息与示例配置。
  - `src/lib/tile/thumb/ti-thumb-types.ts` —— `ThumbProps`、`ThumbAspect`、`ThumbIndicator`。
  - `src/lib/tile/thumb/TiThumb.vue` —— 预览 / 标题 / 标记 / 进度的组合布局。
  - `src/lib/tile/thumb/use-thumb.ts` —— 文字片段构建与标记分位。
- **相关文档**
  - 图片预览：[ti-image](ti-image.md)。
  - 进度条：[ti-progress-bar](ti-progress-bar.md)。
  - 可上传文件块：[ti-upload-tile](ti-upload-tile.md)。
