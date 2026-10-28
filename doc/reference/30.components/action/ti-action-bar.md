---
title: TiActionBar 动作条
keywords: [动作条, 工具栏, 菜单, action bar, toolbar, TiActionBar, 命令组, 下拉菜单]
status: draft
---

# TiActionBar 动作条

## 介绍

`TiActionBar` 是动作类（`ACTION`）的成排命令容器，把一组按钮、分隔线、下拉分组、
复合按钮、自定义控件组织在同一行（`H`）或同一列（`V`）里。它是页面顶部工具条、
表单底部操作区、上下文菜单、按钮组的统一载体。

它不直接渲染单个按钮，而是把 `items` 数组里的每一项按 `type` 分发到不同的子视图：

- `action`：普通命令按钮，点击触发 `fire` 事件；
- `group`：带子菜单的顶级条目，点击展开浮层；
- `sep`：分隔线；
- `combin`：把多个子按钮拼成一组（如加粗 / 斜体 / 下划线）；
- `customized`：通过 `comType` 挂载任意注册组件。

使用时需要注意：

- 条目通过 `action` 字段声明行为，可以是字符串事件名、`ActionEventInfo`、`Invoke`
  描述，或一个回调函数；最终都会汇聚到 `fire` 事件向外抛出。
- 浮层展开后会自动罩一层点击遮罩，点击遮罩或窗口尺寸变化时收起所有分组。
- `V` 模式常用于上下文菜单 / 侧边竖排工具；`topItemAspectMode: "button"` 会把顶级
  条目渲染成按钮样式。

源码目录：`src/lib/action/actionbar/`。

## 例子

### JSON 配置

```json
{
  "items": [
    { "icon": "zmdi-floppy", "text": "保存", "action": "save" },
    {},
    { "text": "取消", "action": "cancel" }
  ]
}
```

### Vue 标签调用

```xml
<TiActionBar
  :items="[
    { icon: 'zmdi-floppy', text: '保存', action: 'save' },
    {},
    { text: '取消', action: 'cancel' }
  ]"
  @fire="onFire"
/>
```

## 控件参数

### 数据

- **`items`（`ActionBarItemRefer[]`，默认 `[]`）**：动作条的顶级条目列表。每一项可以是
  `ActionBarItem` 对象、字符串引用名、或 `[引用名, 局部覆盖]` 二元组；空对象 `{}`
  表示一个占位分隔（与 `type: "sep"` 等价）。
- **`vars`（`Vars`，无默认值）**：上下文变量，供条目的 `visible` / `enabled` /
  `altDisplay.test` 等 `TiMatch` 表达式取值；会被 `provide` 给所有子条目。
- **`barItemSet`（`Record<string, ActionBarItem> | (refer, setup) => ActionBarItem`，
  无默认值）**：注册一个命名条目集，之后 `items` 里就可以用字符串引用名复用同一份
  配置，再通过第二项局部覆盖。
- **`head` / `tail`（`TextFragment`，无默认值）**：动作条首尾的文字片段，支持
  `icon`、`text`、`textType`、`comType`、`comConf`；未提供时不渲染头尾槽。

### 行为

- **`name`（`string`，无默认值）**：动作条名称，仅用于调试时区分多个动作条。
- **`layoutMode`（`"H" | "V"`，默认 `"H"`）**：布局方向，`"V"` 适合上下文菜单、
  侧边竖排工具。
- **`topItemAspectMode`（`"normal" | "button"`，默认 `"normal"`）**：顶级条目的
  外观模式；`"button"` 会把每个顶级条目渲染成标准按钮样式。

### 外观

- **`topItemMinWidth`（`string | null`，默认 `"6em"`）**：顶级条目最小宽度；传 `null`
  关闭最小宽度约束。
- **`minWrapperWidth` / `maxWrapperWidth`（`string | null`，无默认值）**：下拉分组
  浮层、`V` 模式菜单条的最小 / 最大宽度。
- **`barPad`（`AspectSize | "none"`，默认 `"s"`）**：条目之间的间距分级。
- **`itemSize`（`AspectSize`，默认 `"s"`）**：条目字号分级 `t / s / m / b / h`。
- **`itemAlign`（`CssAlignment`，默认 `"left"`）**：条目在工具条内的横向对齐
  `left / center / right`。
- **`itemRadius`（`AspectSize | "none"`，默认 `"s"`）**：条目圆角分级。

### 回调

动作条本身不暴露用户回调函数；条目的行为由每个 `ActionBarItem` 的 `action` 字段
声明，取值为 `ActionBarAction`：

- **字符串**：直接作为事件名 `fire` 出去，载荷为该条目的 `value`；
- **`ActionEventInfo` / `Invoke`**：带 `bus`、`name`、`payload` 的事件描述，由
  事件绑定机制分发；
- **`(value, vars, bus) => void`**：直接调用的回调，第一参数为条目 `value`（缺省为
  条目的 `uniqKey`），第二参数为 `props.vars`。

### 嵌套

- **`head`**：动作条开头区域；未提供 slot 时由 `props.head` 的 `TextFragment`
  渲染。
- **`tail`**：动作条结尾区域；未提供 slot 时由 `props.tail` 的 `TextFragment`
  渲染。

条目内部不提供 slot；`customized` 类型的条目通过自身的 `comType` / `comConf`
挂载任意子组件。

### 事件

- **`fire`**：载荷为 `ActionBarEvent`，形如 `{ name: string, payload?: any }`；
  任意 `action` 条目被点击时触发，`group` 展开、`sep` 分隔不会触发。

> 本组件同时继承 `CommonProps`（`className`、`style`），字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)，本篇不再罗列。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应，先给 JSON 配置，再给等价的 Vue 标签
写法。

### 简单动作条（`simple`）

**JSON 配置**

```json
{
  "vars": { "saving": false },
  "topItemAspectMode": "normal",
  "items": [
    {
      "icon": "zmdi-floppy",
      "text": "i18n:save-change",
      "altDisplay": {
        "test": { "saving": true },
        "icon": "fas-spinner fa-pulse",
        "text": "i18n:saving"
      },
      "enabled": { "changed": true },
      "action": "save",
      "shortcut": "CTRL+S"
    },
    {},
    { "icon": "fas-clock-rotate-left", "text": "i18n:restore", "action": "close" },
    {},
    { "text": "i18n:cancel", "action": "cancel" },
    {},
    {
      "type": "group",
      "icon": "fas-bars",
      "items": [
        {
          "type": "action",
          "icon": "zmdi-refresh",
          "text": "i18n:refresh",
          "altDisplay": {
            "test": { "reloading": true },
            "icon": "zmdi-refresh zmdi-hc-spin",
            "text": "i18n:loading"
          },
          "action": "reload",
          "shortcut": "CTRL+SHIFT+R"
        },
        {},
        {
          "type": "group",
          "text": "More 1111",
          "items": [
            { "text": "Action A", "action": { "bus": true, "name": "do:action", "payload": "A" } },
            { "text": "Action B", "action": { "name": "do:action", "payload": "B" } }
          ]
        }
      ]
    }
  ]
}
```

**Vue 标签**

```xml
<TiActionBar :vars="{ saving: false }" :items="items" @fire="onFire" />
```

### 可见性（`visibility`）

**JSON 配置**

```json
{
  "vars": { "saving": false, "ENABLE_CONSOLE": "no", "changed": false },
  "items": [
    {
      "name": "saving",
      "type": "action",
      "icon": "zmdi-floppy",
      "text": "i18n:save-change",
      "altDisplay": [
        {
          "test": { "saving": true },
          "icon": "fas-spinner fa-pulse",
          "text": "i18n:saving"
        }
      ],
      "enabled": { "changed": true },
      "action": "save",
      "shortcut": "CTRL+S"
    },
    {},
    {
      "type": "action",
      "icon": "zmdi-keyboard",
      "text": "i18n:console",
      "action": "bus:> open-console",
      "shortcut": "ALT+SHIFT+T",
      "visible": { "ENABLE_CONSOLE": "yes" }
    }
  ]
}
```

**Vue 标签**

```xml
<TiActionBar
  :vars="{ saving: false, ENABLE_CONSOLE: 'no', changed: false }"
  :items="items"
  @fire="onFire"
/>
```

> 示例演示了 `visible` 表达式：当 `vars.ENABLE_CONSOLE` 为 `"yes"` 时，控制台条目
> 才会显示。

### 垂直模式（`mode_v`）

**JSON 配置**

```json
{
  "vars": { "saving": false },
  "layoutMode": "V",
  "topItemAspectMode": "button",
  "maxWrapperWidth": "10em",
  "items": [
    { "icon": "zmdi-search", "text": "i18n:search", "action": "search" },
    {},
    { "icon": "zmdi-time-restore", "text": "i18n:reset", "action": "reset" },
    {},
    { "type": "group", "icon": "zmdi-settings", "text": "More", "items": [
      { "icon": "zmdi-share", "text": "Share", "action": "share" },
      {},
      { "icon": "zmdi-cloud-box", "text": "Load Setup", "action": "load_setup" }
    ] }
  ]
}
```

**Vue 标签**

```xml
<TiActionBar
  layout-mode="V"
  top-item-aspect-mode="button"
  max-wrapper-width="10em"
  :items="items"
  @fire="onFire"
/>
```

### 布尔选项（`bool`）

**JSON 配置**

```json
{
  "vars": { "showDeleted": false, "showMarkNum": false },
  "items": [
    {
      "icon": "zmdi-square-o",
      "text": "Show Deleted",
      "altDisplay": {
        "test": { "showDeleted": true },
        "icon": "zmdi-check-square",
        "text": "Hide Actived"
      },
      "action": "toggle-showDeleted"
    },
    {},
    {
      "type": "group",
      "icon": "fas-bars",
      "items": [
        {
          "icon": "zmdi-circle-o",
          "text": "Show Mark Number",
          "altDisplay": {
            "test": { "showMarkNum": true },
            "icon": "zmdi-check-circle",
            "text": "Hide Mark Number"
          },
          "action": "toggle-showMarkNum"
        }
      ]
    }
  ]
}
```

**Vue 标签**

```xml
<TiActionBar
  :vars="{ showDeleted: false, showMarkNum: false }"
  :items="items"
  @fire="onFire"
/>
```

> 示例配合注册表的 `exampleModel.fire` 把 `toggle-showDeleted` / `toggle-showMarkNum`
> 事件回写为 `vars` 布尔值翻转，从而让 `altDisplay.test` 切换图标与文字。

### 按钮组（`button_group`）

**JSON 配置**

```json
{
  "vars": { "saving": false },
  "topItemAspectMode": "button",
  "maxWrapperWidth": "10em",
  "itemSize": "b",
  "items": [
    { "icon": "zmdi-apple", "text": "i18n:ok", "className": "is-primary-r", "action": "ok" },
    { "text": "i18n:cancel", "className": "is-info-r", "action": "cancel" }
  ]
}
```

**Vue 标签**

```xml
<TiActionBar
  top-item-aspect-mode="button"
  max-wrapper-width="10em"
  item-size="b"
  :items="items"
  @fire="onFire"
/>
```

### 工具条（`toolbar`）

**JSON 配置**

```json
{
  "vars": { "bold": true, "italic": true, "heading": "H2" },
  "topItemAspectMode": "button",
  "topItemMinWidth": null,
  "itemSize": "m",
  "items": [
    {
      "comType": "TiDroplist",
      "comConf": {
        "placeholder": "Heading",
        "value": "=heading",
        "options": [
          { "value": "H1", "text": "Heading 1" },
          { "value": "H2", "text": "Heading 2" }
        ],
        "width": "150px"
      },
      "action": "heading"
    },
    {},
    {
      "type": "combin",
      "items": [
        {
          "icon": "zmdi-format-bold",
          "tip": "i18n:bold",
          "altDisplay": { "test": { "bold": true }, "className": "highlight" },
          "action": { "name": "toggleMark", "payload": { "mark": "bold" } }
        }
      ]
    },
    {},
    { "icon": "zmdi-link", "tip": "i18n:link", "action": "edit:link" }
  ]
}
```

**Vue 标签**

```xml
<TiActionBar
  top-item-aspect-mode="button"
  :top-item-min-width="null"
  item-size="m"
  :items="items"
  @fire="onFire"
/>
```

> 示例演示了把 `TiDroplist` 作为 `customized` 条目嵌入工具条，以及 `combin` 复合
> 按钮组的写法。

## 总结

`TiActionBar` 适合需要成排命令、统一间距、下拉分组的场景：表单底部操作区、富文本
工具条、页面顶部菜单、上下文菜单。只有一两个独立按钮时直接用 `TiButton` 更轻；
需要树形多级导航时改用 `TiSidebar`；需要页签切换时用 `TiTabs`。

已知限制：当前浮层分组的停靠位置由内置 CSS 变量控制，外部难以自定义浮层的弹出
方向（上 / 下 / 左 / 右）。

## 延伸阅读

- **源码入口**
  - `src/lib/action/actionbar/ti-action-bar-index.ts` —— 注册表信息与示例配置。
  - `src/lib/action/actionbar/ti-action-bar-types.ts` —— `ActionBarProps`、
    `ActionBarEmitter`、`ABarState`。
  - `src/lib/action/actionbar/TiActionBar.vue` —— 视图与条目分发。
  - `src/lib/action/actionbar/build-action-bar-items.ts` —— 条目解析与 `barItemSet`
    引用展开。
  - `src/lib/action/actionbar/use-action-bar.ts` —— 可见性、禁用与展开状态计算。
  - `src/lib/action/actionbar/ItemAsAction.vue` / `ItemAsGroup.vue` /
    `ItemAsCombin.vue` / `ItemAsCustomized.vue` / `ItemAsGroup.vue` —— 各类条目
    的子视图。
- **相关文档**
  - 单按钮：[ti-button](ti-button.md)。
  - 侧边导航：[ti-sidebar](ti-sidebar.md)。
  - 页签切换：[ti-tabs](ti-tabs.md)。
  - 事件回写规则：[事件绑定](../../10.concepts/03-event-binding.md)。
  - 共享 Props：[共享 Props](../../10.concepts/02-common-props.md)。
