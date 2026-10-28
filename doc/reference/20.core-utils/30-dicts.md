---
title: Dicts 字典注册表
keywords: [Dicts, 字典, Dict, 注册表, 工厂, createDict, getDict, 动态字典, makeDictOptions, DictItem]
status: draft
---

# `Dicts` 字典注册表

## 职责

`Dicts` 是 `src/core/dict/ti-dict.ts` 导出的字典注册表 / 工厂命名空间。它维护两份全局注册表：
一份**静态字典**（按名字缓存 `IDict` 实例），一份**动态字典**（按「类型名 + 上下文键」生成多份
实例），并提供把简化配置 `DictSetup` 编译成标准配置 `DictOptions` 的 `makeDictOptions`。

字典内部怎么缓存、异步加载、原始项如何转标准项 `DictItem`，属于字典模型机制，已在概念篇
[字典模型](../10.concepts/06-dict-model.md) 讲透，本篇只列 `Dicts` 对外暴露的函数与类型 API，
不重复展开机制。控件侧如何通过 `options` / `dictVars` 消费字典，同样见概念篇。

## 导出清单

### 配置编译

- **`makeDictOptions(setup?)`** —— 把简化配置 `DictSetup` 编译成标准 `DictOptions`：
  编译 `data/query/item` 加载器，生成 `getText/getIcon/getTip/getValue`；缺省字段分别取
  `text/icon/tip/value`，`value` 缺失时回退为 `row-<index>`。
- **`isDictSetup(it)`** —— 类型守卫：判断对象是否为合法 `DictSetup`（含 `data` 且键名合法）。

### 静态字典注册表

- **`createDict(options, name?)`** —— 新建字典实例；带 `name` 则注册进缓存，同名旧实例被替换。
- **`getOrCreate(options, name?)`** —— `name` 已注册则直接返回缓存实例，否则新建（= `createDict`）。
- **`setDict(name, dict)`** —— 注册一个现成实例；同名旧实例会被覆盖并返回，否则 `undefined`。
- **`getDict(name)`** —— 按名取实例，不存在返回 `undefined`。
- **`checkDict(name)`** —— 按名取实例，不存在直接抛错。
- **`hasDict(name)`** —— 判断静态字典是否已注册。
- **`wrapDict(dict, options)`** —— 在不改原实例的前提下包裹一层新的取值规则，返回新实例。

### 字典名解析

- **`dictReferName(str)`** —— 去掉字典引用名前缀 `#` 或 `@Dict:`（如 `#pets` → `pets`）。
- **`explainDictName(dictName)`** —— 把 `"pet(dog,12):.icon"` 这类写法解析成 `DictName`
  （`name / args / vkey / dynamic / dictKey`）。
- **`isDictDictName(it)`** —— 类型守卫：判断是否为合法 `DictName`。

### 动态字典注册表

- **`createDynamicDict(creator, name)`** —— 注册动态字典工厂 `(vars) => IDict`。
- **`getDynamicDict(name, key, vars)`** —— 按 `name.key` 取实例，不存在则调工厂生成；取不到返回
  `undefined`。
- **`checkDynamicDict(name, key, vars)`** —— 同上，但取不到直接抛错，保证拿到非空实例。

### 核心类型（随命名空间一起导出）

- **`TiDict`** —— `IDict<any, any>` 别名，注册表函数的实例类型。
- **`interface IDict<T, V>`** —— 字典接口：`getData/getItem/queryData/getChildren` 与对应的
  `*Std*` 标准项方法，以及 `getText/getTip/getIcon/toStdItem` 等同步转换方法（详见概念篇）。
- **`class DictItem<V>`** —— 标准项 `{ value, text, icon, tip }`，`toOptionItem()` 转控件选项。
- **`DictSetup` / `DictOptions` / `DictName` / `DynDictMaker<T, V>`** —— 配置、标准配置、
  解析结果、动态工厂签名类型。

## 典型用法

以下示例改写自 `src/test/core/dict.simple.test.ts`、`dict.dynamic.test.ts`，可直接核对。

```ts
import { Dicts } from "@site0/tijs";

// 1. 注册并使用一个静态字典：简化配置 -> 标准配置 -> 按名取实例
const $pet = Dicts.getOrCreate(
  Dicts.makeDictOptions({
    data: [
      { value: 1, text: "wangcai", icon: "icon-a", tip: "tip-a" },
      { value: 2, text: "xiaohei" },
      { value: 3, text: "buck" },
    ],
  }),
  "pet",
);

let list = await $pet.getData();   // 3 项，带内存缓存
await $pet.getText(2);             // "xiaohei"
await $pet.getIcon(1);             // "icon-a"

// 2. 按正则 / 范围关键字查询（未声明 query 时走默认匹配逻辑）
await $pet.queryData("^(wang|buck)");  // 命中 wangcai、buck

// 3. 动态字典：同一工厂按上下文键生成多份实例
Dicts.createDynamicDict((vars) => {
  const rows = [
    { value: 1, race: "dog", text: "wangcai" },
    { value: 4, race: "cat", text: "xiaobai" },
  ].filter((it) => it.race == vars.race);
  return Dicts.createDict(Dicts.makeDictOptions({ data: rows }));
}, "petType");

const dogs = await Dicts.checkDynamicDict("petType", "dog", { race: "dog" }).getData();
// dogs.length === 1，取到 wangcai

// 4. 字典引用名解析
Dicts.explainDictName("pet(dog, 12):.icon");
// { name: "pet", args: ["dog", "12"], vkey: ".icon" }
Dicts.dictReferName("@Dict:pets");   // "pets"
```

## 注意事项

- **静态同名即覆盖**：`createDict(options, name)` / `setDict(name, dict)` 都会替换同名旧实例，
  旧实例静默丢弃；`getOrCreate` 则相反——已存在直接返回，不会用新 `options` 覆盖。
- **动态实例缓存键形如 `petType.dog`**：`key` 为数组时用 `.` 拼成多级键；`vars` 是工厂的入参
  而非缓存键，改了 `vars` 但 `key` 相同会命中旧实例。
- **`explainDictName` 的动态判定**：仅当恰好一个参数且以 `=` 开头（如 `pet(=age)`）才置
  `dynamic = true` 并记录 `dictKey`；多参数或不带 `=` 一律当静态字典过滤参数。
- **`makeDictOptions` 的字段回退**：`text/icon/tip` 缺省分别映射同名字段；`value` 为函数时原样
  作为取值器，否则按字段路径取、取到 `nil` 时用 `row-<index>` 兜底。
- **`setDict` 把现成实例塞进注册表，`createDict`/`getOrCreate` 接收的是 `DictOptions`**，
  两者入参形态不同，不要混用。
- **当前无单元测试覆盖**：`setDict`、`hasDict`、`getDict`、`checkDict`、`wrapDict`、
  `dictReferName`、`explainDictName`、`getDynamicDict` 在 `src/test/core/` 下无对应用例；
  上述行为直接核对 `ti-dict.ts` 源码得出。

## 延伸阅读

- **源码入口**
  - `src/core/dict/ti-dict.ts` —— `Dicts` 命名空间：静态/动态注册表入口、`makeDictOptions`、
    字典名解析。
  - `src/core/dict/dict-types.ts` —— `IDict` / `DictOptions` / `DictSetup` / `DictName` /
    `DictItem`（经 `export *` 并入 `Dicts`）。
  - `src/test/core/dict.simple.test.ts`、`src/test/core/dict.dynamic.test.ts` —— 现有单测。
  - 机制实现（`dict-abstract.ts` / `dict-impl.ts` / `dict-impl-dft.ts` / `dict-options.ts` /
    `dict-wrapper.ts` / `dict-factory.ts` / `dyn-dict-factory.ts`）见概念篇，不在本篇展开。
- **相关文档**
  - 字典模型机制（缓存、异步加载、标准项转换、字典名写法表）：[字典模型](../10.concepts/06-dict-model.md)。
