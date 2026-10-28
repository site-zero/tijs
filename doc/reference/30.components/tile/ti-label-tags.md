---
title: TiLabelTags 选项标签
keywords: [标签组, label-tags, tags, TiLabelTags, 多值展示, 字典翻译, 标签云, TILE]
status: draft
---

# TiLabelTags 选项标签

## 介绍

`TiLabelTags` 是小片类（`TILE`）的多值标签展示件：它接受任意形式的 `value`（逗号分隔字符串
或数组），先按字典把每个编码值翻译成标准选项项，再交给内部的 `TiTags` 渲染成一排并列标签。

它与 `TiTags` 的分工是：`TiTags` 直接吃已经是 `TagItem[]` 或 `Vars` 的结构化数据；
`TiLabelTags` 则帮你把一个原始的、未翻译的多值字段（如 `"A,B,C"`）拆好、译好，适合在表格
单元格、详情区里只读回显一组标签。

使用时需要注意：

- `value` 为字符串时按英文逗号 `,` 拆分并去掉两端空格；为数组时逐项转成字符串 ID。
- 声明了字典（`options` 等）就用字典把值翻译成标准项；翻不到时回退为 `startCase` 后的
  原样文字。
- 空值（`null`、`undefined`、空串）渲染空标签区。

源码目录：`src/lib/tile/label-tags/`。

## 例子

### JSON 配置

```json
{
  "value": "A,B,C"
}
```

### Vue 标签调用

```xml
<TiLabelTags value="A,B,C" />
```

## 控件参数

### 数据

- **`value`（`any`，无默认值）**：要展示的多值；逗号分隔字符串或数组均可，逐项翻译后渲染。
- **字典翻译**：`options`、`dictVars`、`getIcon`、`getText`、`getTip`、`getValue` 来自
  `DictProps`，用于把每个值翻译成标准选项项（文字 / 图标 / 提示）；规则见
  [字典模型](../../10.concepts/06-dict-model.md)。

### 行为

本组件自身无额外行为开关；除 `value` 与字典相关字段外，其余属性（`editable`、`tagClickable`、
`nowrap`、`defaultTagType`、`actions`、`vars`、`title`、`boxFontSize` 等）全部透传给内部
`TiTags`，字段含义见 [TiTags](./ti-tags.md)。

### 外观

外观属性随 `TiTags` 透传生效，见 [TiTags](./ti-tags.md)。

### 回调

本组件无此组参数。

### 嵌套

本组件未提供插槽，标签内容完全由 `value` 与字典翻译决定；内部结构由 `TiTags` 托管，不支持
通过 slot 替换。

### 事件

- **`click`**：点击标签区（而非某个具体标签）时触发，无载荷。
- **`click-tag`**：点击某个标签时触发，载荷为该标签对应的 `TagItem`（`icon` / `text` / `tip` /
  `type` / `value` 等）。

> 本组件同时继承 `CommonProps`（`className`、`style`），字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)，本篇不再罗列。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单标签（`simple`）

**JSON 配置**

```json
{
  "value": "A,B,C"
}
```

**Vue 标签**

```xml
<TiLabelTags value="A,B,C" />
```

### 带选项标签组（`with-options`）

**JSON 配置**

```json
{
  "value": "A,B,C",
  "options": [
    { "text": "Option A", "value": "A" },
    { "text": "Option B", "value": "B" },
    { "text": "Option C", "value": "C" }
  ]
}
```

**Vue 标签**

```xml
<TiLabelTags
  value="A,B,C"
  :options="[
    { text: 'Option A', value: 'A' },
    { text: 'Option B', value: 'B' },
    { text: 'Option C', value: 'C' }
  ]"
/>
```

## 总结

`TiLabelTags` 适合只读回显一个翻译过的多值字段：表格里的权限标签、属性集合、分类标签。如果你
手里已经是结构化的 `TagItem[]`，或需要可移除、可排序、带动作条的交互标签，直接用 `TiTags`；
只渲染单个值用 `TiLabel`。`TiLabelTags` 本身不处理移除 / 排序交互，那些能力需落到 `TiTags`
上。

## 延伸阅读

- **源码入口**
  - `src/lib/tile/label-tags/ti-label-tags-index.ts` —— 注册表信息与示例配置。
  - `src/lib/tile/label-tags/ti-label-tags-types.ts` —— `LabelTagsProps`、`LabelTagsEmitter`。
  - `src/lib/tile/label-tags/TiLabelTags.vue` —— 值拆分、字典翻译与透传 TiTags。
- **相关文档**
  - 标签组本体（可移除 / 排序 / 动作条）：[ti-tags](ti-tags.md)。
  - 单值标签：[ti-label](ti-label.md)。
  - 字典值到文字 / 图标的翻译规则：[字典模型](../../10.concepts/06-dict-model.md)。
