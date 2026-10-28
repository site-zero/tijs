---
title: TiInputCombo 复合输入框
keywords: [复合输入, 自动补全, combo, TiInputCombo, 下拉建议, 模糊匹配, INPUT]
status: draft
---

# TiInputCombo 复合输入框

## 介绍

`TiInputCombo` 是输入类（`INPUT`）的复合输入框：一个带前后缀图标的文本输入框，在输入
过程中弹出下拉建议列表，既可以直接把输入串作为值提交，也可以从建议列表里选中一个标准
选项。它介于「纯文本框」与「必须从选项里选一个」的下拉框之间——适合城市名、联系人、
标签这类「大部分命中历史选项、但也允许自由输入」的字段。

交互要点：

- 输入内容变化后按 `tipShowDelay`（默认 500ms）反弹跳再触发建议查询；命中选项高亮时
  按回车 / 方向键选中，直接失焦则把当前输入串作为值提交。
- 声明 `loadOptions` 后，建议列表由这个异步函数按当前输入文本加载，而不是静态 `options`。
- 打开了 `showDebugInfo` 会在控件下方展开一张调试表，实时显示原始值、当前选项、建议、
  显示文本等内部状态，开发期定位问题用。

源码目录：`src/lib/input/combo/`。

## 例子

### JSON 配置

```json
{
  "value": "Some Text",
  "valueCase": "upperAll",
  "autoSelect": true,
  "maxSize": 10
}
```

### Vue 标签调用

```xml
<TiInputCombo
  value="Some Text"
  value-case="upperAll"
  :auto-select="true"
  :max-size="10"
  @change="onChange"
/>
```

## 控件参数

### 数据

- **`value`（`any`，无默认值）**：控件值；可以是原始输入串，也可以是选中标准选项后的
  完整选项对象（`valueType` 决定以哪种形态带出，字段来自 `BoxValueProps`）。
- **显示文本**：`DisplayTextProps` 决定输入框里显示哪一段文字；聚焦时是否切回原始值由
  `useTextWhenFocus` 控制。
- **值管道**：`valueCase`、`trimed`、`valuePiping`、`pipeContext`、`pipeProcessers`
  属于展示与回写前的值规整管道，字段含义见
  [值规整管线](../../40.features/value/use-value-input.md)。
- **建议列表**：`BoxDropListProps`、`OptionItemProps` 控制下拉列表的渲染格式与数据，
  规则见 [字典模型](../../10.concepts/06-dict-model.md)。

### 行为

- **`autoSelect`（`boolean`，无默认值）**：聚焦输入框时是否自动全选已有文本。
- **`autoFocus`（`boolean`，无默认值）**：组件创建时是否自动聚焦输入框。
- **`useTextWhenFocus`（`boolean`，无默认值）**：默认聚焦且可编辑时输入框会切回显示
  原始值；开启后即使聚焦也保持显示翻译后的文本，避免展示 UUID 之类不友好的原始主键。
- **`tipShowDelay`（`number`，默认 `500`）**：输入停止后多少毫秒才查询 / 过滤建议列表，
  同时影响值管道的反弹跳阈值。
- **`showDebugInfo`（`boolean`，无默认值）**：是否在控件下方展开内部状态调试表。
- **只读**：`readonly` 来自共享只读配置，只读时输入框不可编辑、不弹建议。

### 外观

- **`BoxAspectProps`**：状态色、字号、内边距、圆角、宽度等外观通道，变量来源见
  [样式系统](../../10.concepts/05-style-system.md)。
- **尺寸提示**：`ShowBoxSizeProps`（`showSizeWhen`、`showSizeAt`、`forceShowSizeWhen`、
  `maxSize` 等）控制是否在输入框角落显示当前文本长度 / 容量提示。
- **前后缀图标**：`BoxPrefixSuffixProps` 配置前缀 / 后缀图标及其悬浮态、清除行为。

### 回调

- **`loadOptions`（`(query?: string | null) => Promise<Vars[]>`，无默认值）**：按当前输入
  文本异步加载建议选项列表；`query` 为输入框中的查询文本，返回值用于渲染下拉建议列表。

### 嵌套

- **`head`**：主输入区头部内容插槽，渲染在文本框上层。
- **`tail`**：主输入区尾部内容插槽，渲染在文本框下层。

### 事件

- **`change`**：载荷为新值（原始串或选项对象，取决于 `valueType`）；选中建议项或失焦
  提交输入串时触发。
- **`focus`**：输入框获得焦点时触发，无载荷。
- **`blur`**：输入框失去焦点时触发，无载荷。
- **`click`**：载荷为 `value`；点击控件主体时触发。
- **`click:prefix-icon` / `click:suffix-icon`**：点击前后缀图标时触发。

> 本组件同时继承 `CommonProps`、`BoxCompositionProps`、`DisplayTextProps`、
> `PlaceholderProps`、`ReadonlyProps`、`OptionItemProps`、`BoxDropListProps`、
> `ShowBoxSizeProps`、`BoxAspectProps`、`ValuePipeProps`、`BoxPrefixSuffixProps`、
> `BoxValueProps`，字段含义见 [共享 Props](../../10.concepts/02-common-props.md)，
> 本篇不再罗列。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 复合输入（`simple`）

**JSON 配置**

```json
{
  "value": "Some Text",
  "valueCase": "upperAll",
  "autoSelect": true,
  "showSizeWhen": "auto",
  "showSizeAt": "top-right",
  "forceShowSizeWhen": "fullsize",
  "maxSize": 10
}
```

**Vue 标签**

```xml
<TiInputCombo
  value="Some Text"
  value-case="upperAll"
  :auto-select="true"
  show-size-when="auto"
  show-size-at="top-right"
  force-show-size-when="fullsize"
  :max-size="10"
/>
```

## 总结

`TiInputCombo` 适合「自由输入为主、历史选项为辅」的字段；必须强制从给定枚举里选一个时
改用 `TiDroplist` / `TiMultiDroplist`；只需要纯文本录入、不需要建议列表时改用
`TiInputText`。它的建议数据既可以来自静态 `options`，也可以通过 `loadOptions` 接远程
搜索——后者注意配合 `tipShowDelay` 控制请求频率。

## 延伸阅读

- **源码入口**
  - `src/lib/input/combo/ti-input-combo-index.ts` —— 注册表信息与示例配置。
  - `src/lib/input/combo/input-combo-types.ts` —— `InputComboProps`、`InputComboEmitter`。
  - `src/lib/input/combo/TiInputCombo.vue` —— 视图、输入区与建议浮层接线。
  - `src/lib/input/combo/use-input-combo-api.ts` —— 值、建议与焦点状态。
  - `src/lib/input/combo/support/` —— 输入变化、选项选择、遮罩点击等交互细分逻辑。
- **相关文档**
  - 值规整管道：[use-value-input](../../40.features/value/use-value-input.md)。
  - 共享 Props 与只读 / 占位字段：[共享 Props](../../10.concepts/02-common-props.md)。
  - 事件回写规则：[事件绑定](../../10.concepts/03-event-binding.md)。
