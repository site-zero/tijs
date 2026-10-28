---
title: Tmpl 模板引擎
keywords: [Tmpl, 模板, 模板引擎, parse, exec, loop, if, else, end, 占位符, 过滤器, renderTmpl]
status: draft
---

# `Tmpl` 模板引擎

## 职责

`Tmpl` 是 `src/core/tmpl/ti-tmpl.ts` 导出的轻量模板引擎命名空间，负责把一段带占位符的模板字符串
**解析成一棵段树**，再按上下文变量渲染成字符串。它是 `Str.renderTmpl` 的底层实现：

```
Str.renderTmpl(tmpl, vars)  ──委托──▶  Tmpl.exec(tmpl, vars)
```

与完整前端模板不同，`Tmpl` 只做**文本渲染**：变量插值、类型转换 / 字符串过滤器、条件分支、循环，
不产生 DOM。组件配置里的动态文案（如列标题、空文本）大量复用它。

## 导出清单

### 对外入口

- **`parse(input, expert?)`** —— 把模板字符串编译为一棵 `WnTmplX` 段树；`expert` 可自定义分隔符表
  （缺省 `WnTmplTokenExpert('$$','${','{','}')`）。
- **`exec(tmpl, context?, showKey=true)`** —— 一步到位：`parse` + `render`；内部会 `_.cloneDeep`
  一份 `context` 再渲染。
- **`WnTmplX`（类）** —— 编译产物根节点；`render(context?, showKey=false): string` 渲染成串。

### 类型

- **`TmplSegment`** —— 段节点接口（`renderTo / isEnable / addChild / addElement / isBlock / isBranch
  / isCondition / isLoop …`）。
- **`TmplEle`** —— 元素接口（`join(sb, context, showKey?)`）。
- **`DynElInfo`** —— 动态元素的 `{ type, key, fmt, dft }` 描述。

### 内部实现入口（仅一句话职责，不展开）

- `tmpl-parsing.ts` `WnTmplParsing` —— 把 token 列表压栈组装成段树。
- `tmpl-token.ts` / `token-parse.ts` —— `WnTmplToken` 与 `parseTokens`，词法切分 `${…}`。
- `token-expert.ts` `WnTmplTokenExpert` —— 分隔符与转义符号表。
- `segment/` —— `abstract / block / branch / condition / loop` 五类段节点。
- `ele/` —— `raw` 静态文本、`dyn_*` 动态元素、`str/` 字符串过滤器。

## 模板语法

### 变量插值与转义

- **`${path}`** —— 按路径取上下文变量：`${a.b}`、`${a.b[1]}`、`${'a.b'}`（带引号的怪键）。
- **`${=expr}`** —— EL 表达式，如 `${=users.length}`。
- **`$${…}`** —— 转义：输出字面 `${…}`。
- **缺省值**：
  - `${a?B}` —— `a` 缺失时输出 `B`。
  - `${b?}` —— 缺失时输出空串。
  - `${b|a?-nil-}` —— `|` 连接 fallback 键链，命中第一个可用值。
  - `${pos.x?=pos.y}` —— 动态缺省：`pos.x` 缺失时回退取 `pos.y`。

### 类型转换与过滤器（`<…>`）

- **`<int:printf>`** —— `${n<int:%03d>}` → `"003"`，`${n<int:%03X>}` 十六进制。
- **`<float>`** —— `${n<float>}` → `"3.00"`（固定两位小数）。
- **`<date:fmt?>`** —— `${d<date>}`、`${d<date:yyyy-MM-dd>}`，复用 `DateTime` 格式化。
- **`<boolean:falseText/trueText>`** —— `${v<boolean:no/yes>}`：`true→"yes"`、`false→"no"`；
  只写一段无 `/` 时真假都取该段。
- **`<json:flag?>`** —— `${a<json>}`；`:c` 紧凑无空格、`:cq` 键加引号；`?` 后接缺省
  （`${a<json>?[]}` → `"[]"`，`${a<json>?-obj-}` → `"{}"`）。
- **`<string:upper>`** —— 大小写转换等。
- **`@` 管道过滤器**（分号串联）：
  - `${path<:@trim;@replace'/','-';@replace'~'>}` —— trim、replace。
  - `${addr<:@sub=start/end>}` —— 子串切片。
  - `${w<:@fs=7.2>}` —— 浮点按精度截断。
- **`(::k=v,…)` 映射** —— `${fruit(::A=Apple,B=Banana)}`：按当前值查表映射文案。
- **printf 风格** —— `${b<:%-4s>?}`。

### 控制块（全部包在 `${#…}` 内，以 `${#end}` 收尾）

- **循环** `${#loop item[,i=1] : list}…${#end}` —— `item` 为元素变量，`i` 为可选下标变量
  （`i=1` 表示从 1 计数）。
- **条件** `${#if path:'匹配式'}…${#else-if path:'匹配式'}…${#else}…${#end}` —— 匹配式复用
  `Match` 语法（如 `'[0,99]'` 半开区间）；前缀 `not` 取反。
- **循环与分支可任意嵌套**。

## 典型用法

以下示例改写自 `src/test/core/tmpl.test.ts` 与 `tmpl.token.test.ts`，可对照核对。

```ts
import { Tmpl } from "@site0/tijs";

// 1. 一步渲染
Tmpl.exec("a=${a}", { a: 100, b: 20 })          // "a=100"
Tmpl.exec("A${a.b}C", { a: { b: "B" } })        // "ABC"
Tmpl.exec("A${a?B}C")                           // "ABC"（缺省 B）

// 2. 转义
Tmpl.exec("A$${b}C", { b: "BB" })               // "A${b}C"

// 3. EL 表达式
Tmpl.exec("${=a.length}", { a: ["A", "B"] })    // "2"

// 4. 动态缺省与 fallback
Tmpl.exec("${a?=b}", { b: "B" })                // "B"
Tmpl.exec("${b|a?-nil-}", { a: "AAA" })         // "AAA"

// 5. 类型转换
Tmpl.exec("${n<int:%03d>}", { n: 3 })           // "003"
Tmpl.exec("${v<boolean:no/yes>}", { v: true })  // "yes"
Tmpl.exec("${a<json:c>}", { a: { x: 100 } })    // "{x:100}"
Tmpl.exec("${fruit(::A=Apple,C=Cherry)}", { fruit: "C" }) // "Cherry"

// 6. 条件分支
Tmpl.exec("${#if a:'[0,99]'}A=${a}${#else}B=${b}${#end}", { a: 80, b: 20 })
// "A=80"
Tmpl.exec("${#if not a:'[0,100]'}A=${a}${#else}B=${b}${#end}", { a: 100, b: 20 })
// "B=20"

// 7. 循环（含嵌套与下标）
Tmpl.exec(
  "${#loop pet,i=1 : pets}${i}.${pet.name};${#end}",
  { pets: [{ name: "xiaobai" }, { name: "xiaohei" }] }
)                                                // "1.xiaobai;2.xiaohei;"

// 8. 编译后复用：parse 一次，render 多次
let tmpl = Tmpl.parse("${pos.x?=pos.y}");
tmpl.render({ pos: { x: 100 } })                // "100"
tmpl.render({ pos: { y: 50 } })                // "50"
```

## 注意事项

- **`exec` 会深拷贝上下文**：`_.cloneDeep(context)` 后渲染，渲染过程中对上下文的改动不会泄漏到外部；
  但 `parse` 返回的 `WnTmplX` 可反复 `render` 复用，适合模板缓存。
- **`showKey` 语义**：`exec` 缺省 `true`，`WnTmplX.render` 缺省 `false`；控制缺省值渲染时是否
  回退显示原占位符 key，多数业务场景用 `exec` 的默认行为即可。
- **路径取值基于 `_.get` 语义**：`a-b`、`'a.b'`、`pos[0].'x.x'` 这类特殊键已有支持，但测试里标注了
  TODO——lodash 的 `_.get` 对更复杂的复合路径仍可能取不到，属于已知限制。
- **控制块必须成对闭合**：`#if / #loop` 缺 `#end` 会抛 `e.tmpl.EndWithoutBeginLoopOfIf`；
  `#else-if/#else` 缺 `#if` 会抛 `e.tmpl.ElseWithoutIf`。
- **匹配式语法与 `Match` 命名空间一致**：区间 `'[0,99]'`、`'[100,)'` 等，详见 [`Match`](./60-match.md)。

## 延伸阅读

- **源码入口**
  - `src/core/tmpl/ti-tmpl.ts` —— 对外 `parse` / `exec` / `WnTmplX` 与段 / 元素接口。
  - `src/core/tmpl/tmpl-parsing.ts`、`tmpl-token.ts`、`token-parse.ts`、`token-expert.ts` —— 词法与段树组装。
  - `src/core/tmpl/segment/`、`src/core/tmpl/ele/` —— 段节点与动态元素 / 字符串过滤器。
  - `src/test/core/tmpl.test.ts`、`tmpl.token.test.ts` —— 语法与 token 切分的单元测试。
- **相关文档**
  - [`Str` 字符串工具](./10-str.md) —— `Str.renderTmpl` 是对 `Tmpl.exec` 的委托，文案模板入口在这边。
  - [`Util` 工具集](./130-util.md) —— `Util.explainObj` 的 `->` 前缀会复用 `Tmpl.parse` 渲染模板。
