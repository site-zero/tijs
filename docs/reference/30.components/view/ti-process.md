---
title: TiProcess 处理过程
keywords: [处理过程, process, TiProcess, 进度, progress, 进度条, 日志, 可中止, 视图]
status: draft
---

# TiProcess 处理过程

## 介绍

`TiProcess` 是视图类（`VIEW`）的"处理过程"展示面板：自上而下依次排标题、进度条、
（可选的）中止按钮、状态列表、实时日志。用来在后台任务（导入、转换、批处理）进行时，
向用户同步进度、当前进行到哪一步、以及运行日志。

使用时需要注意：

- 进度条由 `progress`（`TiProgressBar` 的参数）驱动；当 `progress.value` 达到 `range`
  上限时，日志区底部不再显示旋转的"处理中"动画。
- `logs` 是响应式字符串数组，组件用 `MutationObserver` 监听其变化并自动滚动到底部。
- `listData` 一旦传入就会渲染一个内部 `TiList` 作为状态列表；`listCurrentRowIndex`
  变化时会滚动到对应行。

源码目录：`src/lib/view/process/`。

## 例子

### JSON 配置

```json
{
  "title": "Process Title",
  "fillMode": "fit",
  "progress": { "value": 0.23 }
}
```

### Vue 标签调用

```xml
<TiProcess
  title="Process Title"
  fill-mode="fit"
  :progress="{ value: 0.23 }"
  :logs="logs"
/>
```

## 控件参数

### 数据

- **`title`（`string | TextSnippetProps`，无默认值）**：标题；字符串会被当作
  `{ text }`，用 `TiTextSnippet` 渲染。
- **`progress`（`ProgressBarProps`，无默认值）**：进度条配置，原样传给 `TiProgressBar`；
  常用 `value`（0~1）、`range`（默认 `[0,1]`）、`type`（状态色）。
- **`logs`（`string[]`，无默认值）**：日志行数组；传入后底部渲染日志区并自动滚到底。
- **`listData`（`Vars[]`，无默认值）**：状态列表数据；传入后在进度条下方渲染一个
  `TiList`。
- **`listConf`（`ListProps`，无默认值）**：传给内部 `TiList` 的额外配置；组件会叠加一批
  默认值（`canSelect:false`、`showChecker:false`、`canHover:false`、`multi:false`、
  `allowUserSelect:true`、`borderStyle:'dashed'`）。

### 行为

- **`fillMode`（`"cover" | "fit" | "auto"`，无默认值）**：填充父元素模式，`fit` / `cover`
  会挂上对应布局类。
- **`abort`（`string | ButtonProps`，无默认值）**：中止按钮配置；字符串作为按钮文字，
  对象作为 `TiButton` 配置（缺省文字 `i18n:cancel`）。点击后发出 `abort` 事件。
- **`listCurrentRowIndex`（`number`，无默认值）**：0 起始的行索引，变化时自动把内部列表
  滚动到该行。

### 外观

- **`progressPartStyle`（`Vars`，无默认值）**：进度条区块的内联样式。
- **`listPartStyle`（`Vars`，无默认值）**：状态列表区块的内联样式。
- **`logPartStyle`（`Vars`，无默认值）**：日志区块的内联样式。

### 回调

本组件无独立回调参数；中止逻辑通过 `abort` 按钮 + `abort` 事件对接。

### 嵌套

本组件未提供插槽；标题、进度条、按钮、列表、日志区块位置固定，样式微调通过上述外观
属性完成。内部组合的子控件为 `TiTextSnippet`（标题）、`TiProgressBar`（进度条）、
`TiButton`（中止）、`TiList`（状态列表）。

### 事件

- **`abort`**：点击中止按钮时触发，无业务载荷。

> 本组件继承 `CommonProps`（`className`、`style`），字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)，本篇不再罗列。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单（`simple`）

**JSON 配置**

```json
{
  "title": "Process Title",
  "fillMode": "fit",
  "progress": { "value": 0.23 },
  "logs": [
    "2021-05-01 12:00:00 - Start",
    "2021-05-01 12:00:01 - Step 1",
    "2021-05-01 12:00:02 - Step 2"
  ]
}
```

**Vue 标签**

```xml
<TiProcess title="Process Title" fill-mode="fit" :progress="{ value: 0.23 }" :logs="logs" />
```

> 完整示例含 30 条日志行，此处省略，原样配置见 `example/ex-process-simple.ts`。

### 可中止（`abortable`）

**JSON 配置**

```json
{
  "title": "Abortable Processing",
  "fillMode": "fit",
  "progress": { "type": "warn", "value": 0.69 },
  "abort": { "icon": "far-circle-stop", "type": "info" },
  "logs": ["2021-05-01 12:00:00 - Start"]
}
```

**Vue 标签**

```xml
<TiProcess
  title="Abortable Processing"
  fill-mode="fit"
  :progress="{ type: 'warn', value: 0.69 }"
  :abort="{ icon: 'far-circle-stop', type: 'info' }"
  :logs="logs"
  @abort="onAbort"
/>
```

### 状态列表（`list`）

**JSON 配置**

```json
{
  "title": "Processing With Status",
  "fillMode": "fit",
  "progress": { "type": "info", "value": 0.4 },
  "abort": { "icon": "fas-pause", "type": "warn" },
  "listCurrentRowIndex": 0,
  "listData": [
    { "icon": "fas-check", "text": "Demo 0", "value": "~/demo_0.js" }
  ]
}
```

**Vue 标签**

```xml
<TiProcess
  title="Processing With Status"
  fill-mode="fit"
  :progress="{ type: 'info', value: 0.4 }"
  :abort="{ icon: 'fas-pause', type: 'warn' }"
  :list-current-row-index="0"
  :list-data="listData"
  @abort="onAbort"
/>
```

> 完整示例用脚本生成 100 行状态项，前 20 行图标为成功态（`fas-check`），其余为
> `fas-hourglass-start`，见 `example/ex-process-list.ts`。

## 总结

`TiProcess` 适合"后台任务可视化"：导入导出、批处理、安装升级。只需要一个转圈等待时
用更轻的 `TiLoading`；只需要进度百分比、不需要日志和状态列表时，直接用 `TiProgressBar`。
它本质是 `TiProgressBar` + `TiList` + 日志区 + `TiButton` 的固定编排。

## 延伸阅读

- **源码入口**
  - `src/lib/view/process/ti-process-index.ts` —— 注册表信息与示例配置。
  - `src/lib/view/process/ti-process-types.ts` —— `ProcessProps`。
  - `src/lib/view/process/TiProcess.vue` —— 区块编排、日志自动滚动与中止按钮。
- **相关文档**
  - 进度条本体：[TiProgressBar 进度条](../tile/ti-progress-bar.md)。
  - 轻量加载占位：[ti-loading](ti-loading.md)。
  - 状态列表：[ti-list](ti-list.md)。
