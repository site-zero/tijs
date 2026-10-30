---
title: TiBlock 布局块
keywords: [布局块, block, TiBlock, 面板容器, 标题栏, 动作栏, SHELF]
status: draft
---

# TiBlock 布局块

## 介绍

`TiBlock` 是布局系统里最小的一块容器：一条标题栏（图标 + 标题 + 右侧动作按钮）加一块主
内容区。它本身不承载业务，只负责「把一个控件装进带标题的框里」，供 `TiLayoutGrid`、
`TiLayoutTabs` 等布局组件按格子摆放。

内容区放哪个控件由 `comType` + `comConf` 指定；标题栏在有 `icon` / `title` 时才出现。
标题栏右侧的动作按钮来自 `actions`，点击会以 `fire` 事件上报。

使用时需要注意：

- 它是布局内部件（注册表 `asInner: true`），通常由布局组件按 `schema` 装配，很少单独
  手写；单独用时要自己给定宽高（如 `className: "fit-parent"`）。
- 内容区有默认具名插槽，传入插槽内容会替换掉 `comType/comConf` 渲染的控件。
- 子控件冒泡上来的事件会经 `events` 适配后包成 `happen` 事件向外发。

源码目录：`src/lib/shelf/block/`（race：`SHELF`）。

## 例子

### JSON 配置

```json
{
  "className": "fit-parent",
  "title": "MyBlock",
  "name": "mine",
  "comType": "TiRoadblock",
  "comConf": {
    "className": "is-warn-r",
    "icon": "fas-person-digging",
    "text": "Construction ahead please detour",
    "opacity": 0.4
  }
}
```

### Vue 标签调用

```xml
<TiBlock title="MyBlock" name="mine" com-type="TiRoadblock" :com-conf="roadblockConf" />
```

## 控件参数

### 数据

- **`comType`（`string`，无默认值）**：内容区要渲染的控件名，如 `TiRoadblock`、`TiForm`。
- **`comConf`（`Vars`，无默认值）**：传给内容控件的配置对象。
- **`name`（`string`，无默认值）**：块在布局内的名字，`happen` 事件会带上它，布局据此
  定位是哪一块。

### 行为

- **`overflowMode`（`"cover" | "fit" | "auto"`，默认 `"auto"`）**：内容区溢出处理；
  `cover` 严格限定区域、超出滚动，`auto` 被内容撑开。
- **`blockFit`（`"fit" | "cover" | "auto"`，无默认值）**：块本身适配区域方式。
- **`events`（`Record<原生事件, 适配名>`，无默认值）**：子控件事件适配表，命中的事件会被
  重命名并包进 `happen` 事件向外发。

### 外观

- **`icon`（`IconInput`，无默认值）**：标题栏左侧图标；有它或 `title` 才渲染标题栏。
- **`title`（`string`，无默认值）**：标题栏文字，会做 `i18n:` 解析。
- **`blockClass` / `headClass` / `headStyle` / `titleStyle`**：根节点、标题栏、标题文字的
  类与样式。
- **`bodyClass` / `bodyStyle`**：内容包裹层类与样式。
- **`mainClass` / `mainStyle`**：主内容区类与样式。
- **CssGridItem**：作为布局格子时的 `gridRow` / `gridColumn` 等定位（由父布局下发）。

### 回调

- **`actions`（`ActionBarItem[]`，无默认值）**：标题栏右侧动作按钮；与 `actionBar.items`
  合并。
- **`actionBar`（`ActionBarProps`，无默认值）**：标题栏动作栏整体配置。
- **`actionVars`（`Vars`）、`actionClass`、`actionStyle`**：动作按钮变量、动作栏类与样式。

### 嵌套

- **默认插槽（`#default`）**：传入后替换 `comType/comConf` 渲染的内容控件，用于在块内
  自由放置自定义内容。
- 子控件通过 `comType` + `comConf` 数据配置进入内容区；标题栏动作通过 `actions` 配置。

### 事件

- **`fire`**：载荷为 `ActionBarEvent`；标题栏动作按钮被触发时由内部 `TiActionBar` 上报。
- **`happen`**：载荷为 `{eventName, orginName, data, block: {title, name}}`；子控件事件经
  `events` 适配后汇总到这里，`block` 字段标明来源块。

> 本组件同时继承 `CommonProps`（`className`、`style`），共享 Props 见
> [共享 Props](../../10.concepts/02-common-props.md)。组件通过 `defineExpose` 暴露
> `getCom()`（取内容控件实例）与 `isMyName(name)`。

## 更多例子

注册表 `exampleProps` 仅含一个内联示例。

### 简单布局块（`simple`）

**JSON 配置**

```json
{
  "className": "fit-parent",
  "title": "MyBlock",
  "name": "mine",
  "comType": "TiRoadblock",
  "comConf": {
    "className": "is-warn-r",
    "icon": "fas-person-digging",
    "text": "Construction ahead please detour",
    "opacity": 0.4
  }
}
```

**Vue 标签**

```xml
<TiBlock
  class-name="fit-parent"
  title="MyBlock"
  name="mine"
  com-type="TiRoadblock"
  :com-conf="{ className: 'is-warn-r', icon: 'fas-person-digging', text: 'Construction ahead please detour', opacity: 0.4 }"
/>
```

## 总结

`TiBlock` 是布局的原子单元：需要一个「带标题、带动作栏的框」来包裹任意控件时用它。多数
时候它由 `TiLayoutGrid` / `TiLayoutTabs` 依据 `schema` 自动实例化，不需要手写；直接用它
意味着你要自己负责尺寸与位置。

## 延伸阅读

- **源码入口**
  - `src/lib/shelf/block/ti-block-index.ts` —— 注册表信息与内联示例。
  - `src/lib/shelf/block/ti-block-types.ts` —— `BlockEmitter`、`BlockEvent`、`TiBlockApi`。
  - `src/lib/shelf/block/TiBlock.vue` —— 标题栏、动作栏与内容区装配。
  - `src/lib/shelf/block/use-block.ts` —— 标题 / 动作栏 / 布局样式计算。
- **相关文档**
  - 把多个块摆成栅格：[TiLayoutGrid 栅格布局](./ti-layout-grid.md)。
  - 把多个块收进标签页：[TiLayoutTabs 标签布局](./ti-layout-tabs.md)。
  - 块 / 布局项类型定义：`src/lib/shelf/layout/layout-types.ts`。
