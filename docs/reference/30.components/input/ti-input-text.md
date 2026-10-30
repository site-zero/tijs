---
title: TiInputText 文本框
keywords: [文本框, textarea, TiInputText, 多行文本, 列表值, 文本输入]
status: draft
---

# TiInputText 文本框

## 介绍

`TiInputText` 是输入类（`INPUT`）的纯文本框，按 `valueType` 分两种形态：`"text"` 是单行
文本输入；`"list"` 把一个字符串数组渲染成逐行可编辑的列表，每行一个条目。它不带字典、不带
候选提示，定位是最朴素的文字录入。

使用时需要注意：

- `valueType: "list"` 时 `value` 传字符串数组，每行对应一个数组项。
- 可通过 `actionBar` 在文本框四周挂一组操作按钮，位置由 `actionBarPosition` 指定。

源码目录：`src/lib/input/text/`。

## 例子

### JSON 配置

```json
{
  "value": "hello world"
}
```

### Vue 标签调用

```xml
<TiInputText value="hello world" @change="onChange" />
```

## 控件参数

### 数据

- **`value`（`any`，无默认值）**：文本框内容；`valueType: "list"` 时应为字符串数组。
- **`valueType`（`"list" | "text"`，默认 `"text"`）**：文本形态——单行文本或逐行列表。
- **`trimed`（`boolean`）**：提交时是否去掉文本首尾空白。
- **占位文本**：`placeholder`、`autoI18n` 见 [共享 Props](../../10.concepts/02-common-props.md)。

### 行为

- **`readonly`（`any`）**：只读条件，可取布尔、函数或 `Match` 描述，见 [共享 Props](../../10.concepts/02-common-props.md)。

### 外观

- **`width` / `height`（`number | string`）**：文本框宽高，如 `"12em"`、`300`。
- **`hideBorder`（`boolean`）**：是否隐藏边框。
- **`inputStyle`（`Vars`）**：输入元素追加的内联样式。

### 回调

- **`actionBar`（`ActionBarProps`）**：动作条配置，用于在文本框旁放一组操作按钮。

### 嵌套

- **动作条位置**：`actionBarPosition`（`"top" | "bottom" | "left" | "right"`，默认 `"top"`）
  决定 `actionBar` 渲染在文本框的哪一侧。本组件未提供内容插槽，文字内容由 `value` 决定。

### 事件

- **`change`**：载荷为新文本值；编辑提交时触发。

> 本组件继承 `CommonProps`（`className`、`style`），字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单文本（`simple`）

**JSON 配置**

```json
{
  "value": "hello world"
}
```

**Vue 标签**

```xml
<TiInputText value="hello world" />
```

### 列表值（`list`）

**JSON 配置**

```json
{
  "valueType": "list",
  "height": "12em",
  "value": ["cat", "dog", "bird", "fish", "tigger"]
}
```

**Vue 标签**

```xml
<TiInputText
  value-type="list"
  height="12em"
  :value="['cat', 'dog', 'bird', 'fish', 'tigger']"
/>
```

### 只读（`readonly`）

**JSON 配置**

```json
{
  "value": "hello",
  "readonly": true,
  "height": "18em"
}
```

**Vue 标签**

```xml
<TiInputText value="hello" :readonly="true" height="18em" />
```

## 总结

`TiInputText` 适合无候选、无字典的朴素文字录入；需要自动补全 / 字典候选时改用 `TiInput`，
需要标签式多选录入时改用 `TiInputMultiLines`，需要密码遮蔽时改用 `TiInputPassword`。

## 延伸阅读

- **源码入口**
  - `src/lib/input/text/ti-input-text-index.ts` —— 注册表信息与示例配置。
  - `src/lib/input/text/ti-input-text-types.ts` —— `InputTextProps`、`InputTextEmitter`。
  - `src/lib/input/text/TiInputText.vue` —— 视图与状态接线。
  - `src/lib/input/text/ti-input-text-api.ts` —— 内部计算 hook。
- **相关文档**
  - 基础输入框（带候选提示）：[ti-input](ti-input.md)。
  - 共享只读 / 占位规则：[共享 Props](../../10.concepts/02-common-props.md)。
