---
title: use-data-logic-type 行逻辑类型
keywords: [hook, useDataLogicType, use-data-logic-type, LogicType, getRowType, Match, 行类型, table, tree-table, list]
status: draft
---

# `use-data-logic-type` 行逻辑类型

## 解决什么问题

表格、树表、列表渲染每一行时，常常要按数据内容决定这行"是什么性质"：是目录行还是
叶子行？是汇总行还是普通数据行？是可点击导航行还是纯展示行？判定规则可能是简单的
字段相等，也可能是一条 `Match` 匹配描述，甚至整段交给外部函数算。

`useDataLogicType` 把这段判定收敛成一个编译好的函数 `(data) => LogicType | undefined`：
输入可以是自定义函数，也可以是一组 `{ test, type }` 规则数组（`test` 会被编译成
`Match` 匹配器），按顺序命中即返回对应类型。`useTable`、`useTreeTable`、`useList`
都用它实现 `getRowType`。

## 输入 Props

注意：本 hook **不接收 Props 对象**，第一个参数就是"取行逻辑类型"的配置本身：

`GetDataLogicTypeOptions`（声明于 `use-data-logic-type.ts`）三选一：

- **`undefined`** —— 未配置。
- **`(data: Vars) => LogicType | undefined`** —— 自定义函数，hook 原样返回。
- **`GetDataLogicTypeMatcher[]`** —— 规则数组，每项 `{ test?: any, type: LogicType }`；`test` 经 `Match.parse(test, true)` 编译为匹配器，按数组顺序对数据求值，首个命中返回其 `type`。

## 返回值 API

```ts
const getRowType = useDataLogicType(getRowTypeProp);
// getRowType 可能为 undefined（未配置时）
const type = getRowType?.(rowData);
```

返回值三态：

- **`undefined`** —— 未传入任何配置，调用方按"无行类型"处理。
- **原函数** —— 传入函数形态时原样返回。
- **`(data: Vars) => LogicType | undefined`** —— 规则数组编译出的匹配函数：逐条规则 `test.test(data)`，命中即返回该规则的 `type`；全部不命中返回 `undefined`。

## 配合使用

- **与 `Match` 体系**：规则里的 `test` 支持任意 `TiMatch` 描述形式（字段相等、逻辑组合等），与 `readonly`/`visible` 等共享 Props 的匹配描述同机制，见 [共享 Props](../../10.concepts/02-common-props.md)。
- **与表格/树表/列表**：三者把结果存进 `computed`，渲染时逐行调用以决定行样式与交互。

典型调用片段（`use-table.ts` 风格）：

```ts
// 配置形态：按数据判定行类型
const getRowType = computed(() =>
  useDataLogicType([
    { test: { __has_children: true }, type: 'group' },
    { test: { status: 'archived' },  type: 'disabled' },
  ])
);
// 渲染行时：
const rowType = getRowType.value?.(row.data);
```

```ts
// 函数形态：直接透传业务规则
const getRowType = useDataLogicType((data) =>
  data.level > 0 ? 'child' : 'root'
);
```

## 注意事项

- **规则按顺序短路**：数组前面的规则命中后不再检查后面的，配置时注意把更具体的规则放前面。
- **全部不命中不报错**：返回 `undefined`，调用方需自行兜底。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/use-data-logic-type.ts` —— 本 hook 实现。
  - `src/lib/view/table/use-table.ts`、`src/lib/view/tree-table/use-tree-table.ts`、`src/lib/view/list/use-list.ts` —— 消费方。
- **相关文档**
  - 匹配描述 `Match`：[共享 Props](../../10.concepts/02-common-props.md)。
