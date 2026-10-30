---
title: TiTransfer 穿梭框
keywords: [穿梭框, transfer, TiTransfer, 双栏选择, 候选列表, 已选列表, INPUT]
status: draft
---

# TiTransfer 穿梭框

## 介绍

`TiTransfer` 是输入类（`INPUT`）的穿梭框：左右两栏列表，左边是候选选项，右边是已选值，
中间两个箭头按钮把勾选项从一边搬到另一边。它适合候选集较大、需要对照两边内容反复挑选、
并且在意已选顺序的场景（批量授权、字段选配、标签搬迁）。

交互要点：

- 左栏顶部自带过滤输入框，按关键字筛候选；左栏勾选后点右箭头（或直接双击条目）搬入右栏，
  右栏同理搬出。
- 右栏标题栏带操作条：上移、下移（调整已选顺序）、清空。
- 每一次搬入 / 搬出 / 排序 / 清空都会立即 `emit("change", 新数组)`，没有浮层确认环节。

使用时需要注意：

- 它占的是大块区域，`liveStyle` 默认铺满容器（`width/height: 100%`），不适合塞进
  单行表单项。
- 已选值就是 `value` 数组本身，顺序即界面顺序；`fitMode` 控制两栏如何贴合父容器。

源码目录：`src/lib/input/transfer/`。

## 例子

### JSON 配置

```json
{
  "options": [
    { "value": "hippo", "text": "Hippo", "icon": "fas-hippo" },
    { "value": "cow", "text": "Cow", "icon": "fas-cow" },
    { "value": "spider", "text": "Spider", "icon": "fas-spider" }
  ]
}
```

### Vue 标签调用

```xml
<TiTransfer
  :options="[
    { value: 'hippo', text: 'Hippo', icon: 'fas-hippo' },
    { value: 'cow', text: 'Cow', icon: 'fas-cow' },
    { value: 'spider', text: 'Spider', icon: 'fas-spider' }
  ]"
  @change="onChange"
/>
```

## 控件参数

### 数据

- **`value`（`TableRowID[]`，无默认值）**：已选值的 id 数组，顺序即右栏展示顺序。
- **`options`（来自 `OptionsProps`）**：候选选项数据，支持字典加载；选项文字、图标、备注
  的翻译规则见 [字典模型](../../10.concepts/06-dict-model.md)。
- **列表渲染**：`StdListItemProps`（`getIcon`、`getText`、`getTip`、`getValue`）定制
  每个条目的取字段方式。

### 行为

- **`readonly`（来自 `ReadonlyProps`，无默认值）**：只读时不可搬运；其余字段见
  [共享 Props](../../10.concepts/02-common-props.md)。

### 外观

- **`fitMode`（`"cover" | "fit"`，无默认值）**：两栏列表如何贴合父容器；`"cover"` 给
  根节点加 `cover-parent`，`"fit"` 加 `fit-parent`。

### 回调

本组件无此组参数（列表取字段由 `StdListItemProps` 承担，非函数回调注入）。

### 嵌套

- **`head`**：穿梭框顶部内容插槽，渲染在两栏列表之上。
- **`tail`**：穿梭框底部内容插槽，渲染在两栏列表之下。

### 事件

- **`change`**：载荷为 `TableRowID[]`；搬入、搬出、上移 / 下移排序、清空后触发，始终是
  最新的完整已选数组。

> 本组件同时继承 `CommonProps`、`ReadonlyProps`、`OptionsProps`、`StdListItemProps`，
> 字段含义见 [共享 Props](../../10.concepts/02-common-props.md)，本篇不再罗列。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单穿梭框（`simple`）

**JSON 配置**

```json
{
  "options": [
    { "value": "hippo", "text": "Hippo", "icon": "fas-hippo" },
    { "value": "cow", "text": "Cow", "icon": "fas-cow" },
    { "value": "spider", "text": "Spider", "icon": "fas-spider" }
  ]
}
```

**Vue 标签**

```xml
<TiTransfer
  :options="[
    { value: 'hippo', text: 'Hippo', icon: 'fas-hippo' },
    { value: 'cow', text: 'Cow', icon: 'fas-cow' },
    { value: 'spider', text: 'Spider', icon: 'fas-spider' }
  ]"
/>
```

### 带图标穿梭框（`icon_tip`）

**JSON 配置**

```json
{}
```

**Vue 标签**

```xml
<TiTransfer />
```

> 该示例配置为空对象，实际展示的候选数据来自组件默认上下文（字典 / 全局选项），与
> `simple` 示例的差异在于是否走字典图标与备注。

## 总结

`TiTransfer` 适合「候选多、已选顺序重要、有大块版面」的选配场景；候选只有几项、或希望
在单行表单里完成多选时，用 `TiMultiDroplist`；只选一个值时用 `TiDroplist`。它的代价是
占地面积与一次性搬运的交互成本，不要把它当成紧凑多选下拉的替代品。

## 延伸阅读

- **源码入口**
  - `src/lib/input/transfer/ti-transfer-index.ts` —— 注册表信息与示例配置。
  - `src/lib/input/transfer/ti-transfer-types.ts` —— `TransferProps`、`TransferState`。
  - `src/lib/input/transfer/TiTransfer.vue` —— 双栏视图与搬运接线。
  - `src/lib/input/transfer/use-transfer.ts` —— 候选 / 已选列表计算与右栏操作条。
- **相关文档**
  - 共享 Props：[共享 Props](../../10.concepts/02-common-props.md)。
  - 字典选项翻译：[字典模型](../../10.concepts/06-dict-model.md)。
  - 紧凑多选下拉：[ti-multi-droplist](ti-multi-droplist.md)。
