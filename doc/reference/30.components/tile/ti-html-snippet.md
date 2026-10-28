---
title: TiHtmlSnippet HTML片段
keywords: [html, snippet, HTML片段, v-html, TiHtmlSnippet, 富文本, 事件委托, TILE]
status: draft
---

# TiHtmlSnippet HTML片段

## 介绍

`TiHtmlSnippet` 是小片类（`TILE`）的 HTML 片段展示控件：把一段 HTML 字符串直接插入当前
文档（`v-html`）里渲染，而不是像 `TiHtmlFrame` 那样另开 iframe。它适合展示自带结构、需要与
外层样式融合的一小段富文本，比如渲染好的公告片段、带链接的说明文字。

它还能通过 `listenners` 给片段内部的元素委托事件：声明选择器和事件名后，组件会在冒泡阶段
找到匹配元素，调用你的 `handler`，或把事件改写成一个具名事件向外抛出。

使用时需要注意：

- 内容直接以 `v-html` 插入当前文档，不做沙箱隔离；不可信的 HTML 有 XSS 风险。
- `content` 缺省时渲染占位文字 `<strong>HTML <em>snippet</em></strong>`。
- 事件委托只响应冒泡到根节点、且目标不是根节点自身的事件；`listenners` 按 `eventName`
  分组绑定。

源码目录：`src/lib/tile/html-snippet/`。

## 例子

### JSON 配置

```json
{
  "content": "<b>Hello <a href=\"#\">World</a></b>"
}
```

### Vue 标签调用

```xml
<TiHtmlSnippet content="<b>Hello <a href=\"#\">World</a></b>" />
```

## 控件参数

### 数据

- **`content`（`string | (() => string)`，无默认值）**：要渲染的 HTML 片段；传字符串直接
  插入，传函数则调用其返回值；缺省渲染占位文字。

### 行为

- **`listenners`（`HtmlSnippetListenner[]`，无默认值）**：片段内部元素的事件委托规则数组，
  每项字段：
  - **`selector`（`string | string[]`，必填）**：要监听的元素选择器，冒泡命中后代元素后
    向上匹配。
  - **`eventName`（`string`，必填）**：原生事件名，如 `click`。
  - **`emitName`（`string`，无默认值）**：命中后要向外 emit 的事件名。
  - **`emitPayload`（`any`，无默认值）**：向外 emit 时附带的数据，放在载荷的 `data` 字段。
  - **`handler`（`(emit, evt: Event) => void`，无默认值）**：命中后直接调用的自定义处理函数，
    可在函数内自行 `emit`。
  - **`setup`（`(el: HTMLElement) => void`，无默认值）**：内容渲染后对每个匹配元素做初始化。

### 外观

- **`styleSheet`（`CssSheet[] | string`，无默认值）**：追加到片段内部的样式；传字符串直接
  作为 CSS 文本，传 `CssSheet[]` 经 `renderCssStyleSheet` 渲染；统一包在一段 `<style>` 里
  插在内容之前。

### 回调

本组件无此组参数（`listenners` 的 `handler`、`setup` 属行为配置，见「行为」）。

### 嵌套

本组件未提供插槽，内容完全由 `content` 决定，不支持通过 slot 替换片段内部结构。

### 事件

- **`<emitName>`（自定义名）**：当 `listenners` 中某条规则命中 `selector` 且声明了
  `emitName` 时触发；载荷为 `{ event: 原生 Event, data: emitPayload }`。事件名由 `listenners`
  配置决定，组件本身不固定事件名。

> 本组件同时继承 `CommonProps`（`className`、`style`），`className` 与 `style` 都落到根
> 节点；字段含义见 [共享 Props](../../10.concepts/02-common-props.md)，本篇不再罗列。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单片段（`simple`）

**JSON 配置**

```json
{
  "content": "<b>Hello <a href=\"#\">World</a></b>"
}
```

**Vue 标签**

```xml
<TiHtmlSnippet content="<b>Hello <a href=\"#\">World</a></b>" />
```

## 总结

`TiHtmlSnippet` 适合在当前文档里渲染一小段可信 HTML 并与外层样式融合；需要对片段内元素
做交互时，用 `listenners` 委托事件，而不是自己包一层点击监听。如果 HTML 自带独立样式、需要
沙箱隔离，请改用 `TiHtmlFrame`；如果内容是纯文本、只需要超长折叠省略，改用 `TiTextSnippet`。
本组件不对 HTML 做转义，渲染不可信内容前需自行消毒。

## 延伸阅读

- **源码入口**
  - `src/lib/tile/html-snippet/html-snippet-index.ts` —— 注册表信息与示例配置。
  - `src/lib/tile/html-snippet/html-snippet-types.ts` —— `HtmlSnippetProps`、`HtmlSnippetEmitter`、`HtmlSnippetListenner`。
  - `src/lib/tile/html-snippet/TiHtmlSnippet.vue` —— `v-html` 渲染与样式注入。
  - `src/lib/tile/html-snippet/use-html-snippet-events.ts` —— 事件委托与元素初始化。
- **相关文档**
  - 样式隔离的整块 HTML：[ti-html-frame](ti-html-frame.md)。
  - 纯文本折叠展示：[TiTextSnippet 文字片段](./ti-text-snippet.md)。
