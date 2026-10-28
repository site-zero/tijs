---
title: TiInputDateRange 日期范围
keywords: [日期范围, 区间, date-range, TiInputDateRange, 起止日期, 比较条件, INPUT]
status: draft
---

# TiInputDateRange 日期范围

## 介绍

`TiInputDateRange` 是输入类（`INPUT`）的日期区间控件：界面上只显示一段区间描述文字
（如「从 2026-03-01(包括) 至 2026-03-31 (不包括)」），点击后打开编辑对话框，在对话框里
设定起止日期、是否包含端点，再确认写回。它解决的是「一个筛选条件要表达 ≥ / ≤ 这种带开闭
区间的日期范围」。

同一个值支持四种互转形态，由 `valueType` 指定回写格式：

- `"str"`：字符串，如 `"[2026-03-01,2026-03-31]"`；
- `"array"`：二元数组 `["2026-03-01", "2026-03-31"]`；
- `"info"`：范围信息对象 `{ hasMinValue, minValue, minValueIncluded, ... }`；
- `"obj"`：比较对象 `{ $gte, $lte, ... }`，可直接喂给查询条件。

`valueType: "auto"` 时按传入值形态原样回写。

使用时需要注意：

- 未设定区间时界面显示「未指定日期范围」，并带一个关闭按钮用于清除已有区间。
- 编辑对话框宽度由内部固定 `640px`，可通过 `dialog` 覆盖。
- 区间两端的录入控件是 `TiInputDate`。

源码目录：`src/lib/input/date-range/`。

## 例子

### JSON 配置

```json
{
  "value": "[2026-03-01,2026-03-31]",
  "valueType": "str"
}
```

### Vue 标签调用

```xml
<TiInputDateRange
  value="[2026-03-01,2026-03-31]"
  value-type="str"
  @change="onChange"
/>
```

## 控件参数

### 数据

- **`value`（`RangeValue<string> | null`，无默认值）**：区间值；可以是字符串
  `"[2026-03-01,2026-03-31]"`、二元数组、`RangeInfo` 对象或 `RangeObj` 比较对象。
- **`valueType`（`"str" | "array" | "info" | "obj" | "auto"`，默认 `"auto"`）**：向外
  回写的值形态；`"auto"` 按传入形态回写。

### 行为

- **`readonly`（`boolean`，无默认值）**：只读时只显示区间描述文字，不响应编辑 / 清除。
- **`valueComConf`（`InputDatetimeProps`，无默认值）**：区间两端日期录入控件（`TiInputDate`）
  的附加配置。
- **`checkComConf`（`CheckProps`，无默认值）**：「包含端点」勾选框的附加配置。
- **`dialog`（`Omit<AppModalProps, "comType" | "comConf">`，无默认值）**：区间编辑对话框
  的外观配置（默认宽度 `640px`）。

### 外观

外观由根节点的 `className` / `style`（`CommonProps`）控制，变量来源见
[样式系统](../../10.concepts/05-style-system.md)。

### 回调

本组件无此组参数。

### 嵌套

本组件未提供插槽，区间描述文字与操作图标由组件内部渲染。

### 事件

- **`change`**：载荷为 `RangeValue<string> | null`；编辑对话框确认或清除区间后触发，形态
  由 `valueType` 决定。

> 本组件同时继承 `CommonProps`，共享字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单区间（`simple`）

**JSON 配置**

```json
{
  "value": "[2026-03-01,2026-03-31]",
  "valueType": "str"
}
```

**Vue 标签**

```xml
<TiInputDateRange
  value="[2026-03-01,2026-03-31]"
  value-type="str"
/>
```

### 表单信息对象（`as-info`）

**JSON 配置**

```json
{
  "value": {
    "hasMinValue": true,
    "minValue": "2026-04-01",
    "minValueIncluded": true,
    "hasMaxValue": true,
    "maxValue": "2026-04-30",
    "maxValueIncluded": true
  },
  "valueType": "info"
}
```

**Vue 标签**

```xml
<TiInputDateRange
  :value="{
    hasMinValue: true,
    minValue: '2026-04-01',
    minValueIncluded: true,
    hasMaxValue: true,
    maxValue: '2026-04-30',
    maxValueIncluded: true
  }"
  value-type="info"
/>
```

### 比较对象（`as-obj`）

**JSON 配置**

```json
{
  "value": {
    "$gte": "2026-05-01",
    "$lte": "2026-05-31"
  },
  "valueType": "obj"
}
```

**Vue 标签**

```xml
<TiInputDateRange
  :value="{ $gte: '2026-05-01', $lte: '2026-05-31' }"
  value-type="obj"
/>
```

### 数组值（`as-array`）

**JSON 配置**

```json
{
  "value": ["2026-06-01", "2026-06-30"],
  "valueType": "array"
}
```

**Vue 标签**

```xml
<TiInputDateRange
  :value="['2026-06-01', '2026-06-30']"
  value-type="array"
/>
```

## 总结

`TiInputDateRange` 适合筛选条 / 查询表单里的日期区间条件，尤其当后端查询直接接受
`$gte / $lte` 比较对象时；只需要单个日期值时用 `TiInputDate`。它的交互是「文字摘要 +
对话框编辑」，不是内联双日期框，版面占用小但需要一次弹窗确认。

## 延伸阅读

- **源码入口**
  - `src/lib/input/date-range/ti-input-date-range-index.ts` —— 注册表信息与示例配置。
  - `src/lib/input/date-range/daterange-types.ts` —— `InputDateRangeProps`、
    `InputDateRangeEmitter`。
  - `src/lib/input/date-range/TiInputDateRange.vue` —— 区间摘要视图。
  - `src/lib/input/date-range/use-daterange-api.ts` —— 接入通用区间编辑 API。
  - `src/lib/_features/range/use-input-range-api.ts` —— 区间值解析 / 输出与编辑对话框。
- **相关文档**
  - 单日日期控件：[ti-input-date](ti-input-date.md)。
  - 共享 Props：[共享 Props](../../10.concepts/02-common-props.md)。
