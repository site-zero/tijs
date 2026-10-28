---
title: TiEditRich 富文本编辑
keywords: [富文本, rich editor, TiEditRich, TiEditRichProse, prosemirror, 文档编辑, WYSIWYG, EDIT]
status: draft
---

# TiEditRich 富文本编辑

## 介绍

`TiEditRich` 是编辑类（`EDIT`）的所见即所得富文本编辑器，注册名对外为 `TiEditRich`，
底层基于 ProseMirror 实现（实现目录 `rich/prose/`，注册表信息类为 `TiEditRichProseInfo`）。
它带工具条、文档结构树导航、正文编辑区与脚注区，内置标题、加粗 / 斜体 / 下划线、段落、
分隔线、表格等节点与标记，输出内容可以按 JSON、HTML 或 Markdown 三种形态序列化。

它适合写文章、写富文本说明、带结构化文档树的长文本编辑；只需要存一段代码或纯文本时，
用 `TiCodeEditor` 或 `TiInputMultiLines` 更轻。

使用时需要注意：

- 该组件注册表打了 `tags: ['ing']` 标记，仍在建设中：当前挂载后外部 `value` 变化的回灌
  逻辑在视图里被注释掉了，**仅初始化时读取一次 `value`**，后续父组件改值不会同步进编辑器。
- 内容以 `change` 事件抛出，载荷形态由 `contentType` 决定。
- 工具条、节点与标记都可以通过 `plugins` 扩展。

源码目录：`src/lib/edit/rich/prose/`。

## 例子

### JSON 配置

```json
{
  "contentType": "html",
  "plugins": ["image"]
}
```

### Vue 标签调用

```xml
<TiEditRich
  content-type="html"
  :value="docHtml"
  @change="onDocChange"
/>
```

## 控件参数

### 数据

- **`value`（`string`，无默认值）**：初始文档内容，按 `contentType` 对应的格式传入；仅在
  组件挂载时解析一次（当前版本后续变化不回灌）。
- **`contentType`（`"html" | "json" | "markdown"`，默认 `"json"`）**：内容序列化格式。
  `"json"` 对应 ProseMirror 文档模型的原始结构；`"html"` / `"markdown"` 分别对应 HTML /
  Markdown 字符串。
- **`jsonFormator`（`number | (data: any) => string`，无默认值）**：仅 `contentType` 为
  `"json"` 时生效，数字表示 JSON 输出的缩进级别，传函数则自定义序列化。

### 行为

- **`plugins`（`RichEditorPlugin[] | string[]`，无默认值）**：插件列表。传字符串引用内置
  插件，目前内置 `"test"`、`"image"`；传对象则直接给插件定义（含 `name`、`setup`、
  `inputRules`、`ready`），用来注册自定义节点、标记、命令与输入规则。
- **`pluginVars`（`Record<string, Vars>`，无默认值）**：按插件名传给对应插件的配置变量，
  插件在 `setup` / `ready` 阶段读取。

### 外观

- **`toolbar`（`EditorToolbarItem[] | undefined | null`，无默认值）**：工具条按钮配置，
  每项可以是一个 `ActionBarItem`、一组按钮，或命令名字符串；传 `null` / 空则不显示工具条。
  不传时使用插件与内置命令默认生成的工具条。

### 回调

本组件无此组参数（扩展能力通过 `plugins` 数据配置完成，不接受单独的渲染函数注入）。

### 嵌套

本组件内部固定渲染「工具条 + 文档树导航 + 正文 + 属性窗格 + 脚注区」布局，不对外暴露
插槽；正文中的节点与标记通过 `plugins` 扩展，而不是 slot。

### 事件

- **`change`**：载荷为按 `contentType` 序列化后的文档字符串；编辑器事务导致文档内容变化
  （`tr.docChanged`）时触发。仅选区变化不触发。

> 本组件同时继承 `CommonProps`（`className`、`style`），字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)，本篇不再罗列。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 空编辑器（`simple`）

**JSON 配置**

```json
{}
```

**Vue 标签**

```xml
<TiEditRich />
```

## 总结

`TiEditRich` 适合需要结构化文档树、工具条与多格式序列化的长文本富文本编辑，节点与插件
体系是它的扩展主轴。当前处于建设中（`ing`）：外部值回灌未接线、示例仅一个空编辑器，生产
环境使用前需自行验证 `change` 回写与插件行为。只编辑代码 / 配置文本时改用 `TiCodeEditor`；
只编辑多行纯文本时改用 `TiInputMultiLines`。

## 延伸阅读

- **源码入口**
  - `src/lib/edit/rich/prose/ti-edit-rich-prose-index.ts` —— 注册表信息（`TiEditRich`
    对外注册名）与示例配置。
  - `src/lib/edit/rich/prose/ti-edit-rich-prose-types.ts` —— `TiEditRichProseProps`、
    `TiEditRichProseEmitter`、`RichEditorPlugin`。
  - `src/lib/edit/rich/prose/TiEditRichProse.vue` —— 整体布局（工具条 / 文档树 / 正文 /
    属性窗格 / 脚注）。
  - `src/lib/edit/rich/prose/use-editor-api.ts` —— 编辑器实例、事务回写与命令分发。
  - `src/lib/edit/rich/prose/init-prose-editor.ts` —— Schema、键盘映射与内置插件装配。
  - `src/lib/edit/rich/prose/api/` 与 `plugin/` —— 工具条、命令、文档树、选区与内置插件。
- **相关文档**
  - 代码 / 配置文本编辑：[ti-code-editor](ti-code-editor.md)。
  - 事件回写规则：[事件绑定](../../10.concepts/03-event-binding.md)。
