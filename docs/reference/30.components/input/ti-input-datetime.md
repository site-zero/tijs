---
title: TiInputDatetime 日期时间框
keywords: [日期时间, datetime, TiInputDatetime, 日期时间选择, 日历加时间, INPUT]
status: draft
---

# TiInputDatetime 日期时间框

## 介绍

`TiInputDatetime` 是输入类（`INPUT`）的日期时间选择框：在 `TiInputDate` 的基础上，日历
浮层底部多了一条时间输入区（`TiInputTime`），选完日期再补时分秒，一次性落定完整时间点。
存储默认格式 `"yyyy-MM-dd HH:mm:ss"`。

它与 `TiInputDate` 共用同一套内部 API（`use-input-datetime-api`），差异只是默认格式串与
浮层里是否渲染时间区。

使用时需要注意：

- 时间区按 `timeMode` 决定显示到分还是秒；`timeInput` 可微调数字输入框外观。
- 时区处理、快速输入、清空发 `null` 等行为与 `TiInputDate` 一致。
- 浮层尺寸约为 240×340，比纯日历高，注意弹窗避让。

源码目录：`src/lib/input/datetime/`。

## 例子

### JSON 配置

```json
{
  "value": "2024-05-25 18:30:13",
  "format": "d-Mmm-yyyy HH:mm"
}
```

### Vue 标签调用

```xml
<TiInputDatetime
  value="2024-05-25 18:30:13"
  format="d-Mmm-yyyy HH:mm"
  @change="onChange"
/>
```

## 控件参数

### 数据

- **`value`（`number | Date | string`，无默认值）**：当前时间点；支持时间戳、`Date` 对象
  或时间字符串。
- **`valueType`（`"string" | "timestamp"`，默认 `"string"`）**：向外回写的形态。
- **`valueFormat`（`string`，默认 `"yyyy-MM-dd HH:mm:ss"`）**：`valueType` 为 `"string"`
  时的存储格式串。
- **`format`（`string`，无默认值）**：输入框显示格式串，未指定时同 `valueFormat`。
- **前后缀图标**：`prefixIcon`、`prefixHoverIcon`、`suffixIcon`、`suffixHoverIcon`，
  `suffixIcon` 默认 `"fas-calendar-days"`。

### 行为

- **`autoSelect`（`boolean`，默认 `true`）**：聚焦时自动全选文本。
- **`prefixIconForClean`（`boolean`，无默认值）**：前缀图标作为清除按钮。
- **`quickInputMode`（`DateTimeQuickParseMode`，无默认值）**：快速输入补全模式。
- **`timezone` / `valueTimezone`（`DateParseOptionsZone`，无默认值）**：展示时区 / 输入串
  解释时区。
- **`timeMode`（`InputTimeMode`，默认 `"sec"`）**：时间区精度，`"min"` 显示 `HH:mm`、
  `"sec"` 显示 `HH:mm:ss`。
- **`readonly`（来自 `ReadonlyProps`，无默认值）**：只读时不弹浮层。

### 外观

- **`timeInput`（`InputNumProps`，无默认值）**：时间区每个数字输入框的外观配置，默认
  `boxFontSize: "b"`、`boxPadding: "m"`、`width: "3em"`。
- 其余外观通道继承自输入框基类，变量来源见
  [样式系统](../../10.concepts/05-style-system.md)。

### 回调

本组件无此组参数。

### 嵌套

内部在 `TiInput` 的 `tail` 插槽、`TiCalendar` 的 `tail` 插槽里渲染浮层与时间区；外部不
提供业务插槽。

### 事件

- **`change`**：载荷为 `string | number | null`；选日期、改时间或清空时触发，形态由
  `valueType` 决定。

> 本组件同时继承 `CommonProps`、`ReadonlyProps`、`PlaceholderProps`，共享字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单日期时间（`simple`）

**JSON 配置**

```json
{
  "value": "2024-05-25 18:30:13",
  "valueFormat": "2024-05-25 18:30",
  "format": "d-Mmm-yyyy HH:mm"
}
```

**Vue 标签**

```xml
<TiInputDatetime
  value="2024-05-25 18:30:13"
  value-format="2024-05-25 18:30"
  format="d-Mmm-yyyy HH:mm"
/>
```

### 快速输入模式（`quickinput`）

**JSON 配置**

```json
{
  "value": "2024-05-1 19:24:38",
  "format": "d MMM yyyy - EEEE HH:mm:ss",
  "quickInputMode": "dmy",
  "width": "400px"
}
```

**Vue 标签**

```xml
<TiInputDatetime
  value="2024-05-1 19:24:38"
  format="d MMM yyyy - EEEE HH:mm:ss"
  quick-input-mode="dmy"
  width="400px"
/>
```

## 总结

`TiInputDatetime` 适合「精确到分 / 秒的时间点」录入，例如创建时间、预约时刻。只需要日期
时用 `TiInputDate`；只需要一天内的时间点（不绑日期）用 `TiInputTime`；需要区间时用
`TiInputDateRange`。注意它的浮层比纯日历高，在窄屏或底部贴边场景要预留避让空间。

## 延伸阅读

- **源码入口**
  - `src/lib/input/datetime/ti-input-datetime-index.ts` —— 注册表信息与示例配置。
  - `src/lib/input/datetime/ti-input-datetime-types.ts` —— `InputDatetimeProps`、
    `InputDateTimeEmitter`。
  - `src/lib/input/datetime/TiInputDatetime.vue` —— 视图、日历与时间区接线。
  - `src/lib/input/datetime/use-input-datetime-api.ts` —— 日期解析、格式化与回写计算。
- **相关文档**
  - 只到天的日期控件：[ti-input-date](ti-input-date.md)。
  - 一天内时间点控件：[ti-input-time](ti-input-time.md)。
  - 共享 Props：[共享 Props](../../10.concepts/02-common-props.md)。
