---
title: TiWeeks 周视图
keywords: [周视图, weeks, TiWeeks, 周排程, 日历周, SHELF, scaffold]
status: draft
---

# TiWeeks 周视图

## 介绍

`TiWeeks` 预留给「按周展示排程 / 日程」的视图容器，注册表带 `scaffold` 标签，目前是一个
**骨架占位组件**：模板只渲染一句 `This is TiWeeks`，尚未实现周格、事件槽位等实际功能，
也没有示例配置。

不要在生产界面里依赖它做排程；需要选日期时先用 `TiCalendar`，后续版本补齐后再迁移。

使用时需要注意：

- 当前版本除 `CommonProps` 外**没有任何业务属性**，传其他配置不会生效。
- 类型里声明了 `change` 事件，但占位视图从未触发它。

源码目录：`src/lib/shelf/weeks/`（race：`SHELF`）。

## 例子

### JSON 配置

```json
{}
```

### Vue 标签调用

```xml
<TiWeeks />
```

## 控件参数

### 数据

本组件无此组参数（类型上仅继承 `CommonProps`，无业务数据属性）。

### 行为

本组件无此组参数。

### 外观

本组件无此组参数（可经 `className` / `style` 做基础覆写）。

### 回调

本组件无此组参数。

### 嵌套

本组件未提供插槽，内容由占位模板写死，不支持自定义。

### 事件

- **`change`**：类型已声明（载荷 `any`），当前版本占位视图从未触发，保留备用。

> 本组件同时继承 `CommonProps`，共享 Props 见
> [共享 Props](../../10.concepts/02-common-props.md)。

## 更多例子

注册表 `exampleProps` 为空，本组件暂无示例。

## 总结

`TiWeeks` 是预留的周排程视图骨架，当前不可用于真实排程场景。需要日历选日请用
`TiCalendar`；需要日内时间槽视图请关注同为骨架的 `TiTimeSlots`。待其补齐周格与事件后，
本篇会补充参数与示例。

## 延伸阅读

- **源码入口**
  - `src/lib/shelf/weeks/ti-weeks-index.ts` —— 注册表信息（`tags: ["scaffold"]`）。
  - `src/lib/shelf/weeks/ti-weeks-types.ts` —— `TiWeeksProps`、`TiWeeksEmitter`。
  - `src/lib/shelf/weeks/TiWeeks.vue` —— 占位视图。
  - `src/lib/shelf/weeks/use-ti-weeks-api.ts` —— 空实现 API。
- **相关文档**
  - 已实现的月视图：[TiCalendar 日历](./ti-calendar.md)。
  - 同为骨架的日时间槽：[ti-time-slots](ti-time-slots.md)。
