---
title: use-dict 字典实例构建器
keywords: [hook, useDict, use-dict, DictProps, dict, 字典, getText, getIcon, TiLabel, TiLabelTags, TiDropTag, TiMultiDroplist]
status: draft
---

# `use-dict` 字典实例构建器

## 解决什么问题

`useOptions` 面向"输入盒子"场景：字段名带 `getOption*`，返回 `{ dict }` 包装，且附带
`mustInOptions` 等输入语义。但展示型与动作型组件——`TiLabel`、`TiLabelTags`、
`TiDropTag`、`TiMultiDroplist`、`TiInput`（box3）——只需要一个能查文本/图标的字典
实例本身，字段映射也习惯用 `getText/getIcon` 这种更短的名字。

`useDict` 就是给这类组件用的精简构建器：吃 `DictProps`，**直接返回 `TiDict` 实例**
（而不是 `{ dict }`）。三种 `options` 形态（静态数组、`DictSetup`、字典名）的解析分支
与 `useOptions` 完全一致。

## 输入 Props

`DictProps`（声明于 `use-dict.ts`）：

- **`options?: DictInput`** —— 选项来源：`Vars[]` 静态数组、字典名字符串 / `DictName`；实现上同时接受 `DictSetup` 对象（见注意事项）。
- **`dictVars?: Vars`** —— 动态字典上下文变量。
- **`getIcon?: string | Convertor<Vars, IconInput | undefined>`** —— 图标的字段路径或转换函数。
- **`getText?: string | Convertor<Vars, string | undefined>`** —— 文本抽取规则。
- **`getTip?: string | Convertor<Vars, string | undefined>`** —— 提示抽取规则。
- **`getValue?: string | ((item: Vars, index: number) => any)`** —— 值抽取规则。

## 返回值 API

```ts
const dict = computed(() => useDict(props)).value;
```

直接返回 **`TiDict | undefined`**：

- **`TiDict` 实例** —— 可直接调 `getData / getItem / getText / queryData` 等字典方法（接口见 [字典模型](../../10.concepts/06-dict-model.md)）。
- **`undefined`** —— 未声明 `options`，或动态字典从 `dictVars` 取不到上下文键时返回（不抛错）。

构建分支与 `useOptions` 相同：数组 → `makeDictOptions` 后 `createDict`；`DictSetup`
→ `createDict`；字符串/DictName → `explainDictName`；动态字典缺键返回 `undefined`，
静态字典走 `checkDict`。

## 配合使用

- **与 `useOptions` 的取舍**：输入盒子（要 `mustInOptions`、要值规整）用 [use-options](./use-options.md)；展示/动作组件只要字典实例就用本 hook。
- **与 `useValuePipe`**：`TiLabel` 拿到 `dict.getText(v)` 后再过管道加工展示。
- **与 `useValueTranslator`**：`#字典名` 形态的翻译器是另一类轻量门面，见 [use-value-translator](../value/use-value-translator.md)。

典型调用片段（`TiLabel.vue` 风格）：

```ts
const _dict = computed(() => useDict(props));

// 展示时把值翻译成文本
const text = await _dict.value?.getText(value);
```

## 注意事项

- **类型与实现的小出入**：`DictInput` 类型标注为 `string | DictName | Vars[]`，未列 `DictSetup`；但实现里 `isDictSetup(options)` 分支真实存在，传 `DictSetup` 对象可以正常工作——以实现为准。
- **动态字典缺键返回 `undefined`**，静态字典未注册则 `checkDict` 抛错——两种缺失行为不同，外层都建议判空。
- **没有 `mustInOptions`**：本 hook 不做值约束，未命中字典的值由组件自行兜底。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/use-dict.ts` —— 本 hook 实现。
- **相关文档**
  - 字典数据模型与字典名写法：[字典模型](../../10.concepts/06-dict-model.md)。
  - 输入盒子侧的 `{ dict }` 构建器：[use-options](./use-options.md)。
  - 消费方 `TiLabel`：[ti-label](../../30.components/tile/ti-label.md)；`TiLabelTags`：[ti-label-tags](../../30.components/tile/ti-label-tags.md)；`TiDropTag`：[ti-drop-tag](../../30.components/action/ti-drop-tag.md)；`TiMultiDroplist`：[ti-multi-droplist](../../30.components/input/ti-multi-droplist.md)。
