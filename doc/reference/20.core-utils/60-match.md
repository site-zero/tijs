---
title: Match 条件匹配
keywords: [Match, TiMatch, 匹配, 条件, by_str, by_regex, 范围, exists, blank, 通配符, findInArray, parse, test]
status: draft
---

# `Match` 条件匹配

## 职责

`Match` 是 `src/core/match/ti-match.ts` 导出的「条件匹配」命名空间。它解决的问题是：**把一段
配置（字符串、数字、布尔、数组、普通对象、`Map`、正则、甚至函数）编译成一个统一的匹配器
`TiMatch`**，再用同一个 `test(input)` 接口去判断任意输入是否命中。

字典模型里 `item`、可见性 `visible/hidden/disabled/enabled`、以及各类「按条件过滤」的场景，
都用 `TiMatch` 作为表达载体；`Match` 只负责「怎么写条件」和「怎么判定」，不关心条件挂在哪个
组件上（字典侧的消费方式见 [字典模型](../10.concepts/06-dict-model.md)）。

## 导出清单

### 编译与测试入口

- **`Match.parse(src, dft?)`** —— 宽容编译：已是 `TiMatch` 原样返回；`null/undefined` 时返回
  恒等于 `dft`（缺省 `false`）的匹配器；布尔返回恒等于该布尔的匹配器；其余转交
  `parse_strictly`。
- **`Match.parse_strictly(src)`** —— 严格编译，按输入类型分派规则（见下表）；无法识别的类型
  抛 `e.match.unsupport`。
- **`Match.test(src, val)`** —— 一步到位：`parse(src).test(val)`。
- **`Match.notMatch(m)`** —— 对已有匹配器取反，返回新匹配器。
- **`Match.createExplainI18n()`** —— 生成一份解释文案用的 `ExplainI18n` 键表（全部为
  `i18n:am-*` 键），供 `explainText` 生成人类可读的条件描述。

### 严格编译按输入形态分派

`parse_strictly` 根据 `src` 的 JS 类型选择匹配器：

| `src` 形态 | 编译结果 | 判定语义 |
| --- | --- | --- |
| `TiMatch`（带 `test`+`explainText`） | 原样 | 自有逻辑 |
| `Function` | 函数匹配器 | 函数返回值真值化 |
| `null/undefined` | 空值匹配器 | `_.isNil(input)` |
| `boolean` / `number` | 严格相等匹配器 | `src == input`（宽松相等） |
| `string` | 字符串规则解析 | 见下文「字符串规则」 |
| `any[]` | 数组（OR）匹配器 | 任一子条件命中即命中 |
| 普通对象 / `Map` | 映射匹配器 | 所有键条件同时命中（AND） |
| `RegExp` | 正则匹配器 | `reg.test(input)` |
| 其他 | 抛错 | `e.match.unsupport` |

### 字符串规则（`by_str`）

字符串先 `trim`，再按顺序识别：

- **空串** → 空匹配器（`_.isEmpty(input)`）。
- **前导 `!`** → 去掉后取反（可与下列任意规则叠加）。
- **`"[BLANK]"`** → 空白匹配器（`Str.isBlank`，`null/undefined/纯空白串` 均命中）。
- **以 `^` 开头** → 编译为 `RegExp` 做正则匹配。
- **`str(...)` / `str[...]`**（前缀 `str` 大小写不敏感）→ 字符串区间匹配（`StrRange`）。
- **`(...)` / `[...]` 括号区间**：区间内容含非数字字符时按字符串区间处理，否则按数值区间
  （`NumRange`，圆括号开区间、方括号闭区间，如 `[2,5)`）。
- **含 `*`** → 通配符匹配（见注意事项）。
- **以上都不是** → 严格相等匹配（`src == input`，宽松相等）。

### 映射规则（普通对象 / `Map`）

普通对象先查特殊键，都不命中时按逐键 AND 编译：

- **`{ $Nil: key }`** → 指定路径的值为 `null/undefined`。
- **`{ $Null: key }`** → 指定路径的值严格为 `null`（见注意事项的实现疑点）。
- **`{ $Undefined: key }`** → 指定路径的值严格为 `undefined`。
- **`{ $Empty: key }`** → 指定路径的值 `_.isEmpty`。
- **`{ $Type: typeName }`** → `typeof input === typeName`。
- **`{ matchMode: 'findInArray', matchBy, not? }`** → 把输入拍平成数组，任一元素命中
  `matchBy`（递归 `parse`）即命中；`not=true` 取反。
- **逐键一般形式**：键以 `!` 开头表示该键条件取反；值为 `"[EXISTS]"` 表示该路径存在
  （值非 `undefined`，`null` 也算存在），`"![EXISTS]"` 表示不存在；其余值递归
  `parse_strictly`。判定时输入必须是普通对象或 `Map`，对象用 `_.get` 取值（支持
  `"a.b.c"` 路径），`Map` 用 `.get`；所有键条件为 AND。

### 匹配器接口

- **`TiMatch`** —— `{ test(it): boolean; explainText(i18n): string }`；`isTiMatch(input)`
  是其类型守卫。
- **`MakeTiMatch<T>`** —— 各 `gen_by_*` 工厂的统一签名 `(src: T) => TiMatch`。

## 典型用法

以下示例改写自 `src/test/core/match.test.ts`，可直接对照测试核对。

```ts
import { Match } from "@site0/tijs";

// 数值区间：[2,5) 左闭右开
Match.test("[2,5)", 5)        // false（5 不在区间内）
Match.test("[2,5)", 3)        // true
Match.test("[2,5)", "abdd")   // false

// 映射匹配：对象逐键 AND
Match.parse({ x: 100 }).test({ x: 100, y: 99 })   // true
Match.parse({ y: 98 }).test({ x: 100, y: 99 })    // false

// 字符串组合规则：正则 + 区间 + 取反
let m = Match.parse({ name: "^xiao.+$", age: "[10, 15]" });
m.test({ name: "xiaobai", age: 12 })   // true
m.test({ name: "xiaobai", age: 20 })   // false

// 正则取反（! 在引号字符串里写在规则前面）
Match.parse("!^/home/.+/gen$").test("/home/demo/a.jpg")   // true

// 键存在性：null 也算存在
Match.parse({ abc: "[EXISTS]" }).test({ abc: null })   // true
Match.parse({ abc: "[EXISTS]" }).test({ xyz: null })   // false

// 支持 "a.b.c" 嵌套路径
Match.parse({ "a.b.c": "[EXISTS]" }).test({ a: { b: { c: null } } })   // true

// 空白判定
Match.parse({ xyz: "[BLANK]" }).test({ xyz: null })    // true
Match.parse({ xyz: "![BLANK]" }).test({ xyz: "haha" }) // true

// 数组里找命中项
Match.parse({ matchMode: "findInArray", matchBy: { type: "W" } })
  .test([{ type: "X", age: 24 }, { type: "W", age: 26 }])   // true
```

## 注意事项

- **宽松相等**：`by_strict_eq` 用 `src == input`（非 `===`），字符串 `"5"` 与数字 `5` 视为相等。
- **通配符只替换第一个 `*`**：`by_wildcard` 内部 `wildcard.replace("*", ".*")` 只替换首个
  星号，`"a*b*c"` 不会变成完全的多星通配，需要多段通配请改用 `^...$` 正则写法。
- **`$Null` 实现疑点**：`ti-match.ts` 的 `gen_map` 中，`$Null` 分支错误地读取了
  `src['$Nil']` 作为键名，即 `{ $Null: "x" }` 实际取的是 `$Nil` 对应的键；`$Null` 单独使用时
  键名为 `undefined`。当前无单元测试覆盖该分支，以源码现状为准，如要依赖请先核实。
- **`by_map_exists` 源码残留 `debugger;` 语句**，仅调试时影响，不影响判定结果。
- **映射匹配要求输入是普通对象或 `Map`**：`gen_by_map.test` 对非对象输入直接返回 `false`。
- **`parse` 与 `parse_strictly` 的空值口径不同**：`parse(null)` 返回恒等于 `dft` 的布尔匹配器
  （不校验输入）；`parse_strictly(null)` 返回空值匹配器（校验输入是否 `nil`）。
- **无单元测试覆盖**：`by_func` 函数匹配器、`by_wildcard` 通配符、`str(...)` 字符串区间、
  `$Nil/$Undefined/$Empty/$Type` 特殊键、`Match.notMatch`、`Match.createExplainI18n`
  当前无单元测试覆盖。
- **`ExplainI18n` 中 `equalsIgnoreCase / notNil / notNilOf` 等键**已在类型与
  `createExplainI18n` 中声明，当前版本未在任何匹配器文案中消费，保留备用。

## 延伸阅读

- **源码入口**
  - `src/core/match/ti-match.ts` —— `Match` 编译入口、`gen_map` 特殊键分派。
  - `src/core/match/by_str.ts` —— 字符串规则识别（空白/正则/区间/通配/相等）。
  - `src/core/match/by_map.ts` —— 逐键 AND 映射匹配、`[EXISTS]` 解析。
  - `src/core/match/by_array.ts` / `by_bool.ts` / `by_not.ts` / `by-func.ts` —— 组合与原子匹配器。
  - `src/core/match/by_blank.ts` / `by_empty.ts` / `by_nil.ts` / `by_null.ts` / `by_undefined.ts`
    / `by_num_range.ts` / `by_str_range.ts` / `by_regex.ts` / `by_wildcard.ts`
    / `by_strict_eq.ts` —— 各类具体匹配器。
  - `src/core/match/by_map_*.ts` —— `$Nil/$Null/$Undefined/$Empty/$Type/findInArray` 映射规则。
  - `src/core/match/key_display.ts` —— `explainText` 键名显示转换。
  - `src/test/core/match.test.ts` —— 已覆盖行为的单元测试。
- **相关文档**
  - [字典模型](../10.concepts/06-dict-model.md) —— `DictSetup.item/query` 如何消费 `TiMatch`。
  - [Num 数值工具](80-num.md) —— 区间解析底层 `NumRange`。
