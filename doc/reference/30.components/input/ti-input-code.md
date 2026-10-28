---
title: TiInputCode 编号输入
keywords: [编号, code, TiInputCode, 记录主键, 编码输入, 描述区, 字典编号]
status: draft
---

# TiInputCode 编号输入

## 介绍

`TiInputCode` 是输入类（`INPUT`）的"编码 + 描述"输入框，完整继承 `TiInput`（box3）的全部能力，
再在输入框旁加一块描述区：当 `value` 命中字典选项时，把该记录的可读描述（如商品名、用户名）
展示出来，而真正提交的仍是编码值（如 UUID、SKU）。

它对应 `TiInput` 里 `useTextWhenFocus` 的典型场景：聚焦时也显示有意义的描述文字，而不是露出
可怕的主键编码。

使用时需要注意：

- 描述内容由 `getDescription` 指定从选项取哪个字段，描述区可用 `hideDescription` 隐藏。
- 可通过 `customizeStyle` 按当前选中记录动态调整整体外观。

源码目录：`src/lib/input/code/`。

## 例子

### JSON 配置

```json
{
  "value": "BO",
  "placeholder": "Choose WT",
  "options": "#Quantities",
  "optionFilter": { "type": "WAREHOUSE" },
  "optionKeepRaw": true
}
```

### Vue 标签调用

```xml
<TiInputCode
  value="BO"
  placeholder="Choose WT"
  options="#Quantities"
  :option-filter="{ type: 'WAREHOUSE' }"
  :option-keep-raw="true"
  @change="onChange"
/>
```

## 控件参数

### 数据

- **`value`（`any`）**：提交的编码值；完整继承 `TiInput` 的 `value` / `valueType`。
- **`getDescription`（`string | (item: AnyOptionItem) => string`）**：从命中选项取描述文字的字段路径或函数。
- **`descriptionPlaceholder`（`string`）**：未命中选项时描述区显示的占位文本。
- **`options` 等字典字段**：完整继承 `TiInput`，规则见 [字典模型](../../10.concepts/06-dict-model.md)。

### 行为

完整继承 `TiInput` 的行为开关（`canInput`、`mustInOptions`、`tipShowTime`、`autoSelect`、
`useTextWhenFocus` 等），见 [ti-input](ti-input.md)。

### 外观

- **`codeWidth`（`string | number`）**：左侧编码输入框的宽度。
- **`textBoxStyle`（`Vars`）**：右侧描述区的追加内联样式。
- **`gap`（`AspectSize`）**：编码区与描述区之间的间距。
- **`hideDescription`（`boolean`）**：隐藏描述区（`.part-desc`）。
- **其余外观字段**：完整继承 `TiInput`，见 [样式系统](../../10.concepts/05-style-system.md)。

### 回调

- **`customizeStyle`（`(rawItem: Vars | null) => InputCodeCustomizedStyle | undefined | void`）**：
  按当前选中记录动态返回外观覆盖，可改 `boxAspect`（`InputBoxProps`）与 `codeTextStyle`。
- **`showDebugInfo`（`boolean`）**：是否输出调试信息。

### 嵌套

本组件未提供插槽：编码区、描述区由 `TiInput` 与 `getDescription` 数据决定。

### 事件

- **`change`**：载荷为命中选项的 `value`（未命中时为 `null`）；编码提交时触发。其余 `TiInput` 事件
  （`focus` / `blur` / `click:prefix-icon` 等）同样继承。

> 本组件继承 `CommonProps` 与 `TiInput` 的全部共享 Props，见
> [共享 Props](../../10.concepts/02-common-props.md)。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单编号（`simple`）

**JSON 配置**

```json
{
  "placeholder": "Choose WT",
  "options": "#Quantities",
  "optionFilter": { "type": "WAREHOUSE" },
  "optionKeepRaw": true,
  "value": "BO"
}
```

**Vue 标签**

```xml
<TiInputCode
  placeholder="Choose WT"
  options="#Quantities"
  :option-filter="{ type: 'WAREHOUSE' }"
  :option-keep-raw="true"
  value="BO"
/>
```

## 总结

`TiInputCode` 适合"对外展示可读名称、对内保存编码 / 主键"的外键字段录入；只是普通可输入候选用
`TiInput`，纯只读下拉用 `TiDroplist`。它是 `TiInput` 的薄变体，参数主体请对照 `TiInput` 篇。

## 延伸阅读

- **源码入口**
  - `src/lib/input/code/ti-input-code-index.ts` —— 注册表信息与示例配置。
  - `src/lib/input/code/ti-input-code-types.ts` —— `InputCodeProps`。
  - `src/lib/input/code/TiInputCode.vue` —— 编码区 + 描述区视图。
- **相关文档**
  - 能力底座：[ti-input](ti-input.md)。
  - 字典值到文字翻译：[字典模型](../../10.concepts/06-dict-model.md)。
