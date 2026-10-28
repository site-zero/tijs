---
title: TiInputDate 日期选择
keywords: [日期, 日历, date, TiInputDate, 日期选择, 日历浮层, INPUT]
status: draft
---

# TiInputDate 日期选择

## 介绍

`TiInputDate` 是输入类（`INPUT`）的日期选择框：一个文本输入框，后缀图标默认为日历，
点击后缀图标弹出日历浮层选一天；也可以直接在输入框里手打日期，解析失败会弹出警告提示。
存储格式默认是 `"yyyy-MM-dd"` 字符串，也可以切换成时间戳。

它与 `TiInputDatetime` 共用同一套内部 API（`use-input-datetime-api`），只是默认格式
只到天；浮层里只渲染日历、不带时间输入区。

使用时需要注意：

- 日期解析按 `timezone` 标注的时区处理；输入串若不带时区，按 `valueTimezone`（缺省等于
  `timezone`）解释。
- 开启 `quickInputMode` 后，`2024-05-1` 这类不完整输入会按快速模式补全，而不是直接报错。
- 清空输入框会向外发 `change` 载荷 `null`。

源码目录：`src/lib/input/date/`（内部 API 复用 `src/lib/input/datetime/`）。

## 例子

### JSON 配置

```json
{
  "value": "2024-05-25",
  "format": "d MMM yyyy: E"
}
```

### Vue 标签调用

```xml
<TiInputDate
  value="2024-05-25"
  format="d MMM yyyy: E"
  @change="onChange"
/>
```

## 控件参数

### 数据

- **`value`（`number | Date | string`，无默认值）**：当前日期；支持时间戳、`Date` 对象
  或日期字符串。
- **`valueType`（`"string" | "timestamp"`，默认 `"string"`）**：向外回写的形态——
  `"string"` 按 `valueFormat` 格式化，`"timestamp"` 发毫秒时间戳。
- **`valueFormat`（`string`，默认 `"yyyy-MM-dd"`）**：`valueType` 为 `"string"` 时的
  存储格式串。
- **`format`（`string`，无默认值）**：输入框内的显示格式串，未指定时同 `valueFormat`；
  例如 `"d MMM yyyy: E"` 显示成 `25 May 2024: Sat`。
- **前后缀图标**：`prefixIcon`、`prefixHoverIcon`、`suffixIcon`、`suffixHoverIcon`，
  其中 `suffixIcon` 默认 `"fas-calendar-days"`。

### 行为

- **`autoSelect`（`boolean`，默认 `true`）**：聚焦输入框时自动全选文本。
- **`prefixIconForClean`（`boolean`，无默认值）**：开启后前缀图标作为清除按钮，点击清空值。
- **`quickInputMode`（`DateTimeQuickParseMode`，无默认值）**：快速输入补全模式；示例里用
  `"dmy"`，让 `2024-05-1` 这类缺零日期自动补全。
- **`timezone`（`DateParseOptionsZone`，无默认值）**：控件展示所在时区，缺省取系统上下文
  默认时区。
- **`valueTimezone`（`DateParseOptionsZone`，无默认值）**：解释输入串时用的时区，缺省等于
  `timezone`。
- **`readonly`（来自 `ReadonlyProps`，无默认值）**：只读时不弹日历、不可手打。
- **占位文本**：`placeholder` 字段见 [共享 Props](../../10.concepts/02-common-props.md)。

### 外观

外观通道继承自输入框基类（`BoxAspectProps`），变量来源见
[样式系统](../../10.concepts/05-style-system.md)。

### 回调

本组件无此组参数。

### 嵌套

内部在 `TiInput` 的 `tail` 插槽里渲染日历浮层；该插槽为组件自用，外部不提供业务插槽。

### 事件

- **`change`**：载荷为 `string | number | null`；选中日期、手打解析成功或清空时触发，形态
  由 `valueType` 决定。

> 本组件同时继承 `CommonProps`、`ReadonlyProps`、`PlaceholderProps`，并从输入框基类
> 继承前后缀图标字段，含义见 [共享 Props](../../10.concepts/02-common-props.md)。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单日期（`simple`）

**JSON 配置**

```json
{
  "value": "2024-05-25",
  "format": "d MMM yyyy: E"
}
```

**Vue 标签**

```xml
<TiInputDate
  value="2024-05-25"
  format="d MMM yyyy: E"
/>
```

### 快速输入模式（`quickinput`）

**JSON 配置**

```json
{
  "value": "2024-05-1",
  "format": "d MMM yyyy - EEEE",
  "quickInputMode": "dmy"
}
```

**Vue 标签**

```xml
<TiInputDate
  value="2024-05-1"
  format="d MMM yyyy - EEEE"
  quick-input-mode="dmy"
/>
```

## 总结

`TiInputDate` 适合只关心「哪一天」的字段；需要精确到时分秒时改用 `TiInputDatetime`；
需要起止区间时改用 `TiInputDateRange`；只需要时间点（不绑日期）时用 `TiInputTime`。
它的日历浮层是固定 240×240 的紧凑日历，需要月 / 年视图编排的场景请直接使用 `TiCalendar`。

## 延伸阅读

- **源码入口**
  - `src/lib/input/date/ti-input-date-index.ts` —— 注册表信息与示例配置。
  - `src/lib/input/date/TiInputDate.vue` —— 输入框 + 日历浮层视图。
  - `src/lib/input/datetime/ti-input-datetime-types.ts` —— 共用的 `InputDatetimeProps`、
    `InputDateTimeEmitter`。
  - `src/lib/input/datetime/use-input-datetime-api.ts` —— 日期解析、格式化与回写计算。
- **相关文档**
  - 日期时间完整控件：[ti-input-datetime](ti-input-datetime.md)。
  - 日期区间：[ti-input-date-range](ti-input-date-range.md)。
  - 共享 Props：[共享 Props](../../10.concepts/02-common-props.md)。
