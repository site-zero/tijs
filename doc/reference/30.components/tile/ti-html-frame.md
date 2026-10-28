---
title: TiHtmlFrame HTML框架
keywords: [html, iframe, frame, TiHtmlFrame, HTML渲染, 富文本, 内嵌网页, TILE]
status: draft
---

# TiHtmlFrame HTML框架

## 介绍

`TiHtmlFrame` 是小片类（`TILE`）的内嵌 HTML 框架，用来把一段 HTML 文档内容原样塞进一个
沙箱 `<iframe>` 里展示。它适合渲染富文本邮件、独立样式的报表片段、第三方生成的 HTML
报告等——这些内容自带样式，不想污染外层页面时，用 iframe 把它隔离在自己的文档里。

它不解析、不转义 HTML；`value` 就是一段 HTML 字符串，组件在 iframe 加载完成后把它写到
`iframe.contentDocument.body.innerHTML`。

使用时需要注意：

- 组件根节点是 `inheritAttrs: false`，外部透传的普通属性不会自动落到外层 `<div>` 上。
- 内容在 iframe 的 `load` 事件后才写入；`value` 变化时会重新写入，空值用 `&nbsp;` 占位。
- 渲染在独立文档里，外层 CSS 不会渗透进去，外层也不会继承 iframe 内的样式；需要给内容
  加样式时，请把样式写进 `value` 自带的 `<style>` 里。

源码目录：`src/lib/tile/html-frame/`。

## 例子

### JSON 配置

```json
{
  "value": "<h1>Heading</h1><ul><li>item 1</li><li>item 2</li></ul>"
}
```

### Vue 标签调用

```xml
<TiHtmlFrame value="<h1>Heading</h1><ul><li>item 1</li><li>item 2</li></ul>" />
```

## 控件参数

### 数据

- **`value`（`string`，无默认值）**：要渲染进 iframe 文档主体的 HTML 字符串；组件把它写到
  `contentDocument.body.innerHTML`，空值写 `&nbsp;` 占位。

### 行为

本组件无此组参数。

### 外观

- **`frameClass`（`any`，无默认值）**：追加到内部 `<iframe>` 元素上的样式类。
- **`frameStyle`（`Vars`，无默认值）**：追加到内部 `<iframe>` 元素上的内联样式。

### 回调

本组件无此组参数。

### 嵌套

本组件未提供插槽，内容完全由 `value` 决定，不支持通过 slot 替换 iframe 内部结构。

### 事件

- **`change`**：`TiHtmlFrameEmitter` 中已声明该事件；当前版本视图未真正 `emit`，保留备用。

> 本组件同时继承 `CommonProps`（`className`、`style`），`className` 落到外层容器、`style`
> 也落到外层容器；字段含义见 [共享 Props](../../10.concepts/02-common-props.md)，本篇不再罗列。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单 HTML 片段（`simple`）

**JSON 配置**

```json
{
  "value": "<h1>Heading</h1><ul><li>item 1</li><li>item 2</li></ul>"
}
```

**Vue 标签**

```xml
<TiHtmlFrame value="<h1>Heading</h1><ul><li>item 1</li><li>item 2</li></ul>" />
```

## 总结

`TiHtmlFrame` 适合需要样式隔离的整块 HTML 展示：邮件正文、独立报表片段、第三方富文本输出。
如果只是渲染一小段不带独立样式的 HTML 字符串，`TiHtmlSnippet` 直接在当前文档里插入即可，
不必开 iframe；如果渲染的是纯文本需要省略号折叠，改用 `TiTextSnippet`。iframe 内外通信、
脚本交互当前版本均未提供，跨窗口传值需自行在外部处理。

## 延伸阅读

- **源码入口**
  - `src/lib/tile/html-frame/ti-html-frame-index.ts` —— 注册表信息与示例配置。
  - `src/lib/tile/html-frame/ti-html-frame-types.ts` —— `TiHtmlFrameProps`、`TiHtmlFrameEmitter`。
  - `src/lib/tile/html-frame/TiHtmlFrame.vue` —— iframe 加载与内容写入逻辑。
- **相关文档**
  - 当前文档内直接插入 HTML 片段：[TiHtmlSnippet HTML片段](./ti-html-snippet.md)。
  - 纯文本折叠展示：[TiTextSnippet 文字片段](./ti-text-snippet.md)。
