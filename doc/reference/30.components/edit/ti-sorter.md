---
title: TiSorter 排序器
keywords: [排序, sorter, TiSorter, 排序条件, 排序字段, ASC, DESC, 标签, EDIT]
status: draft
---

# TiSorter 排序器

## 介绍

`TiSorter` 是编辑类（`EDIT`）的排序条件编辑控件：它把当前的排序条件渲染成一组标签，每个
标签代表一个排序字段，带上升序 / 降序图标；点击标签在升降序之间切换，点叉号移除条件，点
右侧齿轮弹出穿梭框挑选要排序的字段。它适合放在表格 / 列表的工具条上，让用户自助调整排序。

排序值是一个 `{ 字段名: 1 | -1 }` 的映射：`1` 表示升序（ASC）、`-1` 表示降序（DESC）。

使用时需要注意：

- 字段的展示文字来自 `options`（字典 / 选项源），未配置时直接显示字段名。
- 点击齿轮打开的穿梭框里新选的字段默认按升序加入；用户取消则不改动当前值。
- `onChange` 回调与 `change` 事件会同时触发，二者不互斥。

源码目录：`src/lib/edit/sorter/`。

## 例子

### JSON 配置

```json
{
  "value": { "ct": 1, "name": -1 },
  "options": [
    { "value": "ct", "text": "Created Time" },
    { "value": "name", "text": "Name" }
  ]
}
```

### Vue 标签调用

```xml
<TiSorter
  :value="sortValue"
  :options="sortOptions"
  @change="onSortChange"
/>
```

## 控件参数

### 数据

- **`value`（`SorterValue`，即 `Record<string, number>`，无默认值）**：当前排序条件，
  键为字段名，值为 `1`（升序）或 `-1`（降序）。
- **`options`（`OptionsInput`，无默认值）**：可选排序字段的选项源，用于把字段名翻译成
  展示文字；规则见 [字典模型](../../10.concepts/06-dict-model.md)。

### 行为

- **`canSetup`（`boolean`，默认 `true`）**：是否显示右侧齿轮按钮；关闭后只能切换 / 移除
  已有条件，不能新增字段。
- **`onChange`（`(val: SorterValue) => void`，无默认值）**：定制回调，每次排序值变化时
  调用，与 `change` 事件同时触发。

### 外观

- **`title`（`string`，无默认值）**：传给底层 `TiTags` 的前缀标题。
- **`colorType`（`LogicType`，无默认值）**：标签的状态色，缺省用穿梭框弹窗的主题色。
- **`sorterIcons`（`{ ASC: IconInput; DESC: IconInput }`，默认
  `{ ASC: "fas-arrow-down-short-wide", DESC: "fas-arrow-up-wide-short" }`）**：升序 /
  降序标签上显示的图标。

### 回调

- **`exportApi`（`(api: SorterExportApi) => void`，无默认值）**：组件挂载后回传内部方法，
  目前导出 `setupSorterFields()`，供外部代码主动打开「选择排序字段」弹窗。

### 嵌套

本组件未提供插槽，标签组与齿轮按钮的内容全部由上述数据与外观属性决定。

### 事件

- **`change`**：载荷为最新的排序映射（`SorterValue`）；点击标签切换升降序、移除标签、
  或在穿梭框里确认字段选择时触发。

> 本组件同时继承 `CommonProps`（`className`、`style`），字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)，本篇不再罗列。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单排序条件（`simple`）

**JSON 配置**

```json
{
  "value": {
    "ct": 1,
    "name": -1
  },
  "options": [
    { "value": "ct", "text": "Created Time" },
    { "value": "name", "text": "Name" }
  ]
}
```

**Vue 标签**

```xml
<TiSorter
  :value="{ ct: 1, name: -1 }"
  :options="[
    { value: 'ct', text: 'Created Time' },
    { value: 'name', text: 'Name' }
  ]"
/>
```

## 总结

`TiSorter` 适合在列表 / 表格工具条上让用户自助维护排序条件：标签形态直观、齿轮弹窗选字段。
只需要单一排序字段时，用输入控件或下拉框更轻；它输出的 `{字段: ±1}` 映射需要上层自行翻译成
数据库 / 查询接口的排序参数。

## 延伸阅读

- **源码入口**
  - `src/lib/edit/sorter/ti-sorter-index.ts` —— 注册表信息与示例配置。
  - `src/lib/edit/sorter/ti-sorter-types.ts` —— `SorterProps`、`SorterEmitter`、
    `SorterValue`。
  - `src/lib/edit/sorter/TiSorter.vue` —— 视图，组合 `TiTags` 与齿轮按钮。
  - `src/lib/edit/sorter/use-sorter.ts` —— 标签生成、升降序切换与穿梭框选字段。
- **相关文档**
  - 底层标签组组件：[TiTags 标签组](../tile/ti-tags.md)。
  - 选项 / 字典翻译：[字典模型](../../10.concepts/06-dict-model.md)。
  - 事件回写规则：[事件绑定](../../10.concepts/03-event-binding.md)。
