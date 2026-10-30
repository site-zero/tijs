---
title: TiTimeSlots 日时间槽
keywords: [日时间槽, time slots, TiTimeSlots, 时间格, 排班, SHELF, scaffold]
status: draft
---

# TiTimeSlots 日时间槽

## 介绍

`TiTimeSlots` 预留给「按一天的时间槽展示可预约 / 排班时段」的视图容器，注册表带 `scaffold`
标签，目前是一个**骨架占位组件**：模板只渲染一句 `This is TiTimeSlots`，尚未实现时间格、
选中区间等功能，也没有示例配置。

它与 `TiWeeks`（周视图）配套：周视图管「哪一天」，时间槽管「一天内哪个时段」。两者目前都
未落地，不要在生产界面使用。

使用时需要注意：

- 当前版本除 `CommonProps` 外**没有任何业务属性**。
- 类型里声明了 `change` 事件，但占位视图从未触发它。

源码目录：`src/lib/shelf/time-slots/`（race：`SHELF`）。

## 例子

### JSON 配置

```json
{}
```

### Vue 标签调用

```xml
<TiTimeSlots />
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

`TiTimeSlots` 是预留的日内时间槽视图骨架，当前不可用于排班 / 预约时段选择。需要日历选日
请用 `TiCalendar`；周维度排程见同为骨架的 `TiWeeks`。待其补齐时间格与交互后，本篇会补充
参数与示例。

## 延伸阅读

- **源码入口**
  - `src/lib/shelf/time-slots/ti-time-slots-index.ts` —— 注册表信息（`tags: ["scaffold"]`）。
  - `src/lib/shelf/time-slots/ti-time-slots-types.ts` —— `TiTimeSlotsProps`、`TiTimeSlotsEmitter`。
  - `src/lib/shelf/time-slots/TiTimeSlots.vue` —— 占位视图。
  - `src/lib/shelf/time-slots/use-ti-time-slots-api.ts` —— 空实现 API。
- **相关文档**
  - 已实现的月视图：[TiCalendar 日历](./ti-calendar.md)。
  - 同为骨架的周视图：[ti-weeks](ti-weeks.md)。
