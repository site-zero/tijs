---
title: TiScore 评分条
keywords: [评分, 星级, score, TiScore, 星级评分, 半星, INPUT]
status: draft
---

# TiScore 评分条

## 介绍

`TiScore` 是输入类（`INPUT`）的星级评分条：一排星星，点击某颗星即把分值换算成对应数值
写回。分值区间与星星数量解耦——满分是 10 分也可以只画 5 颗星（每颗代表 2 分），画 10 颗
也行。支持半星。

使用时需要注意：

- `value` 会被限制在 `[minValue, maxValue]` 内；默认区间 `0~10`，默认 5 颗星。
- 点击星星按「该星在整排中的位置 × 单星分值」换算；`allowHalf: false` 后只能整星取值。
- 星星颜色由 `starColorType`（状态色）控制，描边颜色由 `starBorderColorType` 单独控制。
- **源码现状（未修复，使用前注意）**：`TiScore.vue` 的 `withDefaults` 把默认值键写成了
  `starts`、`allowHalfStart`，与类型声明的 `stars`、`allowHalf` 不对应。`stars` 在
  `use-score-api.ts` 内有 `?? 5` 兜底，默认 5 颗星仍生效；`allowHalf` 没有兜底，未显式传
  `allowHalf: true` 时运行时为假值，**半星默认实际关闭**。此处为源码缺陷，文档不替它补默认值。

源码目录：`src/lib/input/score/`。

## 例子

### JSON 配置

```json
{
  "value": 6.8
}
```

### Vue 标签调用

```xml
<TiScore :value="6.8" @change="onChange" />
```

## 控件参数

### 数据

- **`value`（`number`，默认 `0`）**：当前分值，不得超出 `[minValue, maxValue]`。
- **`minValue`（`number`，默认 `0`）**：分值下限。
- **`maxValue`（`number`，默认 `10`）**：分值上限。
- **`stars`（`number`，运行时兜底为 `5`）**：用几颗星表示满分。

### 行为

- **`allowHalf`（`boolean`，类型注释为默认 `true`；当前运行时未兜底，不显式传值即为假）**：展示与取值时是否允许半星。受上文源码现状说明影响。

### 外观

- **`starFontSize`（`AspectSizeInput`，无默认值）**：星星字号分级。
- **`starGap`（`AspectSizeInput`，无默认值）**：星星间距分级。
- **`starItemPadding`（`AspectSizeInput`，无默认值）**：单个星星的内边距分级。
- **`starColorType`（`LogicType`，无默认值）**：星星填充状态色。
- **`starColorSuffix`（`LogicColorSuffix | null`，无默认值）**：填充色的后缀变体。
- **`starBorderColorType`（`LogicType`，无默认值）**：星星描边状态色。
- **`starBorderColorSuffix`（`LogicColorSuffix | null`，无默认值）**：描边色的后缀变体。
- **`starStyle` / `starIconStyle`（`Vars`，无默认值）**：整颗星 / 星图标的内联样式。

### 回调

本组件无此组参数。

### 嵌套

本组件未提供插槽，星星由组件内部按 `value` 换算渲染。

### 事件

- **`change`**：载荷为 `number`；点击星星后触发，为换算后的新分值。

> 本组件同时继承 `CommonProps`（`className`、`style`），字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单评分（`simple`）

**JSON 配置**

```json
{
  "value": 6.8
}
```

**Vue 标签**

```xml
<TiScore :value="6.8" />
```

### 允许半星（`allow-half`）

**JSON 配置**

```json
{
  "value": 2.4,
  "allowHalf": true,
  "starColorType": "success"
}
```

**Vue 标签**

```xml
<TiScore :value="2.4" :allow-half="true" star-color-type="success" />
```

### 定制范围（`in-scope`）

**JSON 配置**

```json
{
  "value": 70,
  "allowHalf": true,
  "minValue": 40,
  "maxValue": 100,
  "starColorType": "info",
  "starColorSuffix": "r",
  "starBorderColorType": "info"
}
```

**Vue 标签**

```xml
<TiScore
  :value="70"
  :allow-half="true"
  :min-value="40"
  :max-value="100"
  star-color-type="info"
  star-color-suffix="r"
  star-border-color-type="info"
/>
```

### 10 星（`10stars`）

**JSON 配置**

```json
{
  "value": 70,
  "allowHalf": false,
  "maxValue": 100,
  "stars": 10,
  "starFontSize": "t"
}
```

**Vue 标签**

```xml
<TiScore
  :value="70"
  :allow-half="false"
  :max-value="100"
  :stars="10"
  star-font-size="t"
/>
```

## 总结

`TiScore` 适合评价、满意度、打分类录入；需要 0~100 的滑杆式打分时它并不顺手，应改用数字
输入或滑杆控件。它把「分值区间」和「星星个数」解耦，注意点击换算结果是按星数均分区间，
半星粒度受 `allowHalf` 控制。

## 延伸阅读

- **源码入口**
  - `src/lib/input/score/ti-score-index.ts` —— 注册表信息与示例配置。
  - `src/lib/input/score/ti-score-types.ts` —— `ScoreProps`、`ScoreEmitter`、
    `ScoreStars`。
  - `src/lib/input/score/TiScore.vue` —— 星星列表视图。
  - `src/lib/input/score/use-score-api.ts` —— 分值到满 / 半 / 空星的换算与点击处理。
- **相关文档**
  - 状态色与尺度变量：[样式系统](../../10.concepts/05-style-system.md)。
  - 共享 Props：[共享 Props](../../10.concepts/02-common-props.md)。
