---
title: 字典模型
keywords: [字典, Dict, Dicts, 选项, options, 静态字典, 动态字典, DictItem, query, mustInOptions, useOptions]
status: draft
---

# 字典模型

## 要解决的问题

下拉框、单选列表、多选列表、评分、传输框这类控件都面临同一个问题：**选项来自哪里、
选中值怎么翻译成显示文本**。选项可能是：

- 写死在组件配置里的静态数组；
- 调用后端接口按关键字查询；
- 从一份大字典里按条件过滤出子集；
- 依赖当前表单上下文（例如"先选国家，再选省份"）动态生成。

如果每个控件各自实现数据加载、缓存、值到文本/图标/提示的转换，口径会完全失控。
TiJS 用统一的 **字典（Dict）模型** 承载选项数据集与取值转换，控件只消费字典实例。

## 解决思路

### 两层数据形态

```text
原始数据 T[]（后端返回/静态数组，字段名任意）
        │  getText / getIcon / getTip / getValue 抽取
        ▼
标准项 DictItem<V>（{ value, text, icon, tip }）
        │  toOptionItem()
        ▼
控件可直接渲染的 OptionItem
```

`IDict<T, V>` 同时提供两套方法：`getData / getItem / queryData / getChildren` 返回
原始项；`getStdData / getStdItem / queryStdData / getStdChildren` 返回标准 `DictItem`。
标准项构造完成后可通过 `toOptionItem()` 转为控件选项对象。

### 字典接口：`IDict`

**异步数据方法**（都接受 `AbortSignal` 支持取消）：

- **`getData(force?, signal?)`** —— 取全部数据，带内存缓存；`force=true` 强制刷新。
- **`getItem(val, signal?)`** —— 按值查单项；`checkItem` 找不到则抛错。
- **`queryData(args, signal?)`** —— 按输入关键字查询候选。
- **`getChildren(v, signal?)`** —— 取子级（树形字典用）。

**同步转换方法**：

- **`toStdItem(it)`** —— 原始项转标准项。
- **`getText / getTip / getIcon(val)`** —— 按值异步取展示文本、提示、图标。
- **`getItemValue / getItemText / getItemTip / getItemIcon(it)`** —— 直接从原始项抽取。
- **`isMatched(item, val)`** —— 判定原始项是否匹配查询关键字。
- **`clearCache()`** —— 清空数据缓存与值索引。

`DictImpl` 内部维护 `_cache_data` 与 `_cache_item`（值 → 原始项索引）；并发的首次加载
会进入等待队列，加载完成后统一唤醒。

### 字典配置：`DictSetup`

`Dicts.makeDictOptions(setup)` 把一份简化配置编译成 `DictOptions`：

- **`data`** —— 静态数组，或异步加载函数（必填）。
- **`query?`** —— 查询函数；未声明时用默认匹配逻辑遍历已加载数据。
- **`item?`** —— 单项查找函数或 `Match` 匹配条件；未声明时按值索引查找。
- **`value?`** —— 值字段名或取值函数；缺省取 `value`，缺失时回退为 `row-<index>`。
- **`text? / icon? / tip?`** —— 展示字段名或取值函数，缺省分别为 `text / icon / tip`。

### 静态字典与动态字典

`Dicts` 命名空间维护两类注册表：

**静态字典**（`DictFactoryImpl`）：按名字缓存实例。

- **`createDict(options, name?)`** —— 新建并（可选）缓存；同名会被替换。
- **`getOrCreate(options, name?)`** —— 已存在则返回缓存实例。
- **`setDict / getDict / checkDict / hasDict(name)`** —— 注册、查询、强制查询、判断存在。
- **`wrapDict(dict, options)`** —— 在不改原实例的前提下，包裹一层新的取值规则。

**动态字典**（`DynDictFactoryImpl`）：同一个字典类型按上下文键生成多份实例。

- **`createDynamicDict(creator, name)`** —— 注册工厂函数 `(vars) => IDict`。
- **`getDynamicDict(name, key, vars)`** —— 按 `name.key` 取实例，不存在则调用工厂生成；
  **`checkDynamicDict`** 取不到直接抛错。

实例缓存键形如 `pet.cat`、`foo.A`；`key` 为数组时用 `.` 拼接成多级键。

### 字典名解析

控件 `options` 传入字符串时，先去掉 `#` 或 `@Dict:` 前缀（`dictReferName`），再由
`explainDictName` 解析出结构化字典名：

| 写法 | 含义 |
| --- | --- |
| `"pet"` | 静态字典 `pet` |
| `"pet:.icon"` | 静态字典，展示时取 `icon` 字段而非 `text` |
| `"pet(dog)"` | 传参数 `dog`，从数据集中过滤子集 |
| `"pet(dog, 12)"` | 多个过滤参数 |
| `"pet(=age)"` | 动态字典，键取自上下文 `dictVars.age` |
| `"pet(=age):.icon"` | 动态字典 + 指定展示字段 |

解析结果 `DictName` 包含 `name / args / vkey / dynamic / dictKey`。动态字典缺少对应上下文
键时，`useOptions` / `useDict` 返回 `undefined`，不抛错。

### 控件消费方式

选项型控件通过 `OptionsProps` 接入字典：

- **`options?`** —— 三种形态：原始数组、`DictSetup` 配置对象、字典名字符串/`DictName`。
- **`dictVars?: Vars`** —— 动态字典的上下文变量。
- **`mustInOptions?: boolean`** —— 值必须在字典中；开启后选中值会强制走字典查项。
- **`getOptionIcon / getOptionText / getOptionTip / getOptionValue?`**
  —— 字段路径或自定义转换函数，覆盖默认抽取规则。

`useOptions(props)` 只负责根据 `options` 构建并返回 `{ dict }`；输入类控件再叠加
`useValueInput`（见 feature 篇样例）完成输入规整、字典校验与值翻译。`useDict` 是
带 `getText/getTip/getIcon/getValue` 转换覆盖能力的同类构建器。

## 关键细节

- **异步与缓存**：字典方法全部是 `Promise`；数据只加载一次并缓存，`getData(true)` 才刷新。
- **取消请求**：查询与取项都传递 `AbortSignal`；输入型控件在新一轮输入前会 abort 上一次查询。
- **`mustInOptions` 关闭时**：字典里查不到的值原样保留，不强制约束。
- **字段名映射**：静态数组项字段名与默认 `value/text/icon/tip` 不一致时，通过
  `getOption*` 或 `DictSetup` 字段映射解决，不要改动原始数据。

## 主要代码入口

- `src/core/dict/ti-dict.ts` —— `Dicts` 命名空间导出、静态/动态工厂入口、字典名解析。
- `src/core/dict/dict-types.ts` —— `IDict`、`DictOptions`、`DictSetup`、`DictItem`、`DictName`。
- `src/core/dict/dict-impl.ts` —— `DictImpl` 缓存与加载实现。
- `src/core/dict/dict-abstract.ts` —— 原始项与标准项两套方法的桥接。
- `src/core/dict/dict-options.ts` —— `data/query/item` 加载器生成。
- `src/lib/_features/use-options.ts`、`use-dict.ts` —— 控件侧字典构建 hook。

## 延伸阅读

- 选项型输入控件的值规整与翻译：[use-value-input](../40.features/value/use-value-input.md)。
- 共享 Props 中与字典配合的 `getOption*` 字段：[共享 Props](02-common-props.md)。
- 字典工具 API 清单：[Dicts 字典注册表](../20.core-utils/30-dicts.md)。
