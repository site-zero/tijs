---
title: TiEditRecords 记录对象编辑
keywords: [记录编辑, EditRecords, TiEditRecords, 表格编辑, 行编辑, 增删行, 批量记录, EDIT]
status: draft
---

# TiEditRecords 记录对象编辑

## 介绍

`TiEditRecords` 是编辑类（`EDIT`）控件，用来编辑一组「记录」：它把一个对象数组渲染成一张
可编辑的表格，默认三列 `value` / `text` / `tip`，每格直接内联编辑；表头带一条动作栏，
支持新增记录、保存改动、上下移动选中行、丢弃改动、删除选中行。它是做「键值对字典维护、
小列表增删改」的现成组合件。

它适合记录数量不大、列结构简单、需要一行行增删移动的场景；列复杂、需要分页与远程数据时，
直接用 `TiTable` + 自己的操作栏更合适。

使用时需要注意：

- 默认没有新增按钮——必须声明 `newItem`，新增入口才会出现。
- 改动不会立即抛出：默认 500 毫秒反弹跳，或点击动作栏的「保存」立即抛出 `change`。
- 保存时只抛与原始 `value` 不相等的整份数组。

源码目录：`src/lib/edit/edit-records/`。

## 例子

### JSON 配置

```json
{
  "value": [
    { "value": "name", "text": "姓名", "tip": "用户姓名" }
  ],
  "newItem": { "value": "->item-${N}", "text": "->New Item ${N}" }
}
```

### Vue 标签调用

```xml
<TiEditRecords
  :value="records"
  :new-item="{ value: '->item-${N}', text: '->New Item ${N}' }"
  @change="onRecordsChange"
/>
```

## 控件参数

### 数据

- **`value`（`Vars[]`，无默认值）**：要编辑的记录数组；组件内部克隆一份作为工作副本，
  改动先落在副本上。
- **`getId`（`string | (it: Vars, index: number) => TableRowID`，默认 `"id|value"`）**：
  如何取每条记录的唯一标识；来自 `SelectableProps`，缺省按 `id` 字段、没有则退到 `value`。
- **`table`（`Partial<TableProps>`，无默认值）**：底层 `TiTable` 的补充配置，会覆盖默认的
  表格属性。默认列固定为 `value` / `text` / `tip` 三列内联输入；默认
  `className: "as-zebra"`、`mainFontSize: "s"`、`mainScrollMode: "stretch"`、
  `keepColumns: "local: GUI-EditRecords-Table-Columns"`。
- **`newIdSetup`（`{ n?: number; prefix?: string }`，无默认值）**：生成新项目 ID 时的雪花
  串配置，`n` 为位数（默认 4）、`prefix` 为前缀。
- **`newItem`（`Vars | (api) => Vars | undefined | Promise<...>`，无默认值）**：如何创建新
  记录。传模板对象时按上下文 `{ id, N }`（`N` 为当前记录总数）做模板渲染；传函数则自定义
  返回新记录对象（可异步）。不声明此属性时不允许新增。

### 行为

- **`emitDelay`（`number`，默认 `500`）**：内容改动后多久抛出一次 `change`（毫秒）；传 `0`
  则不做防抖，每次改动立即走一次判断。
- **`keepName`（`string`，无默认值）**：本地持久化键名前缀，用于把表格列等 GUI 状态存到
  本地存储。当前版本内部已计算 `keepAt`，但未接入表格配置，保留备用。
- **`form`（`Omit<FormProps, "data">`，无默认值）**：类型已声明，当前版本视图未消费，
  保留备用（用于行编辑展开表单）。

### 外观

- **`actionBar`（`ActionBarProps`，无默认值）**：表头动作栏的补充配置，会覆盖 / 合并内置
  动作项（`NEW` / `SAVE` / `MOVE_UP` / `MOVE_DOWN` / `DROP_CHANGE` / `DELETE`）。

### 回调

本组件无此组参数（新建记录的定制逻辑通过 `newItem` 函数注入）。

### 嵌套

本组件内部渲染 `TiTable`，动作栏放在表格的 `#head` 区；不对外暴露用户可填充的插槽，
列与操作项由 `table`、`actionBar`、`newItem` 等数据属性决定。

### 事件

- **`change`**：载荷为编辑后的记录数组（`Vars[]`）；改动与原始 `value` 不一致时，按
  `emitDelay` 防抖抛出，或点击动作栏「保存」立即抛出。

> 本组件同时继承 `CommonProps`，字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)，本篇不再罗列。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单记录编辑（`simple`）

**JSON 配置**

```json
{
  "table": {
    "className": "fit-parent",
    "mainScrollMode": "cover"
  },
  "newItem": {
    "value": "->item-${N}",
    "text": "->New Item ${N}"
  }
}
```

**Vue 标签**

```xml
<TiEditRecords
  class-name="fit-parent"
  main-scroll-mode="cover"
  :new-item="{ value: '->item-${N}', text: '->New Item ${N}' }"
  @change="onRecordsChange"
/>
```

## 总结

`TiEditRecords` 适合小体量记录的增删改：默认三列内联编辑 + 内置动作栏，开箱即用。需要
多列复杂编辑、分页或远程加载时，直接用 `TiTable` 自己组合；需要编辑单个对象（数组里的
一条）时，用 `TiEditPairs` 或 `TiForm`。注意 `form`、`keepName` 当前未接线，不要依赖
它们做行展开表单或列状态持久化。

## 延伸阅读

- **源码入口**
  - `src/lib/edit/edit-records/ti-edit-records-index.ts` —— 注册表信息与示例配置。
  - `src/lib/edit/edit-records/edit-records-types.ts` —— `EditRecordsProps`、
    `EditRecordsEmitter`、`EditRecordNewItem`。
  - `src/lib/edit/edit-records/TiEditRecords.vue` —— 视图，组合 `TiTable` 与动作栏。
  - `src/lib/edit/edit-records/use-edit-records-api.ts` —— 工作副本、选中态与防抖回写。
  - `src/lib/edit/edit-records/gui-edit-records-table.ts` —— 默认列与表格配置。
  - `src/lib/edit/edit-records/use-edit-records-actions.ts` —— 内置动作项定义。
  - `src/lib/edit/edit-records/support/add-new-item.ts` —— 新记录模板渲染与 ID 生成。
- **相关文档**
  - 展示型表格：[TiTable 表格](../view/ti-table.md)。
  - 单对象编辑：[ti-edit-pairs](ti-edit-pairs.md)。
  - 事件回写规则：[事件绑定](../../10.concepts/03-event-binding.md)。
