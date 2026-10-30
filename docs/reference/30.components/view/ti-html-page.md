---
title: TiHtmlPage HTML页面
keywords: [html, htmlpage, TiHtmlPage, 页面, 模板渲染, 动态组件, 视图]
status: draft
---

# TiHtmlPage HTML页面

## 介绍

`TiHtmlPage` 是视图类（`VIEW`）的原始 HTML / Vue 模板渲染容器。它接收一段字符串形式的
模板，用 Vue 的 `compile` 编译成渲染函数后直接挂载——因此这段内容不只是静态 HTML，还可以
在里面写 Vue 指令、引用已经全局注册的 TiJS 组件（如 `<ti-icon>`、`<ti-roadblock>`）。

使用时需要注意：

- `content` 为空时会渲染一个默认的占位 `<article>No Conetnt</article>`（源码原文拼写
  `Conetnt`）。
- 因为是编译后直接渲染，`content` 里写什么就执行什么，**不要传入不可信的第三方 HTML**，
  存在脚本注入风险。
- 组件本身没有状态、没有事件，纯展示；要交互请在模板内部使用已注册的组件。

源码目录：`src/lib/view/html-page/`。

## 例子

### JSON 配置

```json
{
  "content": "<article><h1>这是一个测试页面</h1><ti-icon value=\"zmdi-cocktail\"/></article>"
}
```

### Vue 标签调用

```xml
<TiHtmlPage :content="pageTemplate" />
```

## 控件参数

### 数据

- **`content`（`string`，无默认值）**：要渲染的 HTML / Vue 模板字符串；为空时渲染默认
  占位 `<article>No Conetnt</article>`。模板内可使用全局已注册组件与 Vue 语法。

### 行为

本组件无此组参数。

### 外观

- **`style`（`Vars`，无默认值）**：外层 `.ti-html-page` 容器的内联样式。
- **`className`（`any`，无默认值）**：外层容器的附加类名。

### 回调

本组件无此组参数。

### 嵌套

本组件未提供插槽；内容完全由 `content` 模板决定，不通过 slot 注入。

### 事件

本组件无对外声明的标准 `emit` 事件。

> 本组件同时继承 `CommonProps`（`className`、`style`），字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)，本篇不再罗列。

## 更多例子

### 简单页面（`simple`）

**JSON 配置**

```json
{
  "content": "\n<article>\n  <h1>这是一个测试页面</h1>\n  <hr />\n  <blockquote>可以插入很多元素</blockquote>\n  <hr>\n  而且可以自持插入动态Vue组件\n  <ti-icon :value=\"'zmdi-cocktail'\"/>\n  <div class=\"zozoh\">\n    <ti-roadblock text=\"hello\" icon=\"zmdi-cake\"/> \n  </div>\n</article>"
}
```

**Vue 标签**

```xml
<TiHtmlPage :content="pageTemplate" />
```

> 示例模板里引用了 `<ti-icon>`、`<ti-roadblock>`，这些组件必须在应用中全局注册后才能
> 正常渲染。

## 总结

`TiHtmlPage` 适合把后端或配置下发的富文本 / Vue 片段直接渲染出来：协议说明页、动态表单
说明、内嵌示例。内容可控、结构简单时用它；如果内容只是一段纯文本，用 `TiTextSnippet`
更轻；如果需要复杂交互与状态，应写成正式组件而不是塞模板字符串。

## 延伸阅读

- **源码入口**
  - `src/lib/view/html-page/html-page-index.ts` —— 注册表信息与示例配置。
  - `src/lib/view/html-page/html-page-types.ts` —— `HtmlPageProps`。
  - `src/lib/view/html-page/TiHtmlPage.vue` —— 外层容器。
  - `src/lib/view/html-page/render-page.ts` —— `compile` + `h` 动态渲染。
- **相关文档**
  - 组件注册与动态渲染机制：[组件模型](../../10.concepts/01-component-model.md)。
  - 纯文本片段展示：[TiTextSnippet 文字片段](../tile/ti-text-snippet.md)。
