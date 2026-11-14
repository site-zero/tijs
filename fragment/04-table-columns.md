# 数据表格列定义（TiTable）

## 何时用

多列数据表：列定义、行数据、选区、行状态色。改写自
`src/lib/view/table/example/ex-simple.ts`。

## 片段

**JSON 配置**

```json
{
  "className": "fit-parent as-zebra",
  "keepColumns": { "keepAt": "MyApp-table-columns" },
  "data": [
    { "id": 1, "name": "Winnie", "age": 12, "city": "Beijing" }
  ],
  "columns": [
    { "name": "id", "width": 320 },
    { "name": "name" },
    { "name": "age" },
    { "name": "city" }
  ]
}
```

**Vue 标签**

```xml
<TiTable
  class="fit-parent as-zebra"
  :keep-columns="{ keepAt: 'MyApp-table-columns' }"
  :data="rows"
  :columns="[
    { name: 'id', width: 320 },
    { name: 'name' },
    { name: 'age' },
    { name: 'city' }
  ]"
  @select="onSelect"
/>
```

## 要点与坑

- 列只写 `name` 时标题取字段注册表的标准列；`width` 给像素数。
- `keepColumns.keepAt` 把用户调过的列宽 / 显隐持久化到本地存储。
- 行状态色用 `getRowType`（Match 条件数组），单元格编辑用列的
  `activatedComType` / `activatedComConf`，见
  `docs/reference/30.components/view/ti-table.md`。
- 大数据（上千行）直接开虚拟滚动，无需额外配置。
