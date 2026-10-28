---
title: use-std-list-item 列表项标准化
keywords: [hook, useStdListItem, use-std-list-item, toStdItem, StdOptionItem, icon, text, tip, value, 列表项, 选项]
status: draft
---

# `use-std-list-item` 列表项标准化

## 解决什么问题

列表、下拉、穿梭框、面包屑这类"每项都是 `{icon, text, tip, value}`"的展示，行数据字段
名五花八门：有的叫 `title`、有的叫 `nickname`、`value` 位置还可能是 `id`。每个组件各自写
一套"从行数据里取这四样"的兜底逻辑，口径会慢慢漂走。

`useStdListItem` 把"任意行对象 → 标准项 `StdOptionItem`"的换算固定下来，并允许用 Props
自定义四个字段的取值路径或函数。`TiList`、`TiSwitcher`、`TiCheckList`、`TiRadioList`、
`TiTransfer`、InputBox3 的选项数据、`TiCrumb` 都用它。

## 输入 Props

类型 `StdListItemProps`（在本 hook 文件内声明）：

- **`getIcon?: string | (item: Vars) => IconInput | undefined`** —— 取图标；
  字符串视为 `_.get` 路径，缺省取 `item.icon`。
- **`getText?: string | (item: Vars) => string | undefined`** —— 取显示文本；
  缺省取 `item.text ?? item.title ?? item.nickname`。
- **`getTip?: string | (item: Vars) => string | undefined`** —— 取悬浮提示；
  缺省取 `item.tip`。
- **`getValue?: string | (item: Vars, index: number) => TableRowID`** —— 取项值；
  缺省取 `item.value ?? item.id ?? index`。

## 返回值 API

```ts
const std = useStdListItem(props);
```

- **`toStdItem(it: Vars, index: number): StdOptionItem`** —— 把单行对象转成标准项：
  若 `it` 本身已是 `StdOptionItem`（`isStdOptionItem` 判定）则原样返回；否则按上面四个
  getter 组装 `{ icon, text, tip, value }`，并顺带透传 `it.style`。
- **`toStdItems(list: Vars[]): StdOptionItem[]`** —— 逐行调用 `toStdItem`，整列标准化。

## 配合使用

- **与 `use-options` / `use-value-input`**：字典模块内部也产出 `StdOptionItem`；本 hook
  用于"非字典来源的裸数据列表"先归一化，再交给下游渲染。
- **与 `use-selectable`**：标准化后的 `value` 就是选区的 ID，`use-selectable` 的 `getId`
  一般直接对应这里的 `getValue`。

```ts
const std = useStdListItem({
  getText: "name",                // 行数据里展示文本叫 name
  getValue: (item, i) => item.code ?? i,
});

// 渲染列表时统一拿到标准项
const options = rawList.map((it, i) => std.toStdItem(it, i));
```

## 注意事项

- **`toStdItem` 对已是标准项的输入直接返回**，不会二次包装；传入完整 `StdOptionItem`
  对象可绕过所有 getter。
- **`getValue` 缺省兜底到 `index`**：行数据既没 `value` 也没 `id` 时，用下标当值，
  列表重排时值会变，需要稳定 ID 的场景请显式传 `getValue`。
- **`style` 字段只在非标准项分支透传**：已是 `StdOptionItem` 的输入不会再拷贝 `style`。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/use-std-list-item.ts` —— 本 hook 与 `StdListItemProps`。
  - `src/lib/view/list/use-list.ts`、`src/lib/input/switcher/use-switcher.ts`、
    `src/lib/input/checklist/use-checklist.ts`、`src/lib/input/radiolist/use-radio-list.ts`、
    `src/lib/input/transfer/use-transfer.ts`、`src/lib/tile/crumb/use-ti-crumb-api.ts`、
    `src/lib/input/box3/_fea/use-box-options-data.ts` —— 实际消费方。
- **相关文档**
  - 选区按 `value` 取 ID：[`use-selectable`](use-selectable.md)。
  - 消费组件：[TiList](../../30.components/view/ti-list.md)、
    [TiCheckList](../../30.components/input/ti-check-list.md)、
    [TiRadioList](../../30.components/input/ti-radio-list.md)、
    [TiTransfer](../../30.components/input/ti-transfer.md)、
    [TiCrumb](../../30.components/tile/ti-crumb.md)。
