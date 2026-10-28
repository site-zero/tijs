---
title: TiCheck 勾选框
keywords: [勾选框, 复选框, checkbox, TiCheck, 布尔开关, 勾选, 自定义真假值]
status: draft
---

# TiCheck 勾选框

## 介绍

`TiCheck` 是输入类（`INPUT`）的勾选框：一个可勾选 / 取消的小方块，旁边可带文字、图标与悬浮提示。
它不只表达布尔值——通过 `values` 可以把"勾上 / 勾下"映射成任意一对值（数字、字符串、对象），
适合做字段的"开 / 关"或"是 / 否"。

使用时需要注意：

- `values` 是 `[假值, 真值]` 的二元组；未声明时按 `value` 类型取 `[false, true]`（数字则为 `[0, 1]`）。
- `text` / `icon` / `tip` 都可以传二元组，分别表示"未选中 / 选中"两态内容。

源码目录：`src/lib/input/check/`。

## 例子

### JSON 配置

```json
{
  "value": true,
  "text": "hello"
}
```

### Vue 标签调用

```xml
<TiCheck :value="true" text="hello" @change="onChange" />
```

## 控件参数

### 数据

- **`value`（`any`）**：当前勾选值；与 `values` 中的某一项相等即为"选中"。
- **`values`（`[any, any]`）**：`[未选中值, 选中值]`；切换时把对面那项作为 `change` 载荷发出。
- **`text`（`string | string[]`）**：勾选旁文字；二元组区分两态，支持 `i18n:` 前缀。
- **`icon`（`IconInput | [IconInput, IconInput]`）**：勾选框图标；二元组区分两态。
- **`tip`（`string | string[]`）**：悬浮提示；二元组区分两态。

### 行为

- **`isTrue`（`(val: any) => boolean`）**：自定义"当前是否算选中"的判定；缺省用 `values[1]` 等值比较。
- **`readonly`（`any`）**：只读条件，见 [共享 Props](../../10.concepts/02-common-props.md)。

### 外观

- **`type`（`LogicType`）**：选中态状态色。
- **`boxFontSize`（`AspectSize`）**：字号分级。

### 回调

- **`tipable`（`TipableProps`）**：悬浮提示的挂载配置，见 [共享 Props](../../10.concepts/02-common-props.md)。

### 嵌套

本组件未提供插槽，勾选框、文字与图标全部由上述数据属性决定。

### 事件

- **`change`**：载荷为切换后的新值（`values` 中的对应项）；点击勾选框时触发。

> 本组件继承 `CommonProps`（`className`、`style`），字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单勾选（`simple`）

**JSON 配置**

```json
{
  "value": true,
  "text": "hello"
}
```

**Vue 标签**

```xml
<TiCheck :value="true" text="hello" />
```

### 指定值（`customized-values`）

**JSON 配置**

```json
{
  "value": "Hello",
  "text": ["I said: 'Hello'", "I said: 'World'"],
  "values": ["Hello", "World"]
}
```

**Vue 标签**

```xml
<TiCheck
  value="Hello"
  :text="['I said: \'Hello\'', 'I said: \'World\'']"
  :values="['Hello', 'World']"
/>
```

### 指定数字（`cus-number`）

**JSON 配置**

```json
{
  "value": 19,
  "text": "Actived",
  "values": [12, 19]
}
```

**Vue 标签**

```xml
<TiCheck :value="19" text="Actived" :values="[12, 19]" />
```

### 指定任意值（`cus-any`）

**JSON 配置**

```json
{
  "value": { "color": "red" },
  "text": "Actived",
  "values": [{ "color": "red" }, { "age": 18 }]
}
```

**Vue 标签**

```xml
<TiCheck
  :value="{ color: 'red' }"
  text="Actived"
  :values="[{ color: 'red' }, { age: 18 }]"
/>
```

### 带图标 · 提示（`with-icon-tip`）

**JSON 配置**

```json
{
  "value": true,
  "type": "secondary",
  "icon": "fas-spinner fa-spin",
  "text": "i18n:ti-toggle-example-loading",
  "tip": "i18n:ti-toggle-example-loading-tip",
  "boxFontSize": "h"
}
```

**Vue 标签**

```xml
<TiCheck
  :value="true"
  type="secondary"
  icon="fas-spinner fa-spin"
  text="i18n:ti-toggle-example-loading"
  tip="i18n:ti-toggle-example-loading-tip"
  box-font-size="h"
/>
```

## 总结

`TiCheck` 适合单个布尔 / 二元字段；需要从多个候选项里多选时用 `TiCheckList`，单选时用
`TiRadioList`，需要滑动式开关外观时用 `TiToggle`。

## 延伸阅读

- **源码入口**
  - `src/lib/input/check/ti-check-index.ts` —— 注册表信息与示例配置。
  - `src/lib/input/check/ti-check-types.ts` —— `CheckProps`。
  - `src/lib/input/check/TiCheck.vue` —— 视图与切换接线。
  - `src/lib/_features/use-boolean-input.ts` —— 真假值映射与两态内容 hook。
- **相关文档**
  - 滑动开关：[ti-toggle](ti-toggle.md)。
  - 候选项多选：[ti-check-list](ti-check-list.md)。
