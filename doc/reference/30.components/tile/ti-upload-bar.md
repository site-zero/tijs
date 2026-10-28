---
title: TiUploadBar 上传条
keywords: [上传, upload, upload-bar, TiUploadBar, 文件上传, 进度, 拖拽, TILE]
status: draft
---

# TiUploadBar 上传条

## 介绍

`TiUploadBar` 是小片类（`TILE`）的横向上传条目：左边一个文件图标预览、中间文字说明、
右边一组操作按钮，底下可压一条上传进度条。它是"一个文件位"的完整交互外壳——点击按钮选文件、
把文件拖进来、上传中停止、上传后清除，这些动作都由组件抛出事件，真正的上传由外层接事件后
执行。

它本身不发起 HTTP 上传：选 / 拖到文件后只 `emit("upload", file)`，进度靠外层回写
`progress.value`。

使用时需要注意：

- 是否在上传中由 `progress.value > 0` 推断，此时按钮区切换为"停止"。
- 默认 `nilValue` 为 `false`；`canReplace` 未开启时已有文件不能再拖入替换。
- 前缀图标默认在悬浮时变成"清除"按钮；`prefixForClean` 可改由 `actions` 自定义清除入口。

源码目录：`src/lib/tile/upload/bar/`。

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
<TiUploadBar
  :preview="{ src: { type: 'font', value: 'fas-briefcase' } }"
  text="Gift For You"
  @upload="onUpload"
/>
```

## 控件参数

### 数据

- **`preview`（`ImageProps`，无默认值）**：左侧文件预览配置；缺省用文件类型图标 `far-file`。
- **`progress`（`ProgressBarProps`，无默认值）**：底部进度条；其 `value` 同时驱动"是否上传中"
  与按钮区切换。
- **`text`（`string | TextSnippetProps`，无默认值）**：中间说明文字；字符串简写或完整文字片段
  配置。
- **`tip`（`string`，无默认值）**：左侧预览区的悬浮提示（写到 `title`）。
- **`nilValue`（`boolean`，无默认值）**：是否按空值渲染。
- **`placeholder`（`string`，无默认值）**：未指定 `text` 时的占位文字，缺省 `i18n:nil-obj`。

### 行为

- **`readonly`（`boolean`，无默认值）**：只读态；不渲染动作条、不挂载拖放。
- **`uploadButton`（`ActionBarItemInfo | boolean`，默认 `true`）**：内置上传按钮；传对象可
  覆盖图标 / 文字。
- **`clearButton`（`ActionBarItemInfo | boolean`，默认 `false`）**：内置清除按钮。
- **`actions`（`ActionBarItem[]`，无默认值）**：自定义动作项，追加在内置按钮之后；未命中内置
  动作名的按钮会通过 `fire` 抛出。
- **`actionBar`（`Omit<ActionBarProps, "items">`，无默认值）**：动作条整体布局配置。
- **`accept`（`string`，无默认值）**：选文件对话框的 `accept` 过滤。
- **`multi`（`boolean`，无默认值）**：是否允许多选文件（实际只取第一个发出）。
- **`canEmptyChooseFile`（`boolean`，无默认值）**：空值时左侧按钮是否变成"选择已上传文件"。
- **`canReplace`（`boolean`，无默认值）**：已有文件时是否允许再选 / 拖入替换。
- **`prefixForClean`（`"no" | "yes"`，无默认值）**：是否启用前缀悬浮清除；缺省随
  `!clearButton` 自动决定。

### 外观

- **`type`（`LogicType`，无默认值）**：状态色，驱动进度条、按钮与边框配色。
- **`width` / `height`（`string | number`，无默认值）**：内容区宽高。
- **`style`（`Vars`，无默认值）**：根容器追加的内联样式。
- **`textSize`（`AspectSize`，默认 `"s"`）**：文字字号分级。
- **`textPadding`（`AspectSize`，默认 `"s"`）**：内边距分级。
- **`textAlign`（`CssAlignment`，默认 `"center"`）**：文字对齐。
- **`boxRadius`（`AspectSize`，默认 `"s"`）**：圆角分级。
- **`conStyle`（`Vars`，无默认值）**：内层内容容器追加的内联样式。
- **`conClass`（`any`，无默认值）**：内层内容容器追加的样式类。

### 回调

本组件无此组参数。

### 嵌套

本组件未提供插槽；预览、文字、动作条、进度全部由上述属性配置，内部由 `TiImage` /
`TiTextSnippet` / `TiActionBar` / `TiProgressBar` 组合，不支持通过 slot 替换。

### 事件

- **`upload`**：选文件或拖入文件后触发，载荷为选中的第一个 `File`；真正上传由外层执行。
- **`clear`**：点击清除（前缀清除或清除按钮）时触发，无载荷。
- **`stop-upload`**：上传中点击"停止"按钮时触发，无载荷。
- **`choose-file`**：`canEmptyChooseFile` 时空值下点击左侧"选择"按钮触发，无载荷。
- **`fire`**：`actions` 里自定义按钮触发时冒泡，载荷为 `ActionBarEvent.payload`。

> 本组件同时继承 `CommonProps`（`className`、`style`），字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)，本篇不再罗列。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单上传条（`simple`）

**JSON 配置**

```json
{
  "preview": { "src": { "type": "font", "value": "fas-briefcase" } },
  "text": "Gift For You",
  "actions": [
    { "text": "i18n:open", "action": "open" }
  ]
}
```

**Vue 标签**

```xml
<TiUploadBar
  :preview="{ src: { type: 'font', value: 'fas-briefcase' } }"
  text="Gift For You"
  :actions="[{ text: 'i18n:open', action: 'open' }]"
/>
```

### 带进度条（`in-progress`）

**JSON 配置**

```json
{
  "preview": { "src": { "type": "font", "value": "far-file-zipper" } },
  "text": "Hello My Document",
  "progress": { "value": 0.64 }
}
```

**Vue 标签**

```xml
<TiUploadBar
  :preview="{ src: { type: 'font', value: 'far-file-zipper' } }"
  text="Hello My Document"
  :progress="{ value: 0.64 }"
/>
```

### 空值上传条（`nil`）

**JSON 配置**

```json
{
  "preview": { "src": { "type": "font", "value": "fas-hands-holding-child" } },
  "text": "Empty Bar",
  "nilValue": true
}
```

**Vue 标签**

```xml
<TiUploadBar
  :preview="{ src: { type: 'font', value: 'fas-hands-holding-child' } }"
  text="Empty Bar"
  :nil-value="true"
/>
```

## 总结

`TiUploadBar` 适合在表单、详情页里横向展示"一个文件上传位"：单文件附件、头像待上传、
文档替换。它只负责选 / 拖 / 停 / 清的事件外壳，进度和实际上传逻辑在外层。需要网格状、带大
缩略图的文件卡片，请改用 `TiUploadTile`；只读展示一个文件预览用 `TiThumb` / `TiImage`。

## 延伸阅读

- **源码入口**
  - `src/lib/tile/upload/bar/ti-upload-bar-index.ts` —— 注册表信息与示例配置。
  - `src/lib/tile/upload/bar/ti-upload-bar-types.ts` —— `UploadBarProps`、`UploadBarEmitter`。
  - `src/lib/tile/upload/bar/TiUploadBar.vue` —— 横向布局、前缀清除与动作条。
  - `src/lib/tile/upload/bar/use-upload-bar.ts` —— 文字、预览、动作条与上传态计算。
  - `src/lib/tile/upload/_support/use-uploader.ts` —— 动作分发、拖放与共享上传逻辑。
- **相关文档**
  - 卡片式上传块：[ti-upload-tile](ti-upload-tile.md)。
  - 进度条：[ti-progress-bar](ti-progress-bar.md)。
  - 动作条：[TiActionBar 动作条](../action/ti-action-bar.md)。
