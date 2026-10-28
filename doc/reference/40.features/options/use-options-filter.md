---
title: use-options-filter 选项列表过滤拼装
keywords: [hook, useOptionsFilter, use-options-filter, optionFilter, fixedOptions, showCleanOption, 清除选项, lookup, 选项过滤, BoxOptionFilterMaker]
status: draft
---

# `use-options-filter` 选项列表过滤拼装

## 解决什么问题

下拉面板里最终展示的选项列表，往往不是字典原样吐出来的那一份：开头要插一个"清除"
选项、要置顶一批固定项（最近选择、推荐项）、还要按一个 `AutoMatch` 条件把字典项里
不该出现的筛掉。这个"插入 + 过滤 + 拼装"的工序在 `TiInputCombo` 与 `TiInput`（box3）
里完全一致。

`useOptionsFilter` 把它固定成一条流水线：**清除项 → 固定项 → 按过滤器筛过的字典项**，
过滤器本身支持函数、`lookup` 规则或 `Match` 描述三种写法。

## 输入 Props

`OptionsFilterProps`（声明于 `use-options-filter.ts`），混入 `ItemLookupProps`
（`optionFilter: "lookup"` 时依赖其匹配规则）：

- **`fixedOptions?: Vars[] | (() => Vars[])`** —— 固定置顶选项；函数形态每次取列表时现算。
- **`optionFilter?: Record<string, any> | Record<string, any>[] | BoxOptionFilterMaker | "lookup"`** —— 过滤器：
  - 函数（`BoxOptionFilterMaker`）：以 `optionFilterVars` 为参数现场生成判定函数；
  - `"lookup"`：要求声明 `lookup`，用 `useItemLookup` 的 `matchAny` 按 hint 判定；未声明 `lookup` 时退化为恒真；
  - 对象/数组：当作 `Match` 匹配描述编译，`optionFilterVars` 非空时先对描述做变量解释。
- **`optionFilterVars?: Vars`** —— 过滤器上下文：函数形态作为参数，对象形态作为模板解释变量。
- **`showCleanOption?: boolean`** —— 是否在列表首部插入"清除"选项。
- **`clearOptionItemIcon?: IconInput | null`** —— 清除项图标，缺省 `zmdi-delete`，`null` 不显示图标。
- **`clearOptionItemText?: string`** —— 清除项文字，缺省 `i18n:clear`，走 `I18n.text`。
- **`clearOptionItemStyle?: Vars`** —— 清除项样式，缺省灰色文字。

## 返回值 API

```ts
const filter = useOptionsFilter(props, { getHint });
```

第二参数 `OptionsFilterSetup` 只需要 `{ getHint?: () => string }`——取当前输入提示串。
返回三个函数：

- **`getFixedOptions(): Vars[]`** —— 取固定项列表（函数形态现算）。
- **`createFilter(): (item: Vars) => boolean`** —— 编译出的单项判定函数（computed 派生）。
- **`filterOptionsData(list: Vars[]): Vars[]`** —— 主入口：输入字典原始项列表，返回拼装后的最终列表——
  1. 开了 `showCleanOption` 先推清除项（`{ value: null, icon, text, style }`）；
  2. 推入全部固定项；
  3. 逐项 `setBoxOptionItemHint(it, hint)` 注入当前 hint，过过滤器命中后推送 `{ ...it }` 副本。

## 配合使用

- **与 `useOptionItem`**：本 hook 产出最终列表，[use-option-item](./use-option-item.md) 再在它上面做索引/值定位。
- **与 `useOptionsReloading`**：本 hook 消费的 `list` 正是重载 hook 异步拉回来的数据，见 [use-options-reloading](./use-options-reloading.md)。

典型调用片段（`use-input-combo-api.ts` 风格）：

```ts
const boxFilter = useOptionsFilter(props, {
  getHint: () => state.boxInputing, // 当前输入框内容作为 hint
});

// 字典数据 → 面板最终列表
const panelList = boxFilter.filterOptionsData(rawDictData);
```

```ts
// 按上下文过滤：只看当前国家下的城市
useOptionsFilter({
  optionFilter: { country: '${country}' },
  optionFilterVars: { country: currentCountry },
  showCleanOption: true,
});
```

## 注意事项

- **动态项推送的是副本**：`{ ...it }` 浅拷贝，避免过滤操作污染字典缓存里的原始项。
- **`"lookup"` 退化为恒真**：只写 `optionFilter: "lookup"` 而没配 `lookup` 规则时不过滤任何项，排查时先看规则是否漏配。
- **清除项 `value` 固定为 `null`**：选中它即表示清空。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/use-options-filter.ts` —— 本 hook 实现。
  - `src/lib/input/combo/use-input-combo-api.ts`、`src/lib/input/box3/_fea/use-box-options-data.ts` —— 消费方。
- **相关文档**
  - 列表项定位：[use-option-item](./use-option-item.md)。
  - 异步重载：[use-options-reloading](./use-options-reloading.md)。
  - 消费方 `TiInputCombo`：[ti-input-combo](../../30.components/input/ti-input-combo.md)。
