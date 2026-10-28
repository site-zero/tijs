---
title: TiDropTag 下拉标签
keywords: [下拉标签, 标签, drop tag, dropdown, TiDropTag, 选择器, 芯片, chip]
status: draft
---

# TiDropTag 下拉标签

## 介绍

`TiDropTag` 是动作类（`ACTION`）的小型选择标签：平时以一个紧凑的"芯片"形态展示
当前选中项（图标 + 文字 + 补充说明），点击后在下方弹出一个选项列表，选中某项立即
把新值通过 `change` 事件抛回。它介于 `TiLabel`（纯展示）与 `TiDroplist`（完整
下拉输入）之间，适合语言切换、单位切换、颜色主题、轻量枚举选择等场景。

使用时需要注意：

- 组件根节点 `inheritAttrs: false`，外部传入的普通属性不会自动落到根节点。
- 点击芯片时若选项数据尚未加载，会先按 `options`（字典）配置异步拉取，再展开
  浮层；点击浮层遮罩则收起列表。
- 当前项的展示 HTML 由 `icon` / `text` / `tip` 三段拼成，可通过 `hideIcon` /
  `hideText` / `hideTip` 单独隐藏某一段，或用 `renderHtml` 完全自定义。

源码目录：`src/lib/action/drop-tag/`。

## 例子

### JSON 配置

```json
{
  "value": "zh-cn",
  "options": "#Languages",
  "tipListMinWidth": "150px"
}
```

### Vue 标签调用

```xml
<TiDropTag
  value="zh-cn"
  options="#Languages"
  tip-list-min-width="150px"
  @change="onChange"
/>
```

## 控件参数

### 数据

- **`value`（`any`，默认 `""`）**：当前选中值；会按 `valueType` 解释为选项的
  原生对象 / 标准对象 / 纯值。
- **`valueType`（`"raw-item" | "std-item" | "val"`，默认 `"val"`）**：值的形态。
- **`options`（`DictInput`，无默认值）**：选项来源，可以是字典名（`"#Languages"`）、
  字典配置对象、或直接的 `Vars[]`；规则见
  [字典模型](../../10.concepts/06-dict-model.md)。
- **`dictVars`（`Vars`，无默认值）**：动态字典的变量上下文。
- **`getIcon` / `getText` / `getTip` / `getValue`（`string | Convertor`，无默认值）**：
  从原始选项对象里取图标 / 文字 / 提示 / 值的字段名或转换函数。
- **`placeholder`（`string`，无默认值）**：当前项为空时的占位文本。
- **`fixedOptions` / `optionFilter` / `optionFilterVars` / `optionKeepRaw`**：选项
  固定数据、过滤条件、过滤变量、是否保留原始数据；字段含义由共享选项管道提供。
- **`showCleanOption` / `clearOptionItemIcon` / `clearOptionItemText` /
  `clearOptionItemStyle`**：是否在列表顶部渲染"清除选项"及其图标 / 文字 / 样式。

### 行为

- **`hideIcon` / `hideText` / `hideTip`（`boolean`，无默认值）**：在芯片展示区
  域单独隐藏图标 / 文字 / 提示段；三者同时为 `true` 时芯片为空。
- **`tipUseHint`（`boolean`，默认 `false`）**：远程查询选项时是否把当前输入值
  作为 hint 传给字典。
- **`trimed`（`boolean`，默认 `true`）**：是否对字符串值做 trim 规整。
- **`onValueChange`（`Callback1<any>`，无默认值）**：值变化时的回调函数，与
  `change` 事件同时触发；适合在容器内部直接绑定而不监听事件。

### 外观

- **`type`（`LogicType`，默认 `"info"`）**：芯片状态色，取值与 `TiButton` 一致。
- **`align`（`CssAlignment`，无默认值）**：芯片内容对齐 `left / center / right`。
- **`boxFontSize` / `boxPadding` / `boxRadius`（`AspectSize | "none"`，无默认值）**：
  芯片字号 / 内边距 / 圆角分级。
- **`width`（`string`，无默认值）**：芯片固定宽度。
- **`flexAuto`（`boolean`，默认 `true`）**：在 flex 父容器里自动撑满剩余宽度。
- **`hideBorder`（`boolean`，无默认值）**：隐藏芯片边框。
- **`tipListWidth` / `tipListMinWidth`（`string`，无默认值）**：弹出选项列表的
  宽度 / 最小宽度；未声明时与芯片同宽。
- **`tipFormat`（`"T" | "VT" | "TV" | "VTP" | "TP" | "PT" | "VpT"`，无默认值）**：
  列表项的排版格式，控制值 / 文字 / 提示的排列顺序。
- **`tipItemTagStyles`（`{ text?, tip?, value? }`，无默认值）**：列表项里三段文字
  的内联样式。

### 回调

- **`renderHtml`（`Convertor<Vars | undefined, string>`，无默认值）**：自定义
  当前芯片区域的 HTML；传入当前选项对象（空值时为 `undefined`），返回一段 HTML
  字符串直接 `v-html` 渲染。未声明时走内置的图标 + 文字 + 提示拼装。

### 嵌套

本组件未提供插槽；芯片内容由当前选项的 `icon` / `text` / `tip` 字段（或
`renderHtml` 返回的 HTML）决定，不支持通过 slot 自定义内部结构。

### 事件

- **`change`**：载荷为统一后的新值（按 `valueType` 解释）；在弹出列表中选中某项
  时触发。`onValueChange` 回调与本事件同时触发。

> 本组件同时继承 `CommonProps`（`className`、`style`），字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)，本篇不再罗列。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应，先给 JSON 配置，再给等价的 Vue 标签
写法。

### 简单下拉标签（`simple`）

**JSON 配置**

```json
{
  "value": "zh-cn",
  "options": "#Languages",
  "tipListMinWidth": "150px"
}
```

**Vue 标签**

```xml
<TiDropTag
  value="zh-cn"
  options="#Languages"
  tip-list-min-width="150px"
  @change="onChange"
/>
```

### 仅图标（`only-icon`）

**JSON 配置**

```json
{
  "value": "auto-color-mode",
  "options": "#ColorThemes",
  "tipListMinWidth": "120px",
  "boxFontSize": "b",
  "hideText": true,
  "hideTip": true
}
```

**Vue 标签**

```xml
<TiDropTag
  value="auto-color-mode"
  options="#ColorThemes"
  tip-list-min-width="120px"
  box-font-size="b"
  :hide-text="true"
  :hide-tip="true"
  @change="onChange"
/>
```

### 带提示（`with-tip`）

**JSON 配置**

```json
{
  "value": "KG",
  "options": "#Quantities",
  "optionFilter": { "type": "WEIGHT" },
  "optionKeepRaw": true,
  "tipListMinWidth": "350px",
  "tipFormat": "VTP",
  "tipItemTagStyles": { "value": { "width": "4em", "color": "inherit" } },
  "getTip": "type"
}
```

**Vue 标签**

```xml
<TiDropTag
  value="KG"
  options="#Quantities"
  :option-filter="{ type: 'WEIGHT' }"
  :option-keep-raw="true"
  tip-list-min-width="350px"
  tip-format="VTP"
  :tip-item-tag-styles="{ value: { width: '4em', color: 'inherit' } }"
  get-tip="type"
  @change="onChange"
/>
```

## 总结

`TiDropTag` 适合在紧凑空间里做轻量枚举切换：语言、单位、主题、状态过滤。需要
完整的输入框 + 自动补全 + 键盘交互时改用 `TiDroplist` 等输入类控件；只展示不
选择时用 `TiLabel`；需要在表格单元格里放多个并列标签时用 `TiLabelTags`。

已知限制：弹出列表的方向固定向下，不支持向上 / 浮层定位偏移；当前项 HTML 通过
`v-html` 渲染，传入 `renderHtml` 时需自行保证转义。

## 延伸阅读

- **源码入口**
  - `src/lib/action/drop-tag/ti-drop-tag-index.ts` —— 注册表信息与示例配置。
  - `src/lib/action/drop-tag/ti-drop-tag-types.ts` —— `DropTagProps`、
    `DropTagEmitter`。
  - `src/lib/action/drop-tag/TiDropTag.vue` —— 视图与点击 / 选中接线。
  - `src/lib/action/drop-tag/use-drop-tag-api.ts` —— 选项加载、当前项解析与
    `change` 派发。
- **相关文档**
  - 字典值到文字 / 图标的翻译规则：[字典模型](../../10.concepts/06-dict-model.md)。
  - 状态色与尺度变量：[样式系统](../../10.concepts/05-style-system.md)。
  - 纯展示标签：[ti-label](../tile/ti-label.md)。
  - 共享 Props：[共享 Props](../../10.concepts/02-common-props.md)。
