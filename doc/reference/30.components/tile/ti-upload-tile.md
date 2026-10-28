---
title: TiUploadTile 上传贴片
keywords: [上传, upload, upload-tile, TiUploadTile, 文件卡片, 缩略图上传, 拖拽, TILE]
status: draft
---

# TiUploadTile 上传贴片

## 介绍

`TiUploadTile` 是小片类（`TILE`）的卡片式上传块：在一个带边框的方形贴片里，用 `TiThumb`
展示大缩略图和文字，底下挂竖向排列的操作按钮。它适合做头像上传、商品图上传、图片附件等
"大方块"上传位。

和 `TiUploadBar` 一样，它只是交互外壳：选 / 拖到文件后 `emit("upload", file)`，进度由外层
回写 `progress.value`，真正的上传在外层完成。

使用时需要注意：

- 默认尺寸 `100px × 100px`，默认内置上传与清除按钮都开启。
- 是否上传中由 `progress.value > 0` 推断；空值时可用 `placeholder` 指定占位贴片内容。
- 缩略图预览缺省用 `zmdi-plus` 加号图标作为占位。

源码目录：`src/lib/tile/upload/tile/`。

## 例子

### JSON 配置

```json
{
  "preview": { "src": { "type": "font", "value": "fas-briefcase" } },
  "text": "Gift For You"
}
```

### Vue 标签调用

```xml
<TiUploadTile
  :preview="{ src: { type: 'font', value: 'fas-briefcase' } }"
  text="Gift For You"
  @upload="onUpload"
/>
```

## 控件参数

### 数据

- **`preview`（`ImageProps`，无默认值）**：缩略图预览配置；缺省占位图标 `zmdi-plus`。
- **`progress`（`ProgressBarProps`，无默认值）**：上传进度；其 `value` 驱动上传态与按钮切换。
- **`text`（`string | TextSnippetProps`，无默认值）**：缩略图下方文字；缺省 `i18n:nil-obj`。
- **`tip`（`string`，无默认值）**：预览区悬浮提示。
- **`nilValue`（`boolean`，无默认值）**：是否按空值渲染。
- **`placeholder`（`ThumbProps`，无默认值）**：空值时整个贴片的占位配置，作为默认值合并进
  内部 `TiThumb`。

### 行为

- **`readonly`（`boolean`，无默认值）**：只读态，不响应上传相关动作。
- **`uploadButton`（`ActionBarItemInfo | boolean`，默认 `true`）**：内置上传按钮。
- **`clearButton`（`ActionBarItemInfo | boolean`，默认 `true`）**：内置清除按钮。
- **`actions`（`ActionBarItem[]`，无默认值）**：自定义动作项；未命中内置动作名的按钮通过
  `fire` 抛出。
- **`actionBar`（`Omit<ActionBarProps, "items">`，无默认值）**：动作条整体布局配置。
- **`accept`（`string`，无默认值）**：选文件对话框 `accept` 过滤。
- **`multi`（`boolean`，无默认值）**：是否允许多选（实际只取第一个发出）。
- **`canEmptyChooseFile`（`boolean`，无默认值）**：空值时是否允许选择已上传文件。
- **`canReplace`（`boolean`，无默认值）**：已有文件时是否允许再选 / 拖入替换。

### 外观

- **`type`（`LogicType`，无默认值）**：状态色，驱动边框 / 文字 / 背景配色。
- **`width`（`string | number`，默认 `"100px"`）**：贴片宽度。
- **`height`（`string | number`，默认 `"100px"`）**：贴片高度。
- **`style`（`Vars`，无默认值）**：根容器追加的内联样式。
- **`textSize`（`AspectSize`，默认 `"s"`）**：文字字号分级。
- **`textPadding`（`AspectSize`，默认 `"s"`）**：文字内边距分级。
- **`textAlign`（`CssAlignment`，默认 `"center"`）**：文字对齐。
- **`boxRadius`（`AspectSize`，默认 `"s"`）**：贴片圆角分级。
- **`thumbStyle`（`Vars`，无默认值）**：内部 `TiThumb` 的自定义样式。
- **`borderStyle`（`CssBorderStyle`，默认 `"solid"`）**：贴片边框样式。
- **`borderWidth`（`string | number`，无默认值）**：贴片边框宽度。

### 回调

本组件无此组参数。

### 嵌套

本组件未提供插槽；缩略图、文字、动作条全部由上述属性配置，内部由 `TiThumb` + `TiActionBar`
组合，不支持通过 slot 替换。

### 事件

- **`upload`**：选文件或拖入文件后触发，载荷为选中的第一个 `File`；真正上传由外层执行。
- **`clear`**：点击清除按钮时触发，无载荷。
- **`stop-upload`**：上传中点击"停止"时触发，无载荷。
- **`choose-file`**：`canEmptyChooseFile` 时点击选择按钮触发，无载荷。
- **`fire`**：`actions` 里自定义按钮触发时冒泡，载荷为 `ActionBarEvent.payload`。

> 本组件同时继承 `CommonProps`（`className`、`style`），字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)，本篇不再罗列。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单上传贴片（`simple`）

**JSON 配置**

```json
{
  "preview": { "src": { "type": "font", "value": "fas-briefcase" } },
  "text": "Gift For You",
  "actions": [
    { "text": "i18n:open", "action": "open" }
  ],
  "width": "140px",
  "height": "200px"
}
```

**Vue 标签**

```xml
<TiUploadTile
  :preview="{ src: { type: 'font', value: 'fas-briefcase' } }"
  text="Gift For You"
  :actions="[{ text: 'i18n:open', action: 'open' }]"
  width="140px"
  height="200px"
/>
```

### 带进度条（`in-progress`）

**JSON 配置**

```json
{
  "preview": { "src": { "type": "font", "value": "far-file-zipper" } },
  "text": "Hello My Document",
  "progress": { "value": 0.64 },
  "width": "200px",
  "height": "150px"
}
```

**Vue 标签**

```xml
<TiUploadTile
  :preview="{ src: { type: 'font', value: 'far-file-zipper' } }"
  text="Hello My Document"
  :progress="{ value: 0.64 }"
  width="200px"
  height="150px"
/>
```

### 空值贴片（`nil`）

**JSON 配置**

```json
{
  "preview": { "src": { "type": "font", "value": "fas-hands-holding-child" } },
  "text": "Empty Bar",
  "nilValue": true,
  "placeholder": { "text": "hahaha" }
}
```

**Vue 标签**

```xml
<TiUploadTile
  :preview="{ src: { type: 'font', value: 'fas-hands-holding-child' } }"
  text="Empty Bar"
  :nil-value="true"
  :placeholder="{ text: 'hahaha' }"
/>
```

## 总结

`TiUploadTile` 适合网格状、大缩略图的上传位：头像、商品主图、图片附件。它只负责选 / 拖 /
停 / 清的事件外壳，进度与上传在外层；横向一行式的文件条目请用 `TiUploadBar`；只读卡片概览
用 `TiThumb`。空占位的视觉通过 `placeholder`（`ThumbProps`）定制。

## 延伸阅读

- **源码入口**
  - `src/lib/tile/upload/tile/ti-upload-tile-index.ts` —— 注册表信息与示例配置。
  - `src/lib/tile/upload/tile/ti-upload-tile-types.ts` —— `UploadTileProps`、`UploadTileEmitter`。
  - `src/lib/tile/upload/tile/TiUploadTile.vue` —— 贴片布局与竖向动作条。
  - `src/lib/tile/upload/tile/use-upload-tile.ts` —— `TiThumb` 与动作条组装。
  - `src/lib/tile/upload/_support/use-uploader.ts` —— 动作分发、拖放与共享上传逻辑。
- **相关文档**
  - 横向上传条：[ti-upload-bar](ti-upload-bar.md)。
  - 缩略图：[ti-thumb](ti-thumb.md)。
  - 动作条：[TiActionBar 动作条](../action/ti-action-bar.md)。
