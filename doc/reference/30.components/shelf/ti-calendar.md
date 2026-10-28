---
title: TiCalendar 日历
keywords: [日历, calendar, TiCalendar, 日期选择, 月视图, 日期格, SHELF]
status: draft
---

# TiCalendar 日历

## 介绍

`TiCalendar` 渲染一整月的日期网格：顶部是年 / 月切换与「回到今日」，中间是星期头加日期格，
点某天就把那天作为新值发出来。它是一个纯日历视图，不自带弹层；弹层、输入框组合由上层
输入控件完成。

值可以是日期对象、时间戳或格式化字符串，输出类型由 `valueType` 统一控制。每个日期格还能
通过 `comType` + `comConf` 换成自定义控件，`comConf` 里可用模板拿到当天的
`isToday` / `isCurrent` / `isInMonth` 状态。

使用时需要注意：

- 它是受控视图：`value` 决定当前选中日，点格子后靠 `change` 把新值抛给外部，本身不回写。
- 日期格按 UTC 解析（`timezone` 可改），跨时区使用时留意 `valueFormat` 与 `timezone` 配合。
- 非当月补位日也会渲染（`is-in-month` / `is-out-of-month` 区分），点击同样会触发 `change`。
- **注册写法说明（供维护者留意）**：`ti-calendar-index.ts` 的 `install` 里
  `app.component(COM_TYPE, TiCalendarInfo)` 第二参数传的是注册表信息对象 `TiCalendarInfo`，
  而非组件 `TiCalendar`；仓库内另有一批注册表（含基础输入框 box3）采用相同写法。动态渲染
  走注册表映射（`com.com`）不受影响；直接以全局标签方式使用时是否受此影响需另行验证。此处为
  源码现状记录，文档不替它修正。

源码目录：`src/lib/shelf/calendar/`（race：`SHELF`）。

## 例子

### JSON 配置

```json
{
  "width": "280px",
  "height": "260px",
  "value": "2025-08-16",
  "cellRadius": "t"
}
```

### Vue 标签调用

```xml
<TiCalendar value="2025-08-16" width="280px" height="260px" cell-radius="t" @change="onChange" />
```

## 控件参数

### 数据

- **`value`（`any`，无默认值）**：当前选中日期，可传日期对象、时间戳或日期字符串。
- **`valueType`（`"auto" | "date" | "str" | "ms"`，默认 `"auto"`）**：`change` 输出的值类型；
  `auto` 按 `value` 原有类型推断，空值时退化为 `str`。
- **`valueFormat`（`string`，默认 `"yyyy-MM-dd"`）**：`valueType` 为 `str` 时的输出格式。
- **`timezone`（`DateParseOptionsZone`，无默认值）**：解析字符串值时的时区，缺省取环境时区。
- **`today`（`any`，无默认值）**：指定「今日」日期，缺省用系统当天。
- **`comType` / `comConf`**：每个日期格渲染的自定义控件；`comConf` 经模板解释，上下文中
  含当天 `year / month / date / dayInWeek / isToday / isCurrent / isInMonth`。

### 行为

- **`weekBegin`（`0 | 1`，默认 `0`）**：一周从周日（0）还是周一（1）开始。
- **`weekCount`（`0 | 6`，默认 `6`）**：固定显示 6 周（高度稳定）还是按当月实际周数（0）。
- **`yearDropBegin`（`number`，默认 `0`）**：年份下拉从今年后几年开始列；负数表示向前。
- **`i18nPrefix`（`"dt-w" | "dt-week"`，默认 `"dt-w"`）**：星期头用短名（日/一/二）还是
  完整名（星期日…）。

### 外观

- **`width` / `height`（`string`，无默认值）**：日历整体宽高。
- **`mainPadding`（`AspectSize`，无默认值）**：主体内边距分级。
- **`cellGap`（`AspectSize | string`，无默认值）**：日期格间距。
- **`cellRadius`（`AspectSize | string`，无默认值）**：日期格圆角。
- **`headBg` / `headColor` / `headFontSize`（`LogicType | AspectSize`）**：星期头背景色、文字
  色、字号。
- **`cellBg` / `cellFontSize`**：普通日期格背景与字号。
- **`cellTodayBg` / `cellTodayColor`**：今日格背景与文字色。
- **`cellCurrentBg` / `cellCurrentColor`**：当前选中格背景与文字色。
- **`yearBox` / `monthBox`（`InputNumProps`）**：顶部年 / 月切换输入框的附加配置。

### 回调

本组件无用户注入的渲染回调；日期格自定义渲染走数据属性 `comType` / `comConf`。

### 嵌套

- **`head` / `tail`（`TextFragment`）**：首尾区域文案片段；分别渲染在头部、尾部。
- **`#head` / `#tail` 插槽**：覆盖默认头部（年 / 月切换 + 今日链接）与尾部；不传插槽时，
  若给了 `head` / `tail` 数据则渲染对应 `TextFragment`，否则用默认切换条。

### 事件

- **`change`**：载荷为按 `valueType` 转换后的日期值（字符串 / Date / 时间戳）；点击某个日期格、
  且与当前 `value` 不同时触发。

> 本组件同时继承 `CommonProps` 与 `ComRef`（`comType` / `comConf`），共享 Props 见
> [共享 Props](../../10.concepts/02-common-props.md)。

## 更多例子

注册表 `exampleProps` 仅含一个内联示例。

### 简单日历（`simple`）

**JSON 配置**

```json
{
  "width": "280px",
  "height": "260px",
  "value": "2025-08-16",
  "cellRadius": "t"
}
```

**Vue 标签**

```xml
<TiCalendar
  width="280px"
  height="260px"
  value="2025-08-16"
  cell-radius="t"
  @change="onChange"
/>
```

## 总结

`TiCalendar` 是受控的月视图日历，负责「选哪一天」。需要带输入框 + 弹层的完整日期录入时，
由上层日期类输入控件组合它；需要按周、按时间槽排程时看 `TiWeeks`、`TiTimeSlots`（目前为
骨架占位）。它不处理范围选择、多选，单日选中才是其边界。

## 延伸阅读

- **源码入口**
  - `src/lib/shelf/calendar/ti-calendar-index.ts` —— 注册表信息与内联示例。
  - `src/lib/shelf/calendar/ti-calendar-types.ts` —— `CalendarProps`、`CalendarEmitter`。
  - `src/lib/shelf/calendar/TiCalendar.vue` —— 月视图渲染与首尾插槽。
  - `src/lib/shelf/calendar/use-ti-calendar-api.ts` —— 月份格子、今日 / 当前判定与值输出。
  - `src/lib/shelf/calendar/use-drop-config.ts` —— 年 / 月下拉配置。
- **相关文档**
  - 按周的排程视图（骨架）：[TiWeeks 周视图](./ti-weeks.md)。
  - 日时间槽（骨架）：[TiTimeSlots 日时间槽](./ti-time-slots.md)。
  - 共享 Props：[共享 Props](../../10.concepts/02-common-props.md)。
