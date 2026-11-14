---
title: Alg 算法工具
keywords: [Alg, 算法, base26, 指纹, md5, sha1, sha256, 雪花ID, CharStack, 权限码, parseObjMode]
status: draft
---

# `Alg` 算法工具

## 职责

`Alg` 是 `src/core/alg/ti-alg.ts` 聚合导出的无 UI 依赖通用算法工具命名空间，把分散在多个
小文件里、互不相关的纯算法函数收进一个出口：26 进制与十进制互转、浏览器标签页指纹、UNIX
风格权限码解析、摘要哈希、短 ID 生成、以及一套用于字符串/对象解析的界定字符堆栈。组件内部
与业务代码都可以直接 `import { Alg } from "@site0/tijs"` 使用。

它只提供「输入进、结果出」的纯函数与一个解析用类，不负责状态管理、UI 渲染；需要对象/字典
建模能力请看 `Dicts`，需要模板字符串渲染请看 `Tmpl`。

## 导出清单

### 进制互转（Excel 列号风格）

- **`toBase26(n)`** —— 非负十进制整数转 26 进制字母串（`A`=0 … `Z`=25、`AA`=26），
  对齐 Excel 列号编号；先取绝对值再四舍五入。
- **`fromBase26(base26)`** —— 26 进制字母串转回十进制；去空白、转大写后逐位计算，
  含非 `A-Z` 字符时抛错 `Invalid base26 number`。

### 浏览器指纹

- **`getBrowserTabFingerprint()`** —— 生成「刷新不变、同浏览器不同标签页不同」的标签页指纹；
  首次生成后写入 `sessionStorage`（键 `tab_fingerprint`），再次调用直接读回。

### 权限码解析

- **`parseObjMode(md)`** —— 把 UNIX 风格权限码在三种输入形态间互转，返回 `ObjModeInfo`：
  `488`（十进制数）、`"777"`（八进制数字串）、`"rwxr-xr-x"` / `"rwx"`（文本）；
  返回 `{ val, oct, mod, owner, group, other }`。

### 摘要哈希

- **`md5(str)`** —— MD5 摘要，hex 串；非字符串输入先 `JSON.stringify`。
- **`sha1(str)`** —— SHA1 摘要，hex 串。
- **`sha256(str)`** —— SHA256 摘要，hex 串。

### 短 ID / 雪花串

- **`genSnowQ(n = 4, prefix?)`** —— 拼 `[prefix,]` + 当前毫秒时间戳的 36 进制串 +
  `n` 位随机 36 进制串。
- **`genSnowQD(n = 4, prefix?)`** —— 同上，但时间部分用格式化日期串
  `yyMMddHHmmssSSS`（可读、按时间有序）代替毫秒时间戳。

### 界定字符堆栈（字符串/模板解析）

- **`class CharStack`** —— 维护一对「压栈符 / 退栈符」的嵌套解析堆栈，支持转义字符；
  典型用于从一段文本里提取被引号或括号包住的片段。
  - **`constructor(cPush, cPop?, cEscaper = '\\', escTable = STR_UNESC_TAB)`** ——
    `cPush` 可填多个候选压栈符（如 `"'`），`cPop` 缺省时与压栈符成对配平。
  - **`push(c)`** —— 逐字符喂入，返回 `WnStackPushResult`。
  - **`process(input)`** —— 一次性喂入整串，解析完成返回结果串并复位，否则 `undefined`。
  - **`processAsArray(input)`** —— 反复解析，返回全部已完成片段数组。
  - **`getContentAndReset()`** —— 手动取当前内容并复位堆栈。
- **`enum WnStackPushResult`** —— `REJECT`（休眠态拒收非压栈符）/ `ACCEPT`（已接收，
  可继续）/ `DONE`（最外层已闭合，可取结果）。

> 同目录的 `escape-table.ts`（`EscapeTable`、`buildEscapeTable`、`buildEscapeReverTable`、
> `STR_UNESC_TAB`、`STR_ESC_TAB`）与 `linked-stack.ts`（`LinkedStack`）**未通过 `ti-alg.ts`
> 对外导出**：前者仅供 `CharStack` 内部使用，后者被 `Tmpl` 解析器直接引用，不在 `Alg`
> 命名空间下消费。

## 典型用法

`toBase26` / `fromBase26` 与 `CharStack` 的示例改写自 `src/test/core/alg.base26.test.ts`、
`alg.char-stack.test.ts`，可直接对照测试核对。

```ts
import { Alg } from "@site0/tijs";

// 26 进制与十进制互转（Excel 列号风格）
Alg.fromBase26("A")    // 0
Alg.fromBase26("Z")    // 25
Alg.fromBase26("AA")   // 26
Alg.fromBase26("ZZ")   // 701
Alg.toBase26(737)      // "ABJ"

// 权限码互转
Alg.parseObjMode("rwxr-xr-x").oct   // "755"
Alg.parseObjMode("777").mod          // "rwxrwxrwx"
Alg.parseObjMode(0o755).owner       // "rwx"

// 摘要哈希（非字符串会先 JSON.stringify）
Alg.md5("hello")       // 32 位 hex 串
Alg.sha256({ a: 1 })   // 对 JSON 文本求 SHA256

// 短 ID
Alg.genSnowQ()               // 形如 "lx4ab9" 的前缀 + 时间戳 + 随机串
Alg.genSnowQD(4, "order_")   // "order_" + yyMMddHHmmssSSS + 随机串

// CharStack：提取 { } 包裹的片段
let cs = new Alg.CharStack("{", "}");
cs.process("A {{x:100}} B")      // "{x:100}"
cs.processAsArray("{{x:100}} {<abc>}")  // ["{x:100}", "<abc>"]

// CharStack：引号嵌套与转义（压栈符为候选集 " 与 '）
let qs = new Alg.CharStack("\"'");
qs.process('"ab\\nc"')            // "ab\nc"（转义符 \n 还原为换行）
qs.process('\'"ab\\nc"\'')       // '"ab\nc"'
```

## 注意事项

- **`fromBase26` 大小写敏感于字母集**：内部会 `toUpperCase()`，但含任何非 `A-Z` 字符
  （空格外的符号、数字）会直接抛错字符串，不是返回 `NaN`。
- **`toBase26` 先归一化**：`Math.abs(Math.round(n))`，负数会被取绝对值、小数会被四舍五入。
- **`parseObjMode` 的字符串分支是有优先级的**：纯数字串按八进制解析（`"777"` 不是十进制 777，
  而是八进制 777）；9 位 `rwx-` 串与 1~3 位 `rwx-` 串规则不同，3 位会扩展成
  `xxx + xxx + xxx`；都不匹配时返回全零权限 `000 / ---------`，不抛错。
- **`getBrowserTabFingerprint` 依赖浏览器 API**：读写 `sessionStorage` / `localStorage`、
  读 `navigator`、`screen`、`performance`、`Intl`，不能在纯 Node 环境直接调用；
  持久化部分写入 `localStorage`（键 `browser_fingerprint`）。
- **`CharStack` 三态机**：休眠态 `S0` 只收压栈符，其余字符被忽略；激活态 `S1` 正常累积；
  最外层闭合后进入完成态 `S9`，后续字符一律返回 `DONE` 且不再解析，必须
  `getContentAndReset()`（或 `process` 内部已自动复位）后才接受新片段。
- **转义失败会抛错**：激活态遇到转义符 `\` 后，下一字符若不在转义表内，抛
  `e.char.stack.InvalidEscapeChar`。
- **当前无单元测试覆盖**：`getBrowserTabFingerprint`、`parseObjMode`、`md5/sha1/sha256`、
  `genSnowQ/genSnowQD` 在 `src/test/core/` 下没有对应测试；上述边界行为均直接核对源码得出。

## 延伸阅读

- **源码入口**
  - `src/core/alg/ti-alg.ts` —— `Alg` 命名空间聚合出口（转出口 6 个子模块）。
  - `src/core/alg/alg-base26.ts` —— `toBase26` / `fromBase26`。
  - `src/core/alg/alg-fingerprint.ts` —— 浏览器标签页指纹。
  - `src/core/alg/alg-obj-mod.ts` —— `parseObjMode`。
  - `src/core/alg/alg-sign.ts` —— `md5` / `sha1` / `sha256`。
  - `src/core/alg/alg-snow.ts` —— `genSnowQ` / `genSnowQD`。
  - `src/core/alg/char-stack.ts` —— `CharStack` 与 `WnStackPushResult`。
  - `src/core/alg/escape-table.ts`、`src/core/alg/linked-stack.ts` —— 内部实现，未对外导出。
  - `src/test/core/alg.base26.test.ts`、`src/test/core/alg.char-stack.test.ts` —— 现有单测。
- **相关文档**
  - 字典注册表与工厂：[30-dicts](30-dicts.md)。
  - 模板字符串渲染（`LinkedStack` 的实际消费方）：[Tmpl 模板引擎](120-tmpl.md)。
