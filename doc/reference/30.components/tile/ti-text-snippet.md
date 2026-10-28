---
title: TiTextSnippet 文字片段
keywords: [文字, 文本, snippet, text, TiTextSnippet, 前缀图标, 动态文本, TILE]
status: draft
---

# TiTextSnippet 文字片段

## 介绍

`TiTextSnippet` 是小片类（`TILE`）的文字展示件，在一个可指定标签名的容器里渲染一段文字，
文字前后可挂图标。它是最基础的"一行说明文字"控件，常被嵌在面包屑头 / 尾、卡片标题、字段
旁注里。

文字本身可以是纯文本，也可以是 `html` 片段（按 `v-html` 插入）；`dynamic` 开启后还会把
文字当模板，用 `vars` 做变量替换。除了渲染文字，它也能通过 `comType` 换成任意注册组件来
显示——这是它比 `<span>` 更灵活的地方。

使用时需要注意：

- 根元素标签由 `tagName` 决定，默认 `div`；`attrs` / `props` 会按约定前缀（`^` / `.`）
  落到根元素上。
- `textType: "html"` 时文字按 HTML 插入，不可信内容有 XSS 风险。
- 声明 `comType` 后进入定制渲染模式，不再渲染自带的文字与图标。

源码目录：`src/lib/tile/text-snippet/`。

## 例子

### JSON 配置

```json
{
  "text": "Hello"
}
```

### Vue 标签调用

```xml
<TiTextSnippet text="Hello" />
```

## 控件参数

### 数据

- **`text`（`string`，无默认值）**：要显示的文字内容；按 `autoI18n` 做语言解析，按
  `dynamic` 做模板变量替换。
- **`textType`（`TextContentType`，无默认值）**：`"text"` 按纯文本插值，`"html"` 按
  `v-html` 插入。
- **`autoI18n`（`boolean`，无默认值）**：是否对 `text` 做 `i18n:` 前缀解析。
- **`vars`（`Vars`，无默认值）**：`dynamic` 模板渲染的变量上下文，也作为定制组件的解释
  上下文。
- **`ctrlTip`（`string`，无默认值）**：`Ctrl` 组合键提示内容，写到根元素 `data-tip`。
- **`prefixTip` / `suffixTip`（`string`，无默认值）**：前 / 后缀图标的悬浮提示。

### 行为

- **`dynamic`（`boolean`，无默认值）**：开启后把 `text` 当模板字符串，用 `vars` 上下文执行
  `Tmpl.exec` 变量替换。
- **`events`（`Record<string, EmitAdaptor>`，无默认值）**：事件适配表，把内部定制组件的事件
  按配置改名 / 改载荷后再向外转发；规则见 [事件绑定](../../10.concepts/03-event-binding.md)。
- **`autoValue`（`string | null`，默认 `"value"`）**：定制渲染时，指定把值绑到组件的哪个
  属性；传 `null` 不自动绑值。

### 外观

- **`tagName`（`string`，默认 `"div"`）**：根元素标签名。
- **`className`（`any`，无默认值）**：根元素样式类。
- **`style`（`Vars`，无默认值）**：根元素内联样式。
- **`textStyle`（`Vars`，无默认值）**：文字部分追加的内联样式。
- **`attrs`（`Vars`，无默认值）**：追加到根元素的属性表（自动补 `^` 前缀）。
- **`props`（`Vars`，无默认值）**：追加到根元素的 property 表（自动补 `.` 前缀）。
- **`logicType`（`LogicType`，无默认值）**：前 / 后缀图标的状态色。
- **`prefixIcon`（`IconInput`，无默认值）**：文字前缀图标。
- **`suffixIcon`（`IconInput`，无默认值）**：文字后缀图标。

### 回调

本组件无此组参数。

### 嵌套

- **`comType` + `comConf`**（来自 `FieldComProps`）：声明后进入定制渲染模式，用
  `useFieldCom` 动态解析出的组件替换默认文字 + 图标结构；不再提供用户插槽。

### 事件

- **`<适配后的事件名>`**：通过 `events` 事件适配表转发；载荷由适配配置决定（见「行为」）。

> 本组件同时继承 `CommonProps` 相关字段，含义见
> [共享 Props](../../10.concepts/02-common-props.md)，本篇不再罗列。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单文字（`simple`）

**JSON 配置**

```json
{
  "text": "Hello"
}
```

**Vue 标签**

```xml
<TiTextSnippet text="Hello" />
```

## 总结

`TiTextSnippet` 适合在任意位置放一行带前后图标、可做模板替换的说明文字，常作为其他控件的
头 / 尾片段或容器装饰。需要把整段 HTML 当独立沙箱展示时用 `TiHtmlFrame`，需要事件委托的
HTML 片段用 `TiHtmlSnippet`，需要带状态色块的单值回显用 `TiLabel`。`textType: "html"` 不做
转义，渲染不可信内容前需自行消毒。

## 延伸阅读

- **源码入口**
  - `src/lib/tile/text-snippet/text-snippet-index.ts` —— 注册表信息与示例配置。
  - `src/lib/tile/text-snippet/text-snippet-types.ts` —— `TextSnippetProps`、`TextSnippetEmitter`。
  - `src/lib/tile/text-snippet/TiTextSnippet.vue` —— 动态标签与前后图标渲染。
  - `src/lib/tile/text-snippet/use-text-snippet.ts` —— 文本解析、模板替换与定制组件解析。
- **相关文档**
  - 带状态色块的单值：[ti-label](ti-label.md)。
  - HTML 片段 / 沙箱：[ti-html-snippet](ti-html-snippet.md)、[ti-html-frame](ti-html-frame.md)。
  - 事件回写规则：[事件绑定](../../10.concepts/03-event-binding.md)。
