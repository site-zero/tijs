---
title: TiSidebar 侧边导航
keywords: [侧边栏, 导航, 菜单, sidebar, nav, menu, TiSidebar, 树形菜单, 目录]
status: draft
---

# TiSidebar 侧边导航

## 介绍

`TiSidebar` 是动作类（`ACTION`）的竖向导航菜单，把一组带图标、标题、子级的
`SideBarItem` 渲染成可点击的侧边目录。它常用于后台管理系统左侧的功能导航、帮助
中心的章节目录、文档站点的目录树。

点击任意条目时，组件会把解析后的 `StrictSidebarItem`（含 `id`、`depth`、`current`、
`hidden`、`disabled` 等运行时字段）通过 `fire` 事件抛给调用方，由调用方决定如何
跳转（路由切换、内容滚动、打开链接等）。

使用时需要注意：

- 条目可以声明 `path`（内部路由）或 `href`（外部链接）；声明了 `href` 时会渲染成
  `<a>`，并按 `openNewTab` 决定是否在新标签页打开。
- 当前项通过 `isCurrent`（`TiMatch` 表达式）声明，上下文是每个 `SideBarItem` 本身；
  命中的条目会加上 `is-current` 样式类。
- 可见性 / 禁用有两种范式：A 范式写在每个条目上（`visible` / `enabled` + `vars`），
  B 范式写在组件级 `isHidden` / `isDisabled` 函数上；两者同时存在时 B 范式覆盖 A。

源码目录：`src/lib/action/sidebar/`。

## 例子

### JSON 配置

```json
{
  "items": [
    {
      "key": "A",
      "path": "/pets",
      "icon": "fas-shield-cat",
      "title": "Pets",
      "items": [
        { "key": "A-1", "path": "/pets/dog", "icon": "fas-dog", "title": "Dog" }
      ]
    }
  ]
}
```

### Vue 标签调用

```xml
<TiSidebar
  :items="[
    { key: 'A', path: '/pets', icon: 'fas-shield-cat', title: 'Pets', items: [
      { key: 'A-1', path: '/pets/dog', icon: 'fas-dog', title: 'Dog' }
    ] }
  ]"
  @fire="onFire"
/>
```

## 控件参数

### 数据

- **`items`（`SideBarItem[]`，必填）**：顶级条目列表。每个 `SideBarItem` 可包含：
  - `id`（`string`）：条目唯一标识，未声明时由组件按 `D{depth}-I{index}` 自动生成；
  - `path`（`string`）：内部路由路径；
  - `href`（`string`）：外部链接，声明后渲染为 `<a>`；
  - `icon`（`IconInput`）：条目图标；
  - `title`（`string`）：条目标题，支持 `i18n:` 前缀；
  - `items`（`SideBarItem[]`）：子级条目，递归渲染；
  - `visible` / `enabled`（`TiMatch`）：A 范式的可见性 / 启用条件。
- **`isCurrent`（`TiMatch`，无默认值）**：判断哪个条目是当前项的表达式，上下文
  是 `SideBarItem` 本身；命中的条目加 `is-current` 类。
- **`vars`（`Vars`，无默认值）**：A 范式可见性表达式的变量上下文。

### 行为

- **`useCapture`（`boolean`，默认 `false`）**：类型中已声明，当前版本视图未消费，
  保留备用。
- **`openNewTab`（`boolean`，默认 `false`）**：声明了 `href` 的条目是否在新标签页
  打开（`<a target="_blank">`）。
- **`isHidden`（`(item: SideBarItem) => boolean`，无默认值）**：B 范式的隐藏判定
  函数，优先级高于条目自带的 `visible`。
- **`isDisabled`（`(item: SideBarItem) => boolean`，无默认值）**：B 范式的禁用
  判定函数，优先级高于条目自带的 `enabled`。

### 外观

本组件未暴露颜色 / 字号 / 间距 Props；层级缩进由 `depth` 自动渲染
`as-indent-block` 占位块，其余样式由 `ti-sidebar.scss` / `ti-sidebar-item.scss`
内置。需要定制时通过 `className`（Vue 标签层）挂外部类。

### 回调

- **`isHidden` / `isDisabled`**：见"行为"小节，属于函数型属性而非事件回调。

### 嵌套

本组件未提供插槽；条目内容（图标、标题、子级）全部由 `items` 数据驱动，不支持
通过 slot 替换单个条目的渲染。

### 事件

- **`fire`**：载荷为解析后的 `StrictSidebarItem`（含 `id`、`depth`、`current`、
  `hidden`、`disabled`、`path`、`href`、`icon`、`title`、`items`）；点击任意
  未禁用条目时触发。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应，先给 JSON 配置，再给等价的 Vue 标签
写法。

### 简单侧边导航（`simple`）

**JSON 配置**

```json
{
  "items": [
    {
      "key": "A",
      "path": "/pets",
      "icon": "fas-shield-cat",
      "title": "Pets",
      "depth": 0,
      "items": [
        { "key": "A-1", "path": "/pets/dog", "icon": "fas-dog", "title": "Dog", "depth": 1 },
        { "key": "A-2", "path": "/pets/cat", "icon": "fas-cat", "title": "Cat", "depth": 1 },
        { "key": "A-3", "path": "/pets/dove", "icon": "fas-dove", "title": "Dove", "depth": 1 }
      ]
    },
    {
      "key": "B",
      "path": "/foods",
      "icon": "fas-utensils",
      "title": "Foods",
      "depth": 0,
      "items": [
        { "key": "B-1", "path": "/foods/burger", "icon": "fas-burger", "title": "Hamburger", "depth": 1 },
        { "key": "B-2", "path": "/foods/pizza", "icon": "fas-pizza-slice", "title": "Pizza", "depth": 1 }
      ]
    }
  ]
}
```

**Vue 标签**

```xml
<TiSidebar :items="items" @fire="onFire" />
```

## 总结

`TiSidebar` 适合后台 / 文档站左侧的竖向树形导航。需要成排命令按钮或下拉菜单时
改用 `TiActionBar`；需要水平页签切换内容时用 `TiTabs`；只展示单个标签值时用
`TiLabel`。

已知限制：当前版本不支持折叠 / 展开动画，子级默认直接展开；`useCapture` 属性
已声明但未接线；不支持通过插槽自定义单个条目的渲染。

## 延伸阅读

- **源码入口**
  - `src/lib/action/sidebar/ti-sidebar-index.ts` —— 注册表信息与示例配置。
  - `src/lib/action/sidebar/ti-sidebar-types.ts` —— `SidebarProps`、
    `SidebarEmitter`、`StrictSidebarItem`。
  - `src/lib/action/sidebar/TiSidebar.vue` —— 顶级视图。
  - `src/lib/action/sidebar/TiSidebarItem.vue` —— 单个条目与子级递归渲染。
  - `src/lib/action/sidebar/_support/use-sidebar-item.ts` —— 条目解析、可见性
    判定与 `current` 计算。
  - `src/lib/action/sidebar/i18n/` —— 组件局部语言包。
- **相关文档**
  - 成排命令 / 下拉菜单：[ti-action-bar](ti-action-bar.md)。
  - 水平页签：[ti-tabs](ti-tabs.md)。
  - 事件回写规则：[事件绑定](../../10.concepts/03-event-binding.md)。
