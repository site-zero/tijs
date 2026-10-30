---
title: TiCheckList 多选列表
keywords: [多选列表, 勾选列表, check list, TiCheckList, 多选, 选项组, 复选列表]
status: draft
---

# TiCheckList 多选列表

## 介绍

`TiCheckList` 是输入类（`INPUT`）的多选列表：把一组候选项竖排展示，每行前面带勾选框，用户可以
勾选多个，值是一个被选中 ID 的数组。候选项可带图标、文字、备注，首尾还能插入自定义扩展内容。

使用时需要注意：

- 值是选中项 ID 的数组（`TableRowID[]`）；`fixedValues` 指定的项无论怎么操作都会被选中。
- 可通过 `minChecked` / `maxChecked` 约束最少 / 最多勾选数量。

源码目录：`src/lib/input/checklist/`。

## 例子

### JSON 配置

```json
{
  "value": [1, 3],
  "options": [
    { "value": 1, "text": "Cat" },
    { "value": 2, "text": "Dog" },
    { "value": 3, "text": "Pig" }
  ]
}
```

### Vue 标签调用

```xml
<TiCheckList
  :value="[1, 3]"
  :options="[
    { value: 1, text: 'Cat' },
    { value: 2, text: 'Dog' },
    { value: 3, text: 'Pig' }
  ]"
  @change="onChange"
/>
```

## 控件参数

### 数据

- **`value`（`TableRowID[]`）**：当前选中项 ID 数组。
- **`options` / `dictVars` / `mustInOptions` / `getOptionIcon/Text/Tip/Value`**：候选项字典配置，
  规则见 [字典模型](../../10.concepts/06-dict-model.md)。
- **`getIcon` / `getText` / `getTip` / `getValue`**：从原始数据取行图标 / 文字 / 备注 / 值的路径或函数
  （`StdListItemProps`）。
- **`emptyRoadblock`（`RoadblockProps`）**：无数据时空态块的配置。
- **`head` / `tail`（`TextFragment`）**：列表首尾插入的扩展内容（文字、图标或子组件）。
- **`fixedValues`（`TableRowID[]`）**：固定选中项，用户操作不会取消它们。

### 行为

- **`readonly`（`any`）**：只读条件，见 [共享 Props](../../10.concepts/02-common-props.md)。
- **`minChecked` / `maxChecked`（`number`）**：最少 / 最多可勾选数量。

### 外观

- **`textFormat`（`string | (item) => string`）**：每行文字排版模板，缺省 `"${text}"`。
- **`showIndexFrom`（`number`）**：指定后显示每行序号，从该值开始计数。
- 其余 `ListAspect` 行样式字段见底层列表组件。

### 回调

本组件无此组参数。

### 嵌套

- **`head` / `tail`**：分别渲染在列表顶部 / 底部的扩展内容块；列表主体不提供额外插槽。

### 事件

- **`change`**：载荷为最新选中 ID 数组（`TableRowID[]`）；任意勾选变化时触发。

> 本组件继承 `CommonProps`（`className`、`style`），字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)。
> 注册表示例传入的 `data` 与 `size` 由底层列表视图消费，未在 `CheckListProps` 中显式声明。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应（`data` 均来自 `view/list/example/mock_data.ts` 的
`getListData`，这里以示意选项代替）。

### 简单多选（`simple`）

**JSON 配置**

```json
{
  "size": "b",
  "value": [1, 3],
  "options": [
    { "value": 1, "text": "Cat" },
    { "value": 2, "text": "Dog" },
    { "value": 3, "text": "Pig" }
  ]
}
```

**Vue 标签**

```xml
<TiCheckList
  size="b"
  :value="[1, 3]"
  :options="[
    { value: 1, text: 'Cat' },
    { value: 2, text: 'Dog' },
    { value: 3, text: 'Pig' }
  ]"
/>
```

### 带图标（`with-icon`）

**JSON 配置**

```json
{
  "size": "b",
  "value": [1, 3],
  "options": [
    { "value": 1, "text": "Cat", "icon": "fas-cat" },
    { "value": 2, "text": "Dog", "icon": "fas-dog" },
    { "value": 3, "text": "Pig", "icon": "fas-piggy-bank" }
  ]
}
```

**Vue 标签**

```xml
<TiCheckList
  size="b"
  :value="[1, 3]"
  :options="[
    { value: 1, text: 'Cat', icon: 'fas-cat' },
    { value: 2, text: 'Dog', icon: 'fas-dog' },
    { value: 3, text: 'Pig', icon: 'fas-piggy-bank' }
  ]"
/>
```

### 带备注（`with-tip`）

**JSON 配置**

```json
{
  "size": "b",
  "value": [1, 3],
  "options": [
    { "value": 1, "text": "Cat", "icon": "fas-cat", "tip": "meow" },
    { "value": 2, "text": "Dog", "icon": "fas-dog", "tip": "woof" },
    { "value": 3, "text": "Pig", "icon": "fas-piggy-bank", "tip": "oink" }
  ]
}
```

**Vue 标签**

```xml
<TiCheckList
  size="b"
  :value="[1, 3]"
  :options="[
    { value: 1, text: 'Cat', icon: 'fas-cat', tip: 'meow' },
    { value: 2, text: 'Dog', icon: 'fas-dog', tip: 'woof' },
    { value: 3, text: 'Pig', icon: 'fas-piggy-bank', tip: 'oink' }
  ]"
/>
```

## 总结

`TiCheckList` 适合竖排多候选项的多选；单选改用 `TiRadioList`，按钮式平铺多选改用 `TiSwitcher`，
单个布尔字段用 `TiCheck`。

## 延伸阅读

- **源码入口**
  - `src/lib/input/checklist/ti-check-list-index.ts` —— 注册表信息与示例配置。
  - `src/lib/input/checklist/ti-check-list-types.ts` —— `CheckListProps`、`CheckListEmitter`。
  - `src/lib/input/checklist/TiCheckList.vue` —— 视图与勾选接线。
  - `src/lib/input/checklist/use-checklist.ts` —— 多选状态 hook。
- **相关文档**
  - 单选列表：[ti-radio-list](ti-radio-list.md)。
  - 候选项按钮组：[ti-switcher](ti-switcher.md)。
