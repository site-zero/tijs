---
title: TiInputTime 时间框
keywords: [时间, 时间框, time, TiInputTime, 时分秒, 一天内时间, INPUT]
status: draft
---

# TiInputTime 时间框

## 介绍

`TiInputTime` 是输入类（`INPUT`）的时间框：把「一天内的某个时刻」拆成几个并列的数字
输入框——时 `:` 分，按 `timeMode` 再加秒——直接键入数字即可，不弹任何日历。它不绑定日期，
只表达 `HH:mm` 或 `HH:mm:ss` 这样的时刻。

它也是 `TiInputDatetime` 浮层里复用的时间输入区。

使用时需要注意：

- `value` 接受多种形态：字符串 `"12:34:56"`、`"12:34"`，从零点起的秒数 `45678`，或
  对象 `{ hours, minutes, seconds }`。
- 回写形态由 `valueType` 决定：`"str"` 字符串、`"sec"` 秒数、`"obj"` 时分秒对象。
- 时 / 分 / 秒各自的范围由内部 `max-value` 限制（时 23、分秒 59），`timeMode: "min"` 时
  秒段不渲染。

源码目录：`src/lib/input/time/`。

## 例子

### JSON 配置

```json
{
  "value": "09:15"
}
```

### Vue 标签调用

```xml
<TiInputTime value="09:15" @change="onChange" />
```

## 控件参数

### 数据

- **`value`（`TimeInput | null`，无默认值）**：当前时刻；支持时间字符串、秒数或
  `{ hours, minutes, seconds }` 对象。
- **`valueType`（`"str" | "sec" | "obj"`，默认 `"str"`）**：向外回写的形态——
  `"str"` 如 `"12:34:56"`，`"sec"` 如 `3688`（01:01:28），`"obj"` 为时分秒对象。

### 行为

- **`timeMode`（`InputTimeMode`，默认 `"min"`）**：`"min"` 显示 `HH:mm`，`"sec"` 显示
  `HH:mm:ss`。
- **`readonly`（`boolean`，无默认值）**：只读时各数字框不可编辑。

### 外观

- **`input`（`InputNumProps`，无默认值）**：每个数字输入框的外观配置；默认
  `boxFontSize: "s"`、`boxPadding: "s"`、`width: "2em"`、居中对齐、两位补零。

### 回调

本组件无此组参数。

### 嵌套

本组件未提供插槽，时 / 分 / 秒段由组件内部按 `timeMode` 渲染。

### 事件

- **`change`**：载荷为 `TimeInput`（形态由 `valueType` 决定）；任一段数字变化时触发。

> 本组件同时继承 `CommonProps`（`className`、`style`），字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单时间（`simple`）

**JSON 配置**

```json
{
  "value": "09:15"
}
```

**Vue 标签**

```xml
<TiInputTime value="09:15" />
```

### 精确到秒（`sec`）

**JSON 配置**

```json
{
  "value": "12:34:56",
  "timeMode": "sec"
}
```

**Vue 标签**

```xml
<TiInputTime value="12:34:56" time-mode="sec" />
```

### 大字体（`big`）

**JSON 配置**

```json
{
  "value": "09:15",
  "timeMode": "sec",
  "input": {
    "boxFontSize": "h",
    "boxPadding": "m",
    "width": "3em"
  }
}
```

**Vue 标签**

```xml
<TiInputTime
  value="09:15"
  time-mode="sec"
  :input="{ boxFontSize: 'h', boxPadding: 'm', width: '3em' }"
/>
```

## 总结

`TiInputTime` 适合营业时段、定时规则这类「只关心一天内几点」的字段；需要绑定完整日期时用
`TiInputDatetime`。它是纯数字输入、无浮层，版面紧凑；想做大屏展示 / 报表场景时通过
`input` 放大字号即可。

## 延伸阅读

- **源码入口**
  - `src/lib/input/time/ti-input-time-index.ts` —— 注册表信息与示例配置。
  - `src/lib/input/time/ti-input-time-types.ts` —— `InputTimeProps`、`InputTimeEmitter`、
    `InputTimeMode`。
  - `src/lib/input/time/TiInputTime.vue` —— 时分秒数字框视图。
  - `src/lib/input/time/use-input-time-api.ts` —— 时刻解析与更新。
- **相关文档**
  - 日期时间完整控件：[ti-input-datetime](ti-input-datetime.md)。
  - 共享 Props：[共享 Props](../../10.concepts/02-common-props.md)。
