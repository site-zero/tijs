---
title: TiPager 翻页器
keywords: [翻页, 分页, pager, pagination, TiPager, 页码, 跳转, 指示器]
status: draft
---

# TiPager 翻页器

## 介绍

`TiPager` 是动作类（`ACTION`）的翻页控件，把"当前页 / 总页数 / 页大小 / 总条数"
这组分页状态渲染成可点击的导航条。它只负责发事件，不持有分页状态本身，由调用方
根据 `change-page-number` / `change-page-size` 事件去更新数据。

提供三种模式，按场景选用：

- `jumper`：长列表底部标准翻页条，带首页 / 上一页 / 当前页码 / 下一页 / 尾页，
  以及"共 N 页 M 条"摘要；
- `button`：搜索结果页风格的数字按钮翻页，首尾带上下页按钮；
- `dotted`：幻灯片风格的圆点指示器，只显示当前位置。

使用时需要注意：

- 翻页条是否可用由 `pageCount > 0 && pageNumber > 0 && totalCount > 0` 共同
  决定，任一为 0 都会渲染成禁用态。
- 页数很多时由 `maxShowPages`（默认 10）控制同时显示的页码数量，两端用 `...`
  省略号占位，点击省略号会弹出输入框跳页。
- 点击当前页码（`jumper` 模式）或省略号会弹出 `Prompt` 输入框直接跳页；点击摘要
  文字或齿轮图标会弹出输入框修改页大小。

源码目录：`src/lib/action/pager/`。

## 例子

### JSON 配置

```json
{
  "mode": "jumper",
  "pageNumber": 3,
  "pageCount": 30,
  "pageSize": 100,
  "totalCount": 2997,
  "count": 100,
  "maxShowPages": 10
}
```

### Vue 标签调用

```xml
<TiPager
  mode="jumper"
  :page-number="3"
  :page-count="30"
  :page-size="100"
  :total-count="2997"
  :count="100"
  :max-show-pages="10"
  @change-page-number="onPageNumber"
  @change-page-size="onPageSize"
/>
```

## 控件参数

### 数据

- **`pageNumber`（`number`，无默认值）**：当前页码（1 起）。
- **`pageSize`（`number`，无默认值）**：每页条数。
- **`pageCount`（`number`，无默认值）**：总页数。
- **`totalCount`（`number`，无默认值）**：总记录数。
- **`count`（`number`，无默认值）**：当前页实际条数（用于摘要展示）。

### 行为

- **`mode`（`"jumper" | "button" | "dotted"`，默认 `"jumper"`）**：翻页条形态。
- **`showText`（`boolean`，默认 `true`）**：是否在首页 / 上一页 / 下一页 / 尾页
  按钮上显示文字（"首页 / 上一页 / 下一页 / 尾页"）；关闭后只显示图标。
- **`canAskPageSize`（`boolean`，默认 `true`）**：是否允许点击摘要 / 齿轮弹出
  输入框修改页大小；关闭后 `jumper` 模式下齿轮图标不响应。
- **`maxShowPages`（`number`，默认 `10`）**：同时显示的页码数量上限；超出时两端
  用 `...` 省略号占位。

### 外观

- **`brief`（`string | boolean`，默认 `true`）**：翻页摘要的显示方式。`true`
  使用内置文案 `i18n:paging-brief`（"共 N 页 M 条记录，当前 x/y"）；传字符串则
  作为 `I18n.textf` 的模板键；传 `false` 关闭摘要。

本组件未提供其他外观 Props（颜色 / 字号 / 间距），样式由 `ti-pager.scss` 内置；
需要微调时通过 `className` 挂外部类。

### 回调

本组件无用户回调函数；跳页与页大小修改全部通过事件向外抛出。

### 嵌套

本组件未提供插槽，所有内容由分页状态与 `mode` 决定。

### 事件

- **`change-page-number`**：载荷为目标页码（`number`）；点击首页 / 上一页 / 下一
  页 / 尾页 / 某个页码 / 省略号跳页成功时触发。目标页码与当前相同时不触发。
- **`change-page-size`**：载荷为新页大小（`number`）；通过输入框修改页大小成功
  且与当前不同时触发。

> 本组件同时继承 `CommonProps`（`className`、`style`），字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)，本篇不再罗列。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应，先给 JSON 配置，再给等价的 Vue 标签
写法。

### 跳转翻页（`jumper`）

**JSON 配置**

```json
{
  "mode": "jumper",
  "pageNumber": 3,
  "pageCount": 30,
  "pageSize": 100,
  "totalCount": 2997,
  "count": 100,
  "maxShowPages": 10
}
```

**Vue 标签**

```xml
<TiPager
  mode="jumper"
  :page-number="3"
  :page-count="30"
  :page-size="100"
  :total-count="2997"
  :count="100"
  :max-show-pages="10"
/>
```

### 按钮翻页（`button`）

**JSON 配置**

```json
{
  "mode": "button",
  "pageNumber": 3,
  "pageCount": 30,
  "pageSize": 100,
  "totalCount": 2997,
  "count": 100,
  "maxShowPages": 10
}
```

**Vue 标签**

```xml
<TiPager
  mode="button"
  :page-number="3"
  :page-count="30"
  :page-size="100"
  :total-count="2997"
  :count="100"
  :max-show-pages="10"
/>
```

### 指示器翻页（`dotted`）

**JSON 配置**

```json
{
  "mode": "dotted",
  "pageNumber": 3,
  "pageCount": 30,
  "pageSize": 100,
  "totalCount": 2997,
  "count": 100,
  "maxShowPages": 10
}
```

**Vue 标签**

```xml
<TiPager
  mode="dotted"
  :page-number="3"
  :page-count="30"
  :page-size="100"
  :total-count="2997"
  :count="100"
  :max-show-pages="10"
/>
```

## 总结

`TiPager` 适合所有需要分页导航的列表 / 表格 / 幻灯片底部。长列表用 `jumper`，
搜索结果页用 `button`，轮播 / 幻灯片用 `dotted`。组件本身不持有分页状态，
调用方必须监听两个事件并把新状态回写；页大小修改后总页数变化也由调用方重新计算
并回传。

已知限制：跳页与修改页大小使用内置 `Prompt` 弹窗，无法替换为自定义输入控件；
`dotted` 模式不显示文字摘要与上下页按钮。

## 延伸阅读

- **源码入口**
  - `src/lib/action/pager/ti-pager-index.ts` —— 注册表信息与示例配置。
  - `src/lib/action/pager/ti-pager-types.ts` —— `PagerProps`、`PagerEmitter`、
    `PagerMode`。
  - `src/lib/action/pager/TiPager.vue` —— 三种模式的视图模板。
  - `src/lib/action/pager/use-pager.ts` —— 页码窗口计算、跳页与页大小输入。
- **相关文档**
  - 共享 Props：[共享 Props](../../10.concepts/02-common-props.md)。
  - 事件回写规则：[事件绑定](../../10.concepts/03-event-binding.md)。
