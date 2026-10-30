---
title: TiInputMultiLines 多行标签输入
keywords: [多行输入, 标签输入, 多选标签, multi-lines, TiInputMultiLines, 数组录入, chips]
status: draft
---

# TiInputMultiLines 多行标签输入

## 介绍

`TiInputMultiLines` 是输入类（`INPUT`）的多行标签录入框：它把一组字符串当作"标签集合"管理，
每个条目占一行（或一个小块），可以增删改。它既接受数组值，也接受用分隔符拼成的字符串，
通过 `splitValue` / `joinValue` 在两种形态之间转换。空列表的展示样式由 `emptyRoadblock` 定制。

使用时需要注意：

- 底层每一行是一个 `TiInput`（box3），行内的输入行为通过 `inputConfig` 统一定制。
- `readonly` 这里是布尔开关，不是 `Match` 描述。

源码目录：`src/lib/input/multi-lines/`。

## 例子

### JSON 配置

```json
{
  "value": "Rose,Tulip,Sunflower",
  "autoFilterNilItem": true
}
```

### Vue 标签调用

```xml
<TiInputMultiLines
  value="Rose,Tulip,Sunflower"
  :auto-filter-nil-item="true"
  @change="onChange"
/>
```

## 控件参数

### 数据

- **`value`（`string | string[]`）**：标签集合；传字符串时按 `splitValue` 拆成数组。
- **`newItem`（`string`，默认空串）**：新增一个条目时填入的默认文本。
- **`splitValue`（`string | RegExp | (input) => string[]`）**：把输入拆成字符串数组的方式——
  分隔符、正则或自定义函数。
- **`joinValue`（`string | (input: string[]) => string | string[]`）**：把数组拼回提交值的方式——
  分隔符或自定义函数；缺省按输入 `value` 的类型决定。
- **空占位**：`emptyRoadblock`（`RoadblockProps`）描述无数据时的空态块。

### 行为

- **`readonly`（`boolean`）**：是否只读。
- **`emptyAsNull`（`boolean`）**：列表为空时是否把值转成 `null`。
- **`autoFilterNilItem`（`boolean`）**：每次改动时是否自动剔除空白条目。

### 外观

- **`checkedItemType`（`LogicType`，默认 `"primary"`）**：已选中条目的状态色。
- **`emptyItemType`（`LogicType`）**：空条目的状态色。
- **`checkedEmptyItemType`（`LogicType`）**：选中空条目的状态色，缺省跟随 `checkedItemType`。

### 回调

- **`actionBar`（`ActionBarProps`）**：动作条配置，挂在列表旁的一组操作按钮。

### 嵌套

- **`inputConfig`（`Omit<InputBoxProps, "value">`）**：每一行底层 `TiInput` 的定制配置；
  行内不允许再指定 `value`。本组件未提供内容插槽，条目由 `value` 决定。

### 事件

- **`change`**：载荷为新的标签集合（`string | string[] | null`）；任意条目增删改提交时触发。

> 本组件继承 `CommonProps`（`className`、`style`），字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单标签列表（`simple`）

**JSON 配置**

```json
{
  "value": "Rose,Tulip,Sunflower",
  "emptyAsNull": false,
  "autoFilterNilItem": true
}
```

**Vue 标签**

```xml
<TiInputMultiLines
  value="Rose,Tulip,Sunflower"
  :empty-as-null="false"
  :auto-filter-nil-item="true"
/>
```

## 总结

`TiInputMultiLines` 适合"一组短标签 / 关键词"的录入（兴趣标签、收件人、多选过滤条件）；
需要从固定候选项里多选时改用 `TiCheckList`，需要纯大段自由文本时改用 `TiInputText`。

## 延伸阅读

- **源码入口**
  - `src/lib/input/multi-lines/ti-input-multi-lines-index.ts` —— 注册表信息与示例配置。
  - `src/lib/input/multi-lines/ti-input-multi-lines-types.ts` —— `InputMultiLinesProps`、`InputMultiLinesEmitter`。
  - `src/lib/input/multi-lines/TiInputMultiLines.vue` —— 视图与状态接线。
  - `src/lib/input/multi-lines/use-ti-input-multi-lines-api.ts` —— 行数据增删与拼拆逻辑。
- **相关文档**
  - 行内底层输入框：[ti-input](ti-input.md)。
  - 固定候选项多选：[ti-check-list](ti-check-list.md)。
