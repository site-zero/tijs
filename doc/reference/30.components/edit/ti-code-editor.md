---
title: TiCodeEditor 代码编辑
keywords: [代码编辑, code editor, TiCodeEditor, ace, 代码高亮, JSON 编辑, markdown 编辑, EDIT]
status: draft
---

# TiCodeEditor 代码编辑

## 介绍

`TiCodeEditor` 是编辑类（`EDIT`）控件里的代码编辑器，基于 Ace 封装，用来在页面里直接
编辑一段文本代码：JS、CSS、HTML、JSON、Markdown 等都能胜任。它自带语法高亮、软 Tab、
浅色 / 深色主题跟随，适合做配置项编辑、SQL 维护、富文本源码查看这类「需要敲代码」的表单字段。

它和普通输入框的区别在于：内容是一整段多行文本，改动不需要实时同步，而是等你停下来或
失焦时才回调一次。

使用时需要注意：

- 内容通过 `change` 事件向外抛出，默认 1000 毫秒反弹跳；`readonly` 开启后编辑器只读，
  不再抛出任何 `change`。
- `value` 传对象时会先被 `JSON.stringify` 成两格缩进的字符串再显示；传字符串则原样显示。
- 编辑器依赖全局 `ace`（`ace.edit`），宿主页面需要自行引入 Ace 脚本。

源码目录：`src/lib/edit/code/`。

## 例子

### JSON 配置

```json
{
  "type": "json",
  "value": "{\"name\": \"xiaobai\"}",
  "format": "JSON"
}
```

### Vue 标签调用

```xml
<TiCodeEditor
  type="json"
  :value="codeText"
  format="JSON"
  @change="onCodeChange"
/>
```

## 控件参数

### 数据

- **`value`（`any`，无默认值）**：编辑器内容；传对象会被序列化为两格缩进的 JSON 字符串。
  `value` 为 `undefined` 时内部视为加载中。
- **`type`（`string`，无默认值）**：按文件后缀名提示编辑器语法模式，如 `js`、`css`、
  `html`、`json`、`md`；未命中映射时退化为纯文本。与 `mime` 同时给出时优先匹配 `mime`。
- **`mime`（`string`，无默认值）**：按 MIME 类型提示语法模式，如 `text/html`、
  `application/json`、`text/markdown`；优先级高于 `type`。
- **`editorStatus`（`ObjDataStatus`，默认 `"ready"`）**：编辑器的外围状态，驱动覆盖层：
  `"loading"` 显示加载遮罩、`"saving"` 显示保存中遮罩、`"empty"` 显示空值挡路板并把编辑器
  本身隐藏；`"ready"` 正常显示。

### 行为

- **`readonly`（`boolean`，无默认值）**：开启后调用 Ace 的 `setReadOnly(true)`，编辑器不可
  编辑，也不再监听内容变化、不抛出 `change`。
- **`debounce`（`number`，默认 `1000`）**：用户键入后多少毫秒（毫秒）无新变化才抛出一次
  `change`；编辑器失焦时会立即补抛一次。
- **`format`（`"JSON" | "JSON5" | (str: string) => string`，无默认值）**：显示前对内容做
  规整。`"JSON"` 用 JSON5 解析后重新序列化为标准 JSON；`"JSON5"` 序列化为 JSON5；传函数则
  自定义格式化。仅作用于显示，不改变抛给 `change` 的原文。
- **`theme`（`WindowTheme | "auto"`，默认 `"auto"`）**：选择深浅主题；`"auto"` 跟随宿主
  根元素的主题类（`Dom.RootThemeClass`），`"light"` / `"dark"` 则强制指定。

### 外观

- **`editorStyle`（`Vars`，默认 `{ fontFamily: Consolas..., lineHeight: 1.5em, fontSize: 14px }`）**：
  编辑器画布的内联样式。
- **`editorOptions`（`Vars`，默认 `{ useSoftTabs: true, tabSize: 2 }`）**：透传给
  `editor.setOptions` 的 Ace 选项。
- **`editorTheme`（`Record<WindowTheme, string>`，默认 `{ light: "tomorrow", dark: "tomorrow_night_bright" }`）**：
  浅色 / 深色各自对应的 Ace 主题名（不带 `ace/theme/` 前缀）。
- **`emptyRoadblock`（`RoadblockProps`，无默认值）**：`editorStatus` 为 `"empty"` 时挡路板的
  覆盖配置；默认带一个按 `type` / `mime` 推断的文件图标与「无内容」文案。

### 回调

本组件无此组参数。

### 嵌套

本组件未提供插槽，编辑器画布、加载与空值遮罩全部由上述数据与外观属性决定。

### 事件

- **`change`**：载荷为编辑器当前全文本字符串；键入停止超过 `debounce` 毫秒、或编辑器失焦时
  触发。`readonly` 模式下不会触发。

> 本组件同时继承 `CommonProps`（`className`、`style`），字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)，本篇不再罗列。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单文本（`simple`）

**JSON 配置**

```json
{
  "value": "hello world"
}
```

**Vue 标签**

```xml
<TiCodeEditor value="hello world" />
```

### HTML 页面（`html`）

**JSON 配置**

```json
{
  "type": "html",
  "value": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>示例 HTML 页面</title>\n</head>\n<body>\n  <header>\n    <h1>欢迎来到我的网站</h1>\n  </header>\n  <main>\n    <p>这是一个简单的 HTML 示例页面。</p>\n  </main>\n</body>\n</html>\n"
}
```

**Vue 标签**

```xml
<TiCodeEditor type="html" :value="htmlText" />
```

### CSS 样式（`css`）

**JSON 配置**

```json
{
  "type": "css",
  "value": "body {\n  font-family: Arial, sans-serif;\n  background-color: #f0f0f0;\n  margin: 0;\n  padding: 0;\n}\n\nh1 {\n  color: #333;\n  text-align: center;\n}\n"
}
```

**Vue 标签**

```xml
<TiCodeEditor type="css" :value="cssText" />
```

### JavaScript（`js`）

**JSON 配置**

```json
{
  "type": "js",
  "value": "// 打印消息到控制台\nconsole.log(\"Hello, world!\");\n\nfunction greet(name) {\n  return \"Hello, \" + name + \"!\";\n}\n\nvar message = greet(\"Alice\");\nconsole.log(message);\n"
}
```

**Vue 标签**

```xml
<TiCodeEditor type="js" :value="jsText" />
```

### JSON 对象（`json`）

**JSON 配置**

```json
{
  "type": "json",
  "value": {
    "name": "John Doe",
    "age": 30,
    "email": "john.doe@example.com",
    "address": {
      "street": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "zip": "12345"
    }
  }
}
```

**Vue 标签**

```xml
<TiCodeEditor type="json" :value="jsonObj" />
```

### Markdown（`markdown`）

**JSON 配置**

```json
{
  "type": "md",
  "value": "# Markdown 示例\n\n这是一个简单的 Markdown 文件示例。\n\n## 列表\n\n- 项目一\n- 项目二\n- 项目三\n\n## 链接\n\n[链接](https://www.example.com)。\n"
}
```

**Vue 标签**

```xml
<TiCodeEditor type="md" :value="mdText" />
```

## 总结

`TiCodeEditor` 适合编辑一整段结构化文本代码，语法高亮与深浅主题开箱即用；只需要单行或
少量文字时用 `TiInput` / `TiInputMultiLines` 更轻；需要所见即所得的富文本文档，改用
`TiEditRich`。它依赖全局 Ace 脚本，且内容按字符串抛出，上层拿到后需自行决定是否反序列化。

## 延伸阅读

- **源码入口**
  - `src/lib/edit/code/ti-code-editor-index.ts` —— 注册表信息与示例配置。
  - `src/lib/edit/code/ti-code-editor-types.ts` —— `CodeEditorProps`、`CodeEditorEmitter`。
  - `src/lib/edit/code/TiCodeEditor.vue` —— 视图与加载 / 保存 / 空值遮罩接线。
  - `src/lib/edit/code/use-code-ace.ts` —— Ace 实例、主题、语法模式与防抖回写。
- **相关文档**
  - 富文本（所见即所得）编辑：[ti-edit-rich](ti-edit-rich.md)。
  - 状态色与主题变量：[样式系统](../../10.concepts/05-style-system.md)。
  - 事件回写规则：[事件绑定](../../10.concepts/03-event-binding.md)。
