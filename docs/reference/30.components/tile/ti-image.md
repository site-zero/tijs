---
title: TiImage 图像
keywords: [图像, 图片, image, img, TiImage, svg, 拖拽文件, object-fit, TILE]
status: draft
---

# TiImage 图像

## 介绍

`TiImage` 是小片类（`TILE`）的图片展示控件，把一个图像源渲染成 `<img>`，并在加载期间
显示转圈图标。它比裸 `<img>` 多三件事：源可以是地址、本地 `File` 或图标对象；没有源时回退
到默认占位图标；开启 `canDropFile` 后可以把本地文件拖进来直接预览。

它不负责上传：拖入本地文件只是把它显示出来，并通过 `change` 把 `File` 交给外层，真正的
上传要外层自己接。

使用时需要注意：

- 源的优先级：拖入的本地文件 > `src` > `dftSrc` > 默认占位图标 `zmdi-image-o`。
- 拖入的本地图片会读成 base64 预览；非图片文件则按扩展名 / MIME 选一个文件类型图标代替。
- `canDropFile` 类型注释写的是默认 `true`，但当前代码 `withDefaults` 实际设为 `false`，
  需要显式开启才能拖放。

源码目录：`src/lib/tile/image/`。

## 例子

### JSON 配置

```json
{
  "src": "https://picsum.photos/200",
  "width": 200,
  "height": 120,
  "objectFit": "cover"
}
```

### Vue 标签调用

```xml
<TiImage src="https://picsum.photos/200" :width="200" :height="120" object-fit="cover" />
```

## 控件参数

### 数据

- **`src`（`ImageSrcInput`，无默认值）**：图像源；可为图片地址字符串、本地 `File`、或图标
  对象 `IconObj`。
- **`dftSrc`（`string | IconObj`，无默认值）**：未指定 `src` 时显示的默认图；再缺省则用
  内置占位图标 `zmdi-image-o`。

### 行为

- **`canDropFile`（`boolean`，默认 `false`）**：是否允许把本地文件拖到控件上预览；开启后
  拖入文件触发 `change`。

### 外观

- **`width` / `height`（`number | string`，无默认值）**：容器宽高。
- **`iconFontSize`（`string`，无默认值）**：以图标形式展示时的字号，缺省 `64px`。
- **`objectFit`（`CssObjectFit`，无默认值）**：对应 `<img>` 的 `object-fit`。
- **`borderRadius`（`AspectSize`，无默认值）**：圆角分级，渲染为 `r-<分级>` 类。
- **`style`（`Vars`，无默认值）**：容器追加的内联样式。
- **`imgStyle`（`Vars`，无默认值）**：`<img>` 追加的内联样式。

### 回调

本组件无此组参数。

### 嵌套

本组件未提供插槽，图片内容完全由 `src` / `dftSrc` 决定，不支持通过 slot 替换内部结构。

### 事件

- **`change`**：`canDropFile` 开启并拖入本地文件时触发，载荷为拖入的第一个 `File`。

> 本组件同时继承 `CommonProps`（`className`、`style`），`className` 会叠加 `drag-enter`、
  `is-loading`、`r-<圆角>` 等状态类；字段含义见
  [共享 Props](../../10.concepts/02-common-props.md)，本篇不再罗列。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单图片（`simple`）

**JSON 配置**

```json
{
  "src": "https://picsum.photos/200",
  "width": 200,
  "height": 120,
  "objectFit": "cover",
  "borderRadius": "b"
}
```

**Vue 标签**

```xml
<TiImage
  src="https://picsum.photos/200"
  :width="200"
  :height="120"
  object-fit="cover"
  border-radius="b"
/>
```

### SVG（`svg`）

**JSON 配置**

```json
{
  "src": "/dna.svg"
}
```

**Vue 标签**

```xml
<TiImage src="/dna.svg" />
```

### 字体图标（`icon`）

**JSON 配置**

```json
{
  "src": {
    "type": "font",
    "value": "zmdi-flower-alt",
    "style": {
      "fontSize": "64px",
      "color": "red"
    }
  }
}
```

**Vue 标签**

```xml
<TiImage
  :src="{
    type: 'font',
    value: 'zmdi-flower-alt',
    style: { fontSize: '64px', color: 'red' }
  }"
/>
```

### 任意文件图标（`any`）

**JSON 配置**

```json
{
  "src": {
    "type": "font",
    "value": "zmdi-evernote",
    "style": { "fontSize": "64px" }
  }
}
```

**Vue 标签**

```xml
<TiImage
  :src="{
    type: 'font',
    value: 'zmdi-evernote',
    style: { fontSize: '64px' }
  }"
/>
```

### 本地拖放（`local-any`）

**JSON 配置**

```json
{
  "canDropFile": true,
  "objectFit": "contain",
  "style": { "width": "100px", "height": "100px" },
  "imgStyle": { "backgroundColor": "#c0c0c0", "objectPosition": "center" }
}
```

**Vue 标签**

```xml
<TiImage
  :can-drop-file="true"
  object-fit="contain"
  :style="{ width: '100px', height: '100px' }"
  :img-style="{ backgroundColor: '#c0c0c0', objectPosition: 'center' }"
/>
```

## 总结

`TiImage` 适合在卡片、列表、缩略位里展示单张图片或文件图标，并可选支持本地拖放预览。它只
预览不上传，需要带进度、带删除、可点击上传的完整文件展示，请改用 `TiUploadBar` /
`TiUploadTile`；只渲染一个字体图标不必走图片逻辑，直接用 `TiIcon` 更轻。

## 延伸阅读

- **源码入口**
  - `src/lib/tile/image/ti-image-index.ts` —— 注册表信息与示例配置。
  - `src/lib/tile/image/ti-image-types.ts` —— `ImageProps`、`ImageSrcInput`。
  - `src/lib/tile/image/TiImage.vue` —— 视图、拖放与加载态。
  - `src/lib/tile/image/use-image.ts` —— 源归一化、本地文件转 base64、文件类型图标。
- **相关文档**
  - 图标渲染：[ti-icon](ti-icon.md)。
  - 上传条 / 上传块：[ti-upload-bar](ti-upload-bar.md)、[ti-upload-tile](ti-upload-tile.md)。
  - 拖拽行为 hook：`src/lib/_features/use-dropping.ts`。
