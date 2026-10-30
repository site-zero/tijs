---
title: use-selectable 列表选区
keywords: [hook, useSelectable, use-selectable, 选择, 选区, currentId, checkedIds, 多选, 单选, checkAll, toggleId, selectRange]
status: draft
---

# `use-selectable` 列表选区

## 解决什么问题

列表、表格、树、墙这类"一行一条数据"的视图，都要回答同一批问题：当前激活行是哪条、
勾选了哪些行、全选/半选/未选、点击是单选还是切换、按住 Shift 怎么区间选、最少最多勾选
几条。这些逻辑分散在 `TiList`、`TiTable`、`TiTreeTable`、`TiWall`、`TiSwitcher` 各自的
`use-*.ts` 里，口径很容易不一致。

`useSelectable` 把这套选区状态机固定下来：它不持有 Vue 响应式状态，而是由调用方持有
一个普通的 `SelectableState` 对象，hook 暴露一组纯函数对它做读写，并在每次变动后由
调用方通过 `doAndEmit` 打包旧值/新值抛出 `select` 事件。

## 输入 Props

类型 `SelectableProps<ID>`（`ID extends TableRowID`），在本 hook 文件内声明：

- **`getId?: string | (it: Vars, index: number) => ID`** —— 从行数据取 ID；字符串视为
  `_.get` 的数据键；缺省取 `data.id ?? data.value`。
- **`dftIdPrefix?: string`** —— 取不到 ID 时用 `${prefix}-${index}` 兜底，缺省 `"row"`。
- **`multi?: boolean`** —— 是否多选。
- **`minChecked?: number` / `maxChecked?: number`** —— 多选时最少/最多勾选条数；
  单选时只看 `minChecked > 0` 强制至少选中一条。
- **`currentId?: ID | null` / `checkedIds?: CheckedIds<ID>`** —— 受控选区初始值；
  `checkedIds` 支持 `Record<ID, boolean>`、`Map<ID, boolean>`、`ID[]` 三种形态。
- **`canSelect?: boolean`** —— 列表是否允许点选激活（false 时只能勾选）。
- **`showChecker?: boolean`** —— 是否显示勾选框，影响 Shift 区间选的行为。
- **`autoPickCurrent?: boolean`** —— 勾选时自动补一个 current：勾中的行即 current，
  否则取第一个勾选项。
- **`canSelectItem?: Vars | Vars[] | CanItemMatch<ID>` / `canCheckItem?: …`** —— 逐行
  放行规则；传 `Vars|Vars[]` 会用 `Match.parse` 编译成匹配器，作用于行数据 `rawData`。

除 Props 外还要传一个 `options: SelectableOptions<ID>`：

- **`getItem: (id: ID) => SelectableItem<ID> | undefined`** —— 按 ID 取回行项
  （含 `rawData`、`index`），hook 用它做逐行放行校验。

## 返回值 API

```ts
const sel = useSelectable(props, { getItem });
```

返回一组操作 `SelectableState` 的函数（每次调用都要把调用方维护的 `selection` 传进去）：

- **状态写入**
  - **`updateSelection(selection, data, currentId?, checkedIds?)`** —— 按数据列表重建
    `ids`，并根据 `multi` 与受控值重新结算 `checkedIds`/`currentId`。
  - **`resetSelection(selection, data?)`** —— 清空选区，只保留新的 `ids`。
  - **`doAndEmit(selection, list, doSomething, emit)`** —— 先深拷贝旧 `currentId`/
    `checkedIds`，执行传入的改动函数，再组装 `SelectEmitInfo` 抛 `select` 事件。
- **选择动作**
  - **`select(selection, rowId, se: KeyboardStatus)`** —— 主入口：按 `se.shiftKey`
    走区间选、`ctrlKey/metaKey` 走 `toggleId`、`!canSelect && multi` 时默认 toggle。
  - **`selectId(selection, id)`** —— 单选模式：清空勾选、把该 id 设为 current。
  - **`toggleId(selection, id)`** —— 勾选/取消勾选一条；按 `autoPickCurrent` 补 current。
  - **`selectRange(selection, ids, [fromId, toId])`** —— 区间勾选；`!canSelect &&
    showChecker` 时整段与起点勾选状态对齐。
  - **`checkAll(selection)` / `selectNone(selection)`** —— 全选（跳过不可勾选项）/清空。
- **查询**
  - **`getDataIds(data)` / `getDataId(it, index)` / `getDataIndex(selection, id)`** —— ID 换算。
  - **`isIDChecked(selection, id)` / `isDataChecked(selection, index, data)` /
    `isDataActived(selection, index, data)`** —— 判断勾选/激活。
  - **`getCheckedData(list, selection)` / `getCurrentData(list, selection)`** —— 从原
    数据数组取出勾选项/当前项。
  - **`getCheckStatus(selection): CheckStatus`** —— 返回 `"all" | "none" | "part"`，
    供表头勾选框渲染三态。
  - **`getSelectionEmitInfo(selection, list, oldCheckedIds?, oldCurrentId?)`** —— 组装
    事件载荷 `SelectEmitInfo`（含 `currentId`、`checkedIds`、`current`、`checked`、
    `index` 与旧值）。
- **放行**
  - **`canSelectItem(item)` / `canCheckItem(item)`** —— 空 ID、无 `rawData`、负下标一律
    返回 false；逐行规则缺省时 `canSelectItem` 看 `props.canSelect`，`canCheckItem` 看
    `props.multi`。

## 配合使用

- **调用方持有状态**：hook 每次返回都是普通函数，`SelectableState` 要由组件在
  `setup` 里建好（`{ currentId: null, checkedIds: new Map(), ids: [], lastSelectIndex: -1 }`），
  数据刷新后调 `updateSelection`。
- **与 `use-row-indent` / `use-tree-data`**：`TiTreeTable` 在本 hook 之上再叠加树的
  展开折叠，选区 ID 直接用节点 ID。

```ts
// 视图组件 setup 内：持有选区状态并接线
const selection = reactive({
  currentId: null as string | null,
  checkedIds: new Map<string, boolean>(),
  ids: [] as string[],
  lastSelectId: undefined,
  lastSelectIndex: -1,
});

const sel = useSelectable(props, {
  // 按 ID 取回行项，供 hook 做逐行放行校验
  getItem: (id) => listData.value[/* 下标 */] && { rawData: listData.value[/*下标*/], id, index: -1 },
});

// 数据变化后重建选区
sel.updateSelection(selection, listData.value, props.currentId, props.checkedIds);

// 点击一行：带上键盘修饰键，由 hook 决定单选/切换/区间
function onRowClick(rowId: string, ev: KeyboardEvent) {
  sel.doAndEmit(selection, listData.value, () => {
    sel.select(selection, rowId, ev);          // ev 里有 shiftKey/ctrlKey
  }, (eventName, info) => emit("select", info));
}
```

## 注意事项

- **hook 不做响应式**：返回的是纯函数，`selection` 要不要包成 `reactive` 由调用方决定；
  模板渲染前记得用 `getCheckStatus` / `isDataChecked` 重新求值。
- **`canSelectItem`/`canCheckItem` 的匹配器作用于 `rawData`**，不是带 `id/index` 的
  `SelectableItem` 对象；源码里有 TODO 注释说明未来可能支持匹配 item 本身。
- **`clampSelect` 在每次写操作后自动执行**，会按 `minChecked/maxChecked` 回补或裁剪，
  最后一次选中的 ID（`lastSelectId`）优先保留。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/use-selectable.ts` —— 本 hook 实现与 `SelectableProps`/
    `SelectableState`/`SelectEmitInfo` 类型。
  - `src/lib/view/list/use-list.ts`、`src/lib/view/table/use-table.ts`、
    `src/lib/view/tree-table/use-tree-table.ts`、`src/lib/view/wall/use-wall.ts`、
    `src/lib/input/switcher/use-switcher.ts` —— 实际消费方。
- **相关文档**
  - 行缩进与展开状态：[`use-row-indent`](use-row-indent.md)。
  - 树型数据组织：[`use-tree-data`](use-tree-data.md)。
  - 消费组件：[TiList](../../30.components/view/ti-list.md)、
    [TiTable](../../30.components/view/ti-table.md)、
    [TiTreeTable](../../30.components/view/ti-tree-table.md)、
    [TiWall](../../30.components/view/ti-wall.md)、
    [TiSwitcher](../../30.components/input/ti-switcher.md)。
