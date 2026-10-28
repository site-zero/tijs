---
title: TiInputNum 数字输入框
keywords: [数字输入, number, TiInputNum, 金额格式化, 千分位, 数字分段, 精度]
status: draft
---

# TiInputNum 数字输入框

## 介绍

`TiInputNum` 是输入类（`INPUT`）的数字输入框：只接受数字录入，并在展示层做格式化——精度、
小数位补零、千分位分段、左补零、从左或从右分段（分别适合金额与银行卡号）。它能附带前后缀
图标，也能挂一个字典做值候选。

使用时需要注意：

- `precision` 用整数基数表达精度：`100` 精确到小数点后两位，`1` 精确到个位，`0.01` 精确到百位。
- 分段方向 `partTo` 默认 `"left"`（从右向左分组，金额用）；银行账号 / 激活码用 `"right"`。

源码目录：`src/lib/input/num/`。

## 例子

### JSON 配置

```json
{
  "value": 500.32,
  "precision": 100
}
```

### Vue 标签调用

```xml
<TiInputNum :value="500.32" :precision="100" @change="onChange" />
```

## 控件参数

### 数据

- **`value`（`number | string | boolean | null`，默认 `null`）**：当前数值。
- **`valueType`（`"num" | "str" | "fixed" | "auto"`）**：提交值的形态——数字、字符串或定点串。
- **`options`（`OptionsInput`）**：可挂字典做候选，规则见 [字典模型](../../10.concepts/06-dict-model.md)。
- **`prefixIcon` / `prefixHoverIcon` / `prefixIconFor`、`suffixIcon` / `suffixHoverIcon` / `suffixIconFor`**：
  来自 `TiInput` 的前后缀图标与动作，取值同 box3，见 [ti-input](ti-input.md)。

### 行为

- **`readonly`（`any`）**：只读条件，见 [共享 Props](../../10.concepts/02-common-props.md)。
- **`autoSelect`（`boolean`，默认 `true`）**：聚焦后自动全选内容。
- **`autoFocus`（`boolean`）**：创建时自动聚焦。
- **`minValue` / `maxValue`（`number`）**：取值上下限（含边界）。

### 外观

- **`precision`（`number`，默认 `0`）**：精度基数，见上文。
- **`decimalPlaces`（`number`，默认 `0`）**：固定保留的小数位，不足补零。
- **`partWidth`（`number`，默认 `3`）**：分段后每段字符长度。
- **`partSep`（`string`，默认 `","`）**：段与段之间的分隔符。
- **`partTo`（`"left" | "right"`，默认 `"left"`）**：分段方向——从右向左（金额）或从左向右（卡号）。
- **`padStart`（`number`）**：左填充到的宽度。
- **`padChar`（`string`，默认 `"0"`）**：左填充使用的占位字符。
- **`align`（`CssAlignment`，默认 `"right"`）**：数字右对齐。
- **`type` / `boxFontSize` / `boxPadding` / `boxRadius` / `width` / `hideBorder` 等**：来自 `BoxAspectProps`，
  见 [样式系统](../../10.concepts/05-style-system.md)。
- **占位文本**：`placeholder`、`autoI18n` 见 [共享 Props](../../10.concepts/02-common-props.md)。

### 回调

本组件无此组参数。

### 嵌套

本组件未提供插槽，数字与前后缀图标由上述属性决定。

### 事件

- **`change`**：载荷为新数值（`number | string | null`）；编辑提交时触发。

> 本组件继承 `CommonProps`（`className`、`style`），字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单数字（`simple`）

**JSON 配置**

```json
{
  "value": 500.32,
  "precision": 100
}
```

**Vue 标签**

```xml
<TiInputNum :value="500.32" :precision="100" />
```

### 分段显示（`partly`）

**JSON 配置**

```json
{
  "value": "4008 - 9934 - 5792 - 865",
  "precision": 1,
  "partTo": "right",
  "partSep": " - ",
  "partWidth": 4
}
```

**Vue 标签**

```xml
<TiInputNum
  value="4008 - 9934 - 5792 - 865"
  :precision="1"
  part-to="right"
  part-sep=" - "
  :part-width="4"
/>
```

### 货币金额（`amount`）

**JSON 配置**

```json
{
  "value": "3167894.78",
  "precision": 1,
  "partSep": ",",
  "partWidth": 3
}
```

**Vue 标签**

```xml
<TiInputNum value="3167894.78" :precision="1" part-sep="," :part-width="3" />
```

## 总结

`TiInputNum` 适合需要格式化的数字录入（金额、卡号、激活码）；需要"数字 + 单位"组合时用
`TiInputNumUnit`，需要表达区间大小时用 `TiInputNumRange`；普通整数录入可省略全部分段参数。

## 延伸阅读

- **源码入口**
  - `src/lib/input/num/ti-input-num-index.ts` —— 注册表信息与示例配置。
  - `src/lib/input/num/ti-input-num-types.ts` —— `InputNumProps`。
  - `src/lib/input/num/TiInputNum.vue` —— 视图与数字格式化接线。
- **相关文档**
  - 数字带单位：[ti-input-num-unit](ti-input-num-unit.md)。
  - 数字区间：[ti-input-num-range](ti-input-num-range.md)。
  - 前后缀图标来源：[ti-input](ti-input.md)。
