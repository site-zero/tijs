---
title: Util 通用工具集
keywords: [Util, 工具, 集合, 冲突, conflict, diff, getter, invoking, explain, selectValue, path, record]
status: draft
---

# `Util` 通用工具集

## 职责

`Util` 是 `src/core/util/` 目录汇总导出的无 UI 依赖通用工具命名空间，收纳组件与模型层复用最广的
一批“小而杂”的函数：集合分组与重排、本地 / 远端数据 diff 与冲突合并、按路径取值的 getter 工厂、
按字符串声明生成函数调用、解释器（`=path` / `->模板` / `=>函数`）、路径字符串处理、记录清洗与
按条件选值。它是组件库内部基础设施，业务代码也可直接 `import { Util } from "@site0/tijs"`。

> **导出形态**：`ti-exports.ts` 对本目录同时做了 `export * from "./util"` 与
> `export * as Util from "./util"`。因此**下面每个函数都有两种用法**——命名空间形式 `Util.xxx()`
> 与平铺形式 `import { xxx } from "@site0/tijs"`，二者等价。

## 导出清单

### 集合（`util-collection.ts`）

- **`pushEle(obj, key, ...vals)`** —— 把若干值推到对象某键下，确保该键最终是数组。
- **`grouping(list, groupKey, options?)`** —— 按 `groupKey` 分组；无分组键的项归入 `others`；
  `options: { titles?, otherTitle?, asList? }`。
- **`getItemIndex(list, itemId?, getId?)`** —— 按 ID 查下标，未找到 `-1`；`getId` 缺省取 `id ?? value`。
- **`getNextId(list, checkedIds?, getId?)`** —— 从最后选中项向后、再向前找第一个未选中项的 ID。
- **`moveCheckedById(list, ids, dir, getId?)`** / **`moveChecked(list, isChecked, dir)`** ——
  把选中项按 `dir: "prev"|"next"|"head"|"tail"` 整体移动，返回新列表（深拷贝）。
- **`removeListBy(inputList, predicate)`** —— 按谓词拆分出保留项与删除项 `{ list, removed }`。

### Diff（`util-diff.ts`）

- **`getRecordDiff(org, data, options?)`** —— 浅层记录 diff：返回 `data` 相对 `org` 改动的键值，
  被删键置 `null`；`options: { checkRemoveFromOrgin?, ignoreKeys? }`。
- **`getRecordDiffDeeply(org, data, options?)`** —— 递归到纯对象的深层 diff。
- **`isDeepEqual(o0, o1)`** —— 含 `Map`/`Set`/数组的递归深比较。
- **`setRecordEmptyToNull(obj)` / `setMapEmptyToNull(map)`** —— 把空值统一改写为 `null`。
- **`buildDifferentItem(myData, taData, options?)`** —— 生成单条 `DiffItem`（`INSERT`/`CHANGE`/`DELETE`）。
- **`buildDifferentListItems(myList, taList, options?)`** —— 逐 ID 对齐生成 `DiffItem[]`；
  `findOneQuiet` 找到一个即返回。
- **`getDiffItemType(item)`** —— 由 `existsInMine/existsInTarget` 推 `CHANGE/INSERT/DELETE`。
- **`buildMapFromList(getId, list?)`** —— 列表按 ID 编成 `Map<id, item>`。

### 冲突合并（`util-conflict.ts`）

- **`has_conflict(cf?)` / `has_conflict_in(cfs?)`** —— 判断单条 / 一批 `ConflictItem` 是否真冲突。
- **`buildConflict(myDiff, taDiff, options)`** —— 两条 `DiffItem` 构建一条 `ConflictItem`；
  两边操作类型不同即整体冲突，同改才逐字段比 `fields`。
- **`buildConflictList(myList, taList, options)`** —— 逐条对齐构建冲突列表。
- **`apply_conflict(server, localDiff, setLocalMeta)`** —— 把本地 delta 合到 server 上。
- **`apply_conflict_list(server, localDiff, setLocalList, keepOrderBy)`** —— 合并并按本地顺序重排。
- **`get_conflict_delta(data, conflict)`** —— 剔除冲突字段后的 delta。

### 取值 getter（`util-getter.ts`）

- **`DefaultIdGetter`** —— `it => it.id ?? it.value`。
- **`genObjPathGetter(input)`** —— 把 `"a.b[1].c"` 编译成逐段取值函数。
- **`genObjGetter(input, options?)`** —— 支持 `a|b|c` fallback 键链；`options: { test?, enableKeyPath?, getDefault? }`。
- **`genGetter(input?, options?)`** —— 入参是函数则原样返回，是字符串则走 `genObjGetter`。
- **`genGetterWithDft(input, options)`** —— 同上但要求 `getDefault`。
- **`genItemPathGetter(input, options?)` / `genItemGetter(input?, options?)`** —— 面向列表项的取值函数，
  末段缺失回退 `item-${index}`。

### 函数调用 invoking（`util-invoking.ts`）

- **`parseInvoking(str|Invoke)`** —— 把 `"abc(m, 'demo')"` 解析成 `{ name, args }`。
- **`genInvoking(str|Function, options)`** —— 传入函数直接返回；字符串则先解析再 `genInvokingBy`。
- **`genInvokingBy(invoke, options)`** —— 按 `partial` 包裹调用：`options: { that?, context?, args?,
  funcSet?, partial?, dft? }`，`partial: "left"|"right"|"left?"|"right?"`。

### 解释器 explain（`util-explain.ts` + `explain/`）

- **`explainObj(context, obj, options?)`** —— 把一个“声明式对象”按上下文求值成真实值；
  `options: { funcSet?, evalFunc?, iteratee?, jsValue?, showTmplKey? }`。
- **`buildExplainer(obj)`** —— 为字符串 / 函数 / 数组 / 对象 / 原始值选择对应 `Explainer`。

声明式字符串前缀语法（`StringExplainer`）：

| 前缀 | 含义 |
| --- | --- |
| `=path` | 从上下文取路径值（自动 `toJsValue`） |
| `=path?dft` | 取路径，缺失用静态缺省 |
| `=path?=other` | 取路径，缺失回退另一条路径 |
| `=..` | 返回整个上下文的深拷贝 |
| `==path` / `!=path` | 取路径并转布尔（`!=` 取反） |
| `->模板` | 用 `Tmpl` 渲染模板字符串 |
| `=>fn(...)` | 从 `funcSet` 取函数并立即调用 |
| `==>fn` | 只取函数引用不调用 |
| `:scope=list` | 数组作用域：把后续声明式逐项映射到数组 |
| `::=...` | 转义：输出静态文本 |

### 语言 / 通用判断与映射（`util-lang.ts`）

> 文件名虽叫 `lang`，实际是一批通用小工具。

- **`jsonClone(src)`** —— 深拷贝（底层 `_.cloneDeep`）。
- **`wrapPromise(v)`** —— 把静态值包成已 resolve 的 `Promise`。
- **`anyToBool(v, trueReg?)`** —— 任意值转布尔，默认 `/^(true|yes|on)$/i`。
- **`fallback(...)` / `fallbackNil` / `fallbackEmpty` / `fallbackBlank` / `fallbackNaN`** ——
  按不同“空”语义返回第一个可用值。
- **`getFallback(obj, ...keys)` / `...Nil` / `...Empty` / `...Blank` / `...NaN`** ——
  从对象按多键 fallback 取值。
- **`getOrPick(obj, key, dft)`** —— `key` 为数组时 `pick` 子对象，否则按 fallback 键取值。
- **`trueGet(test, val, dft)`** —— 布尔 ? 三元辅助。
- **`notEmpty`/`notNil`/`notBlank`/`isBlank`/`isEqual`/`notEqual`/`notEquals`** —— 空值与相等判定。
- **`arrayToSet`/`arrayToMap`/`arrayToMapAs`/`arrayToRecord`** —— ID 数组 → `Set`/`Map`/`Record`。
- **`recordTruthyKeys`/`anyToTruthyKeys`/`mapTruthyKeys`** —— 收集真值键名。
- **`mapToObj`/`objToMap`/`filterMap`/`filterMapNilValue`/`assignMap`** —— `Map` 互转与合并。
- **`isAsyncFunc(input)`** —— 判断是否 `AsyncFunction`。
- **`escapeAnyForHtml(input)`** —— 递归对字符串值做 `_.escape`。
- **`V(getter?)`** —— 可选 getter 调用取直值。
- **`wrapPromiseFunc(funcs?)`** —— 把单个 / 多个函数规整为数组。

### 路径（`util-path.ts`）

- **`getLinkName(path)`** —— 取 Ti 链接（`@com:xxx`、`./com/xxx`）的主体名。
- **`getFileName(path, dft)` / `getMajorName(path, dft)`** —— 取文件名 / 主体名（去扩展名）。
- **`getSuffixName(path, forceLower?)` / `getSuffix(path, forceLower?)`** —— 取后缀（不含 / 含 `.`）。
- **`appendPath(...args)`** —— 多段拼接路径。
- **`getParentPath(path, { closePath? })`** —— 父路径。
- **`getRelativePath(base, path, equalPath)`** —— 算相对路径。
- **`splitPathToFullAncestorList(ph)`** —— 切出各级祖先路径。
- **`parseHref(href)`** —— **当前版本直接抛错**（“应该创建一个 Href 解析类”），未实现，勿调用。

### 记录清洗（`util-record.ts`）

- **`filterRecordNilValueDeeply(val, options?)`** —— 递归剔除 `nil` 值与 `_` 开头键；
  特殊串 `<NULL>` 会还原为 `null`；`options.ignoreKey` 可换忽略规则。
- **`filterRecord(map, predicate)`** —— 按谓词筛记录。
- **`filterRecordNilValue(map)`** —— 剔除 `nil` 值。

### 按条件选值 select-value（`util-select-value.ts`）

- **`selectValue(context, arms, options?)`** —— 从 arms 中选第一个匹配上下文的值；
  `arms` 形如 `[[值, 匹配式], [值, 匹配式], 默认值]`。
- **`buildSelectArms(arms)`** —— 把 arms 预编译成 `context => 值` 函数。

## 典型用法

以下示例改写自 `src/test/core/` 现有测试，可对照核对。

```ts
import { Util, selectValue } from "@site0/tijs";

// ---- 集合
let a = {};
Util.pushEle(a, "pets", "A", "B");            // a.pets = ["A", "B"]
Util.grouping(
  [{ type: "A", name: "A1" }, { name: "X1" }],
  "type", { asList: true }
);                                             // [{value:"A",...},{value:"Others",...}]

// ---- Diff
let diff = Util.buildDifferentItem(
  { id: "A", a: 35 }, { id: "A", a: 34 }
);                                            // { delta: { a: 35 }, ... }

// ---- 解释器（声明式求值）
Util.explainObj(
  { name: "xiaobai", age: 12 },
  { a: "=name", b: "=age", c: "=color?red" }
);                                            // { a: "xiaobai", b: 12, c: "red" }
Util.explainObj({ index: 0 }, "->list.${index}")   // "list.0"（Tmpl 模板）
Util.explainObj({ list: [ {name:"r"}, {name:"g"} ] },
  [":scope=list", { nm: "=name" }]
);                                            // [{nm:"r"},{nm:"g"}]

// ---- invoking：字符串声明包裹函数
let invoke = Util.genInvoking("abc(m, 'demo')", {
  context: { m: 100 },
  partial: "right",
  funcSet: {
    abc: (x, y, t, prefix) => `${prefix}: ${(x + y) * t}`,
  },
});
invoke(5, 9)                                  // "demo: 1400"

// ---- select-value（平铺导出用法）
let arms = [[3, "[1000,]"], [2, "[500,]"], 1];
selectValue(2000, arms)                        // 3
selectValue(100, arms)                         // 1
```

## 注意事项

- **平铺与命名空间等价**：`Util.selectValue` 与直接 `import { selectValue }` 是同一个函数；
  新代码建议统一用 `Util.xxx`，与组件库内部风格一致。
- **`buildDifferentItem` 的删除语义**：本地无、远端有的记录，`delta` 为 `{}` 且
  `existsInMine=false`，不要误以为 delta 为空就是“无差异”——要结合 `existsInMine/Target` 判断。
- **`parseHref` 是未接线桩**：调用即抛错，当前版本不要在业务里使用，等正式 Href 解析类落地。
- **`filterRecordNilValueDeeply` 的 `<NULL>` 约定**：字符串字面量 `"<NULL>"` 会被特意还原为 `null`，
  用于数据库“IS NULL”条件；普通 `null`/`undefined` 字段会被直接剔除。
- **`genObjGetter` 的 fallback 链**：`a|b|c` 按顺序试，`test` 默认只放行非 `nil`；
  想把空串也当“未命中”需自定义 `test`。
- **解释器 `=` 前缀会自动 `toJsValue`**：`"=123"` 会得到数字 `123` 而非字符串；不想要自动转换
  用 `->` 模板或静态值写法。
- **无独立单测覆盖的函数**：`util-getter.ts`、`util-path.ts`、`util-record.ts` 与 `util-lang.ts`
  多数小工具当前 `src/test/core/` 无专门用例，行为以源码为准；`grouping`/`pushEle`/diff/explain/
  invoking/select-value 均有对应 `util.*.test.ts`。

## 延伸阅读

- **源码入口**
  - `src/core/util/index.ts` —— util 目录汇总出口。
  - `src/core/util/util-collection.ts` / `util-conflict.ts` / `util-diff.ts` / `util-getter.ts`
    / `util-invoking.ts` / `util-lang.ts` / `util-path.ts` / `util-record.ts` / `util-select-value.ts`
    / `util-explain.ts` —— 各分组实现。
  - `src/core/util/explain/` —— 六类 `Explainer`（str / func / invoke / array / map / raw）。
  - `src/test/core/util.collection.test.ts` / `util.conflict.test.ts` / `util.diff.test.ts`
    / `util.explain.test.ts` / `util.invoking.test.ts` / `util.select-value.test.ts` —— 现有单测。
- **相关文档**
  - [`Tmpl` 模板引擎](./120-tmpl.md) —— 解释器 `->` 前缀与 `dyn_*` 元素的底层。
  - [`Match` 匹配](./60-match.md) —— `selectValue` arms、`buildConflictList` 的匹配式语法来源。
  - [`Str` 字符串工具](./10-str.md) —— `explainObj` 的 `=path` 自动 `toJsValue` 复用其规则。
