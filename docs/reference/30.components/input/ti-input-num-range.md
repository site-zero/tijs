---
title: TiInputNumRange 数字区间
keywords: [数字区间, 范围, range, TiInputNumRange, 大小区间, 比较对象, 区间选择]
status: draft
---

# TiInputNumRange 数字区间

## 介绍

`TiInputNumRange` 是输入类（`INPUT`）的数值区间控件：它不录入单个数字，而是表达"一个范围"，
比如 `1 ≤ N ≤ 99`、`N < 5`、`N == 12`。点击后弹出编辑对话框，用两个 `TiInputNum` 分别填上下界、
用开关决定边界是否包含。同一个区间可以在字符串、数组、区间信息对象、Mongo 风格比较对象四种
形态之间转换。

使用时需要注意：

- 提交值的形态由 `valueType` 决定；`"auto"` 时按传入值类型自动推断。
- 未设置边界的一侧视为开放（无上界 / 无下界）。

源码目录：`src/lib/input/num-range/`。

## 例子

### JSON 配置

```json
{
  "value": "[1,23]"
}
```

### Vue 标签调用

```xml
<TiInputNumRange value="[1,23]" @change="onChange" />
```

## 控件参数

### 数据

- **`value`（`RangeValue<number> | null`）**：区间值，可以是字符串 `"[1,23]"`、二元数组 `[1, 99]`、
  区间信息对象 `{ hasMinValue, minValue, minValueIncluded, ... }`，或比较对象 `{ $gte, $lte, $lt, $gt, $eq, $ne }`。
- **`valueType`（`"str" | "array" | "info" | "obj" | "auto"`，默认 `"auto"`）**：值与提交值的形态。

### 行为

- **`readonly`（`boolean`）**：是否只读，只读时只展示区间描述、不弹编辑框。
- **`checkComConf`（`CheckProps`）**：区间校验 / 比较方式选择控件的配置。
- **`valueComType` / `valueComConf`（`InputNumProps`）**：两个数字输入控件的类型与定制配置。

### 外观

- **`dialog`（`Omit<AppModalProps, "comType" | "comConf">`）**：编辑区间弹窗的外观配置（标题、尺寸等）。

### 回调

本组件无此组参数。

### 嵌套

本组件未提供内容插槽；编辑弹窗内部由两个数字输入与一组比较开关组成，不可替换。

### 事件

- **`change`**：载荷为新区间值（`RangeValue<number> | null`）；弹窗确认后触发。

> 本组件继承 `CommonProps`（`className`、`style`），字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单区间（`simple`）

**JSON 配置**

```json
{
  "value": "[1,23]"
}
```

**Vue 标签**

```xml
<TiInputNumRange value="[1,23]" />
```

### 表单信息（`as-info`）

**JSON 配置**

```json
{
  "value": {
    "hasMinValue": true,
    "minValue": 1,
    "minValueIncluded": true,
    "hasMaxValue": true,
    "maxValue": 99,
    "maxValueIncluded": true
  },
  "valueType": "info"
}
```

**Vue 标签**

```xml
<TiInputNumRange
  :value="{
    hasMinValue: true,
    minValue: 1,
    minValueIncluded: true,
    hasMaxValue: true,
    maxValue: 99,
    maxValueIncluded: true
  }"
  value-type="info"
/>
```

### 比较对象（`as-obj`）

**JSON 配置**

```json
{
  "value": { "$gte": 1, "$lte": 99 },
  "valueType": "obj"
}
```

**Vue 标签**

```xml
<TiInputNumRange :value="{ $gte: 1, $lte: 99 }" value-type="obj" />
```

### 数组值（`as-array`）

**JSON 配置**

```json
{
  "value": [1, 99],
  "valueType": "array"
}
```

**Vue 标签**

```xml
<TiInputNumRange :value="[1, 99]" value-type="array" />
```

## 总结

`TiInputNumRange` 适合筛选条件、数值区间这类"不是单值而是范围"的录入；只需单个数字时用
`TiInputNum`。它内部复用 `TiInputNum` 与弹窗，界面较重，轻量表单不建议滥用。

## 延伸阅读

- **源码入口**
  - `src/lib/input/num-range/ti-input-num-range-index.ts` —— 注册表信息与示例配置。
  - `src/lib/input/num-range/inrange-types.ts` —— `InputNumRangeProps`、`InputNumRangeEmitter`。
  - `src/lib/input/num-range/TiInputNumRange.vue` —— 视图与弹窗接线。
  - `src/lib/input/num-range/use-inrange-api.ts` —— 区间值四种形态互转。
  - `src/lib/_features/range/use-input-range-api.ts` —— 区间公共 hook。
- **相关文档**
  - 单值数字输入：[ti-input-num](ti-input-num.md)。
  - 共享 Props：[共享 Props](../../10.concepts/02-common-props.md)。
