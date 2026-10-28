---
title: TiInputNumUnit 带单位数字
keywords: [数字单位, 金额, 重量, 体积, TiInputNumUnit, 单位选择, 货币单位]
status: draft
---

# TiInputNumUnit 带单位数字

## 介绍

`TiInputNumUnit` 是输入类（`INPUT`）的"数字 + 单位"组合框：左侧是一个 `TiInputNum` 录入数值，
右侧是一个单位下拉（内部是 `TiInput`），整体值是一个对象，默认形如
`{ number: 456.24, unit: 'KG' }`。典型用于金额（CNY/USD）、重量（KG/G）、体积（CU/L）这类
需要同时表达数值与度量单位的字段。

使用时需要注意：

- 对象里数值与单位的键名可通过 `getNumber/setNumber/getUnit/setUnit` 重定义。
- 单位侧通过 `units` 传候选字典；`unitSelectOnly` 为 `true` 时单位只能下拉选择、不能手输。

源码目录：`src/lib/input/num-unit/`。

## 例子

### JSON 配置

```json
{
  "value": { "number": 500.32, "unit": "CNY" },
  "units": { "options": "#Currencies" }
}
```

### Vue 标签调用

```xml
<TiInputNumUnit
  :value="{ number: 500.32, unit: 'CNY' }"
  :units="{ options: '#Currencies' }"
  @change="onChange"
/>
```

## 控件参数

### 数据

- **`value`（`Vars`，默认 `{ number, unit }`）**：组合值对象，包含数值与单位两个键。
- **`getNumber` / `setNumber`（`string | (vars) => ...`）**：从值对象读 / 写数值的键路径或函数。
- **`getUnit` / `setUnit`（`string | (vars) => ...`）**：从值对象读 / 写单位的键路径或函数。
- **`numAsStr`（`boolean`）**：非自定义 `setNumber` 时，是否把数值转成字符串写入值对象（为浮点数保真）。
- **`defaultNumber`（`number`，默认 `0`）**：取不到数值时的默认值。
- **`defaultUnit`（`string`）**：取不到单位时的默认值。
- **`units`（`Omit<InputBoxProps, "value">`）**：右侧单位下拉的配置（候选 `options` 等），
  规则见 [字典模型](../../10.concepts/06-dict-model.md)。
- **数字侧格式化参数**：`precision`、`decimalPlaces`、`partWidth`、`partSep`、`partTo` 等全部
  继承自 `TiInputNum`，见 [ti-input-num](ti-input-num.md)。

### 行为

- **`unitSelectOnly`（`boolean`）**：`true` 表示单位只能下拉选择、不允许手输。
- **`readonly`（`any`）**：只读条件，继承自 `TiInputNum`。

### 外观

- **`unitWidth`（`string | number`）**：单位下拉的宽度。
- **`gap`（`AspectSize`）**：数值区与单位区之间的间距。

### 回调

本组件无此组参数。

### 嵌套

本组件未提供插槽：左侧数字、右侧单位两个子控件分别由 `Omit<InputNumProps,"value">` 与 `units`
配置，不支持通过 slot 替换。

### 事件

- **`change`**：载荷为新的值对象（`Vars`，即 `{ number, unit }` 形态）；数值或单位任一改动时触发。

> 本组件继承 `CommonProps`（`className`、`style`），字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 金额（`amount`）

**JSON 配置**

```json
{
  "value": { "number": 500.32, "unit": "CNY" },
  "precise": 100,
  "units": { "options": "#Currencies" }
}
```

**Vue 标签**

```xml
<TiInputNumUnit
  :value="{ number: 500.32, unit: 'CNY' }"
  :precise="100"
  :units="{ options: '#Currencies' }"
/>
```

### 重量（`weight`）

**JSON 配置**

```json
{
  "value": { "number": "9.75", "unit": "KG" },
  "precise": 100,
  "units": { "options": "#WeightUnits" }
}
```

**Vue 标签**

```xml
<TiInputNumUnit
  :value="{ number: '9.75', unit: 'KG' }"
  :precise="100"
  :units="{ options: '#WeightUnits' }"
/>
```

### 体积（`volume`）

**JSON 配置**

```json
{
  "value": { "number": "78.382", "unit": "CU" },
  "precise": 100,
  "units": { "options": "#VolumeUnits", "useRawValue": false, "tipList": {} }
}
```

**Vue 标签**

```xml
<TiInputNumUnit
  :value="{ number: '78.382', unit: 'CU' }"
  :precise="100"
  :units="{ options: '#VolumeUnits', useRawValue: false, tipList: {} }"
/>
```

> 注册表示例里使用的 `precise` 字段在 `InputNumProps` 中声明为 `precision`，这里按示例原样保留。

## 总结

`TiInputNumUnit` 适合"数值 + 度量单位"成对出现的录入；只需数字用 `TiInputNum`，只需单位 / 候选用
`TiDroplist`。单位字典需提前注册（`#Currencies`、`#WeightUnits`、`#VolumeUnits` 等）。

## 延伸阅读

- **源码入口**
  - `src/lib/input/num-unit/ti-input-num-unit-index.ts` —— 注册表信息与示例配置。
  - `src/lib/input/num-unit/ti-input-num-unit-types.ts` —— `InputNumUnitProps`、`InputNumUnitEmitter`。
  - `src/lib/input/num-unit/TiInputNumUnit.vue` —— 数值区与单位区组合接线。
  - `src/lib/input/num-unit/use-num-unit.ts` —— 值对象读写与单位切换。
- **相关文档**
  - 数字侧格式化：[ti-input-num](ti-input-num.md)。
  - 单位下拉候选：[ti-droplist](ti-droplist.md)。
