---
title: TiRadioList 单选列表
keywords: [单选列表, 单选框, radio, TiRadioList, 单选, 选项组, 纵向单选]
status: draft
---

# TiRadioList 单选列表

## 介绍

`TiRadioList` 是输入类（`INPUT`）的单选列表：把一组候选项竖排展示，每行前面带圆形单选标记，
用户在候选项里选一个，值是选中项的 ID。它与 `TiCheckList` 结构相同，只是把"多选数组"换成了
"单值"。

使用时需要注意：

- 值是单个 ID（`TableRowID`），取消选择后会变成 `null`。
- 可通过 `minChecked` 约束至少保留一项。

源码目录：`src/lib/input/radiolist/`。

## 例子

### JSON 配置

```json
{
  "value": 1,
  "options": [
    { "value": 1, "text": "Cat" },
    { "value": 2, "text": "Dog" },
    { "value": 3, "text": "Pig" }
  ]
}
```

### Vue 标签调用

```xml
<TiRadioList
  :value="1"
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

- **`value`（`TableRowID`）**：当前选中项 ID。
- **`options` / `dictVars` / `mustInOptions` / `getOptionIcon/Text/Tip/Value`**：候选项字典配置，
  规则见 [字典模型](../../10.concepts/06-dict-model.md)。
- **`getIcon` / `getText` / `getTip` / `getValue`**：从原始数据取行图标 / 文字 / 备注 / 值。
- **`emptyRoadblock`（`RoadblockProps`）**：无数据时空态块配置。
- **`head` / `tail`（`TextFragment`）**：列表首尾插入的扩展内容。

### 行为

- **`readonly`（`any`）**：只读条件，见 [共享 Props](../../10.concepts/02-common-props.md)。
- **`minChecked`（`number`）**：最少选中数量，通常为 1 表示至少保留一项。

### 外观

- **`textFormat`（`string | (item) => string`）**：每行文字排版模板，缺省 `"${text}"`。
- **`showIndexFrom`（`number`）**：指定后显示每行序号。

### 回调

本组件无此组参数。

### 嵌套

- **`head` / `tail`**：分别渲染在列表顶部 / 底部的扩展内容块；列表主体不提供额外插槽。

### 事件

- **`change`**：载荷为最新选中项 ID（`TableRowID | null`）；单选变化时触发。

> 本组件继承 `CommonProps`（`className`、`style`），字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)。
> 注册表示例传入的 `data` 与 `size` 由底层列表视图消费，未在 `RadioListProps` 中显式声明。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应（`data` 来自 `getListData`，这里以示意选项代替）。

### 简单单选（`simple`）

**JSON 配置**

```json
{
  "size": "b",
  "value": 1,
  "options": [
    { "value": 1, "text": "Cat" },
    { "value": 2, "text": "Dog" },
    { "value": 3, "text": "Pig" }
  ]
}
```

**Vue 标签**

```xml
<TiRadioList
  size="b"
  :value="1"
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
  "value": 3,
  "options": [
    { "value": 1, "text": "Cat", "icon": "fas-cat" },
    { "value": 2, "text": "Dog", "icon": "fas-dog" },
    { "value": 3, "text": "Pig", "icon": "fas-piggy-bank" }
  ]
}
```

**Vue 标签**

```xml
<TiRadioList
  size="b"
  :value="3"
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
  "value": 2,
  "options": [
    { "value": 1, "text": "Cat", "icon": "fas-cat", "tip": "meow" },
    { "value": 2, "text": "Dog", "icon": "fas-dog", "tip": "woof" },
    { "value": 3, "text": "Pig", "icon": "fas-piggy-bank", "tip": "oink" }
  ]
}
```

**Vue 标签**

```xml
<TiRadioList
  size="b"
  :value="2"
  :options="[
    { value: 1, text: 'Cat', icon: 'fas-cat', tip: 'meow' },
    { value: 2, text: 'Dog', icon: 'fas-dog', tip: 'woof' },
    { value: 3, text: 'Pig', icon: 'fas-piggy-bank', tip: 'oink' }
  ]"
/>
```

## 总结

`TiRadioList` 适合竖排候选项的单选；横排按钮式单选 / 多选用 `TiSwitcher`，从下拉里选一个用
`TiDroplist`，单个布尔字段用 `TiToggle`。

## 延伸阅读

- **源码入口**
  - `src/lib/input/radiolist/ti-radio-list-index.ts` —— 注册表信息与示例配置。
  - `src/lib/input/radiolist/ti-radio-list-types.ts` —— `RadioListProps`、`RadioListEmitter`。
  - `src/lib/input/radiolist/TiRadioList.vue` —— 视图与单选接线。
  - `src/lib/input/radiolist/use-radio-list.ts` —— 单选状态 hook。
- **相关文档**
  - 多选列表：[ti-check-list](ti-check-list.md)。
  - 按钮式选项组：[ti-switcher](ti-switcher.md)。
