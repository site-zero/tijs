---
title: TiLayoutTabs 标签布局
keywords: [标签布局, layout tabs, TiLayoutTabs, 页签容器, 多视图切换, SHELF]
status: draft
---

# TiLayoutTabs 标签布局

## 介绍

`TiLayoutTabs` 把若干区块收进一排标签页：`blocks` 数组里每一项成为一个标签，标签的图标、
标题取自该项的 `icon` / `title`，内容从 `schema` 里按 `name` 取控件。一次只显示当前标签的
区块，切换时整区替换。它是布局意义上的标签页，适合「信息 / 设置 / 更多」这种互斥视图。

它与 `TiTabsForm` 的区别：`TiTabsForm` 是「同一条记录的字段分页签录入」，页签里是字段；
`TiLayoutTabs` 是「各放一块完全独立的布局块」，页签里是一个完整控件或子布局。

使用时需要注意：

- 标签条可在顶部或底部，对齐方式、间距、换行均可配；当前页签可经 `keepTab` 持久化。
- 切页签前可用 `beforeTabChange` 做守卫（同步或异步返回 `false` 阻止切换）。
- 每个标签块的标题栏动作会被剥掉，标题栏外观由标签本身承担，块内容铺满。

源码目录：`src/lib/shelf/layout/tabs/`（race：`SHELF`）。

## 例子

### JSON 配置

```json
{
  "tabsAt": "top",
  "tabsAlign": "center",
  "blocks": [
    { "name": "info", "icon": "zmdi-info", "title": "Information" },
    { "name": "detail", "icon": "zmdi-navigation", "title": "Detail Settings" }
  ],
  "schema": {
    "info": { "comType": "TiRoadblock", "comConf": { "text": "信息区" } },
    "detail": { "comType": "TiRoadblock", "comConf": { "text": "详情区" } }
  }
}
```

### Vue 标签调用

```xml
<TiLayoutTabs
  tabs-at="top"
  :blocks="blocks"
  :schema="schema"
  @tab-change="onTabChange"
/>
```

## 控件参数

### 数据

- **`blocks`（`LayoutBlock[]`）**：标签页数组，每项的 `icon` / `title` / `tip` 作为标签项，
  `name` 引用 `schema` 里的块定义；项也可以是子 `grid` / `tabs` 布局。
- **`schema`（`LayoutSchema`）**：区块控件字典，与 `TiLayoutGrid` 同构。

### 行为

- **`tabsAt`（`"top" | "bottom"`，默认 `"top"`）**：标签条在顶部还是底部。
- **`tabsAlign`（`"left" | "right" | "center"`，默认 `"center"`）**：标签组对齐。
- **`wrapTabs`（`boolean`，默认 `false`）**：标签过多是否换行。
- **`tabItemSpace`（`AspectSize`，默认 `"m"`）**：标签间距分级。
- **`tabMaxWidth`（`string | number`，无默认值）**：单标签最大宽度。
- **`defaultTab`（`string | number`，默认 `0`）**：默认激活页签。
- **`keepTab`（`KeepInfo | string`，无默认值）**：持久化当前页签。
- **`beforeTabChange`（`(event: TabChangeEvent) => boolean | Promise<boolean>`，无默认值）**：
  切页签守卫，返回 `false` 或被拒绝的 Promise 时中止切换。

### 外观

- **`mainStyle` / `mainClass`（无默认值）**：内容主区的样式与类。
- **`className` / `style`**：根节点类与样式。

### 回调

- **`beforeTabChange`** 见「行为」；无其他渲染器注入。

### 嵌套

- **`blocks` 数组**：每个标签页由数据进入；内容块渲染为 `TiBlock`（自动 `cover` 铺满），
  子 `grid` / `tabs` 项再嵌套对应布局。
- **默认插槽（`#default`，作用域 `{main}`）**：覆盖当前标签内容区的渲染。

### 事件

- **`tab-change`**：载荷 `{to: TabDisplayItem, from?: TabDisplayItem}`；当前页签变化时触发
  （初始挂载也会发一次）。
- **`block`**：载荷 `BlockEvent`；顶层时子块事件冒泡上来。
- **`_sub_block`**：载荷 `BlockEvent`；嵌套子布局里冒泡上来的块事件。

> 本组件同时继承 `CommonProps`，共享 Props 见
> [共享 Props](../../10.concepts/02-common-props.md)。组件通过 `defineExpose` 暴露
> `changeTab(tabName)`，可在外部代码里切页签。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 标签组位于顶部（`at-top`）

**JSON 配置**

```json
{
  "className": "fit-parent",
  "keepTab": "Ti-Demo-TiLayoutTabs-At-Top",
  "tabsAt": "top",
  "tabsAlign": "center",
  "wrapTabs": false,
  "tabItemSpace": "b",
  "blocks": [
    { "icon": "zmdi-info", "name": "info", "title": "Information" },
    { "icon": "zmdi-navigation", "name": "detail", "title": "Detail Settings" },
    { "icon": "zmdi-car-taxi", "name": "more", "title": "More Information" }
  ],
  "schema": {
    "info": { "comType": "TiRoadblock", "comConf": { "className": "is-text-r", "text": "信息区", "icon": "zmdi-info" } },
    "detail": {
      "comType": "TiForm",
      "comConf": { "fields": [{ "title": "Name", "name": "name", "comType": "TiInput" }] },
      "events": { "change": "detail-change" }
    },
    "more": { "comType": "TiRoadblock", "comConf": { "className": "is-info-r", "size": "large", "text": "更多信息", "icon": "zmdi-navigation" } }
  }
}
```

**Vue 标签**

```xml
<TiLayoutTabs
  class-name="fit-parent"
  keep-tab="Ti-Demo-TiLayoutTabs-At-Top"
  tabs-at="top"
  tabs-align="center"
  :wrap-tabs="false"
  tab-item-space="b"
  :blocks="blocks"
  :schema="schema"
/>
```

### 标签组位于底部（`at-bottom`）

**JSON 配置**

```json
{
  "className": "fit-parent",
  "keepTab": "Ti-Demo-TiLayoutTabs-At-Bottom",
  "tabsAt": "bottom",
  "tabsAlign": "right",
  "wrapTabs": false,
  "tabItemSpace": "b",
  "blocks": [
    { "icon": "zmdi-info", "name": "info", "title": "Information" },
    { "icon": "zmdi-navigation", "name": "detail", "title": "Detail Settings" },
    { "icon": "zmdi-car-taxi", "name": "more", "title": "More Information" }
  ],
  "schema": {
    "info": { "comType": "TiRoadblock", "comConf": { "className": "is-text-r", "text": "信息区", "icon": "zmdi-info" } },
    "detail": { "comType": "TiRoadblock", "comConf": { "className": "is-warn-r", "text": "详情区", "icon": "zmdi-navigation" } },
    "more": { "comType": "TiRoadblock", "comConf": { "className": "is-info-r", "size": "large", "text": "更多信息", "icon": "zmdi-navigation" } }
  }
}
```

**Vue 标签**

```xml
<TiLayoutTabs
  class-name="fit-parent"
  keep-tab="Ti-Demo-TiLayoutTabs-At-Bottom"
  tabs-at="bottom"
  tabs-align="right"
  :wrap-tabs="false"
  tab-item-space="b"
  :blocks="blocks"
  :schema="schema"
/>
```

## 总结

`TiLayoutTabs` 适合把多个互斥视图收进一排标签。页签里是「一组字段录入」时用 `TiTabsForm`；
需要行列同时分区而不是互斥切换时用 `TiLayoutGrid`。`beforeTabChange` 可阻止未保存离开，
`keepTab` 让用户回到上次所在页。

## 延伸阅读

- **源码入口**
  - `src/lib/shelf/layout/tabs/ti-layout-tabs-index.ts` —— 注册表信息与示例。
  - `src/lib/shelf/layout/tabs/ti-layout-tabs-types.ts` —— `TabsLayoutProps`、`TabChangeEvent`。
  - `src/lib/shelf/layout/tabs/TiLayoutTabs.vue` —— 标签条与当前块装配、切换守卫。
  - `src/lib/shelf/layout/tabs/use-layout-tabs.ts` —— 标签配置与当前页签推导。
- **相关文档**
  - 互斥区块的栅格父容器：[TiLayoutGrid 栅格布局](./ti-layout-grid.md)。
  - 标签化的字段表单：[TiTabsForm 标签表单](./ti-tabs-form.md)。
  - 单个区块：[TiBlock 布局块](./ti-block.md)。
