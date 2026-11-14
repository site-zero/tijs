---
title: use-options 选项字典构建
keywords: [hook, useOptions, use-options, OptionsProps, options, dict, 静态字典, 动态字典, DictSetup, dictVars, mustInOptions]
status: draft
---

# `use-options` 选项字典构建

## 解决什么问题

带选项的控件（下拉、单选列表、传输框、开关组……）第一步永远是同一个问题：**根据
`options` 配置拿到一个能查项、能查询、能翻译的字典实例**。`options` 又有三种形态：
静态数组、`DictSetup` 加载配置、已注册字典的名字；动态字典还要从 `dictVars` 取上下文键。

`useOptions` 是这套构建逻辑的统一入口：吃 `OptionsProps`，吐一个 `{ dict }`。它是整个
选项/值特性链的地基——[use-value-input](../value/use-value-input.md) 在它之上叠加值规整与翻译，
`TiTransfer`、`TiCheckList`、`TiRadioList`、`TiSwitcher`、`TiSorter` 等控件直接用它。
字典模型本身（静态/动态注册表、字典名解析）在
[字典模型](../../10.concepts/06-dict-model.md) 讲透，本篇只讲控件侧的构建入口。

## 输入 Props

`OptionsProps`（声明于 `use-options.ts`）：

- **`options?: OptionsInput`** —— 选项来源，三选一：
  - `Vars[]`：静态数组；
  - `DictSetup`：含 `data/query/item/value/text/icon/tip` 的加载配置；
  - `string | DictName`：字典名字符串（可带 `#`/`@Dict:` 前缀与 `(args)`、`(=vars)` 写法）或已解析的 `DictName`。
- **`dictVars?: Vars`** —— 动态字典的上下文变量；动态写法的键从这里取。
- **`mustInOptions?: boolean`** —— 值必须来自字典；本 hook 只透传，由上层（`useValueInput`）据此约束。
- **`getOptionIcon? / getOptionText? / getOptionTip? / getOptionValue?`** —— 字段路径或转换函数，覆盖静态数组/`DictSetup` 的 `icon/text/tip/value` 抽取规则。

## 返回值 API

```ts
const { dict } = useOptions(props);
```

返回 **`OptionsFeature = { dict?: Dicts.TiDict }`**：

- **`dict?: TiDict`** —— 构建出的字典实例；无 `options`、或动态字典缺上下文键时为 `undefined`。

构建分支（`__build_dict`）：

1. 数组 → `Dicts.makeDictOptions({ data, icon, text, tip, value })` 后 `createDict`。
2. `DictSetup` 对象 → `makeDictOptions(options)` 后 `createDict`。
3. 字符串 → `dictReferName` 去前缀、`explainDictName` 解析为 `DictName`；`DictName` 直接使用。
4. 动态字典：缺 `dictKey` 抛错；从 `dictVars` 取到空键则返回 `undefined`（不抛错）；否则 `checkDynamicDict(name, key, dictVars)`。
5. 静态字典：`checkDict(name)`，字典未注册抛错。

## 配合使用

- **与 `useValueInput`**：输入类控件通常不再自己调 `useOptions`——`useValueInput` 内部已经调用并把 `dict` 透传出来。
- **与 `useDict`**：字段名为 `getIcon/getText/...` 的同类构建器，直接返回字典实例而非 `{ dict }` 包装，见 [use-dict](./use-dict.md)。
- **与字典模型**：`DictSetup`、字典名写法、动态缓存键见 [字典模型](../../10.concepts/06-dict-model.md)。

典型调用片段（`use-radio-list.ts` 风格）：

```ts
// 建议放 computed 以跟随 props 重建
const { dict } = computed(() => useOptions(props)).value;

// 有字典就加载全部选项渲染，没有就走空态
const data = dict ? await dict.getData() : [];
```

```ts
// 动态字典：props.options = "pet(=catType)"，dictVars 提供 catType
useOptions({ options: 'pet(=catType)', dictVars: { catType: 'dog' } });
```

## 注意事项

- **动态字典缺键不抛错、返回 `undefined`**：避免表单上下文还没就绪时整树崩溃；上层需自行判空。
- **静态字典未注册会抛错**：`checkDict` 取不到直接异常，与动态缺键的行为不同。
- **每次调用都重新构建**：数组/`DictSetup` 分支会 `createDict`（静态字典同名缓存会被替换）；建议放 `computed` 且不要在循环里重复调用。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/use-options.ts` —— 本 hook 实现。
- **相关文档**
  - 字典数据模型与字典名写法：[字典模型](../../10.concepts/06-dict-model.md)。
  - 在字典之上叠加值规整：[use-value-input](../value/use-value-input.md)。
  - 直接返回实例的同类构建器：[use-dict](./use-dict.md)。
  - 消费方 `TiTransfer`：[ti-transfer](../../30.components/input/ti-transfer.md)；`TiRadioList`：[ti-radio-list](../../30.components/input/ti-radio-list.md)；`TiCheckList`：[ti-check-list](../../30.components/input/ti-check-list.md)；`TiSwitcher`：[ti-switcher](../../30.components/input/ti-switcher.md)。
