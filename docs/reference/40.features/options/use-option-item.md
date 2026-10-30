---
title: use-option-item 选项项抽取与查找
keywords: [hook, useOptionItem, use-option-item, OptionItem, toOptionItem, getText, getValue, lookupItem, 选项, 键盘导航, getOptionItemAt]
status: draft
---

# `use-option-item` 选项项抽取与查找

## 解决什么问题

字典里取回来的原始数据字段名五花八门，但渲染下拉列表需要统一成 `{ icon, text, tip,
value }` 四元组；键盘上下导航还要按索引循环取项、按值反查项、按输入提示模糊命中一项。
这些"从原始行里抽字段 + 在列表里定位项"的操作，在 `TiInputCombo` 与 `TiInput`（box3）
的下拉面板里反复出现。

`useOptionItem` 就是这层工具箱：声明 `getIcon/getText/getTip/getValue` 四条抽取规则后，
它同时给出原始项与标准项两套查找函数，并处理"第一项是清除项"这类列表偏移约定。

## 输入 Props

`OptionItemProps<T>`（声明于 `use-option-item.ts`），混入 `ItemLookupProps`（模糊匹配
规则，内部转交 `useItemLookup`）：

- **`showCleanOption?: boolean`** —— 列表第一项是占位的"清除"选项；索引查找/定位时会跳过它。
- **`getIcon?: string | Convertor<Vars, IconInput | undefined>`** —— 图标抽取路径或函数，缺省 `it.icon`。
- **`getText?: string | Convertor<Vars, string | undefined>`** —— 文本抽取，缺省 `it.text || it.title`。
- **`getTip?: string | Convertor<Vars, string | undefined>`** —— 提示抽取，缺省 `it.tip`。
- **`getValue?: string | Convertor<Vars, T>`** —— 值抽取，缺省按 `value → id → uniqKey → key` 顺序回退取第一个非空。

## 返回值 API

```ts
const item = useOptionItem<any>(props);
```

四个抽取器与一组查找函数：

- **`getIcon(vars) / getText(vars) / getTip(vars) / getValue(vars)`** —— 从原始项抽取对应字段（经 `Util.genGetter` 编译路径/函数）。
- **`toOptionItem(vars): OptionItem<T>`** —— 原始项转标准项；本身已是标准项（`isAnyOptionItem`）则原样返回。
- **`getOptionItemIndex(list, value): number`** —— 按值在列表里找索引；找不到返回 `-1`（若开了 `showCleanOption` 则返回 `0`）；匹配时按 `==` 宽松比较，标准项直接取 `.value`。
- **`getRawItemAt(list, index, offset = 0)`** —— 按索引（可带 `offset` 循环偏移）取原始项；越界时 `offset < 0` 循环回绕，否则回落到第 0 项；空列表返回 `undefined`。
- **`getRawItemByVal(list, value)`** —— 按值取原始项。
- **`getOptionItemAt(list, index, offset = 0)`** —— 同上，但结果经 `toOptionItem` 转成标准项。
- **`getOptionItemByVal(list, value)`** —— 按值取标准项。
- **`lookupItem(list, hint)`** —— 用 `useItemLookup` 的匹配器逐条尝试，返回第一个命中的原始项。

## 配合使用

- **与字典数据**：输入列表通常来自 `dict.getData()` 的原始项；标准项再交给模板渲染。
- **与 `useOptionsFilter`**：先过过滤器拼出最终列表（含清除项/固定项），再用本 hook 做索引与值定位，见 [use-options-filter](./use-options-filter.md)。

典型调用片段：

```ts
const boxItem = useOptionItem<any>(props);

// 键盘下键：把高亮索引向下循环一格
const next = boxItem.getRawItemAt(list, currentIndex, +1);

// 选中后按值反查标准项
const std = boxItem.getOptionItemByVal(list, value);

// 输入提示时快速命中一项（配合 lookup 规则）
const hit = boxItem.lookupItem(list, hintText);
```

## 注意事项

- **宽松比较 `==`**：值 `1` 与字符串 `"1"` 视为同一项，需要严格相等时在外层先规整。
- **`getValue` 未声明时找不到字段会怎样**：默认回退链 `value/id/uniqKey/key` 全空时得到 `undefined`；自定义 `getValue` 无法推出值时会直接抛错。
- **本文件从 `@site0/tijs` 包出口导入** `useItemLookup`、`isAnyOptionItem` 等，`ItemLookupProps` 的字段定义见包类型。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/use-option-item.ts` —— 本 hook 实现。
  - `src/lib/input/combo/use-input-combo-api.ts`、`src/lib/input/box3/_fea/use-box-options-data.ts` —— 消费方。
- **相关文档**
  - 选项列表的过滤与拼装：[use-options-filter](./use-options-filter.md)。
  - 字典标准项 `DictItem`：[字典模型](../../10.concepts/06-dict-model.md)。
  - 消费方 `TiInputCombo`：[ti-input-combo](../../30.components/input/ti-input-combo.md)。
