---
title: Str 字符串工具
keywords: [Str, 字符串, 工具, isBlank, toJsValue, partitions, toCase, join, sizeText, toPercent, 命名转换]
status: draft
---

# `Str` 字符串工具

## 职责

`Str` 是 `src/core/text/ti-str.ts` 导出的无 UI 依赖字符串工具命名空间，集中处理：
空白判断、拆分与拼接、命名风格转换、字符串到 JS 值的自动转换、分段显示与数字/字节的
展示格式化。组件内部大量复用它，业务代码也可以直接 `import { Str } from "@site0/tijs"` 使用。

## 导出清单

### 模板渲染

- **`renderTmpl(tmpl, vars)`** —— 委托 `Tmpl.exec` 渲染模板字符串。

### 空白判断

- **`isBlank(str)`** —— 是否为空白串（空格、换行、回车、tab 等）；数字、布尔不算空白。
- **`sBlank(str, dft)`** —— 空白时返回 `dft`，否则返回原串。

### 拆分与参数解析

- **`splitIgnoreBlank(input, sep?, trimLine?)`** —— 按分隔符拆分，丢弃空白项并逐项去空白。
- **`splitQuote(str, options?)`** —— 支持引号包裹的智能拆分；`quote`、`seps`、
  `escapeChar`、`keepQuote`、`ignoreBlank` 可配。
- **`toArray(s, { sep?, ignoreNil? })`** —— 任意输入转数组；字符串按正则拆分并去空白。
- **`toArrayBy(s, sep?)`** —— 按单分隔符拆分，丢弃空白项，默认逗号。
- **`joinArgs(s, args?, iteratee?)`** —— 逗号分隔串或数组转参数数组，逐项走 `toJsValue`。

### 分段显示

- **`partitions(input, options?)`** —— 按宽度分段插入分隔符；`width` 默认 4，`sep` 默认
  `" - "`，`to: "left"` 从右向左分段（金额），`"right"` 从左向右（激活码）。

### 字符串到 JS 值

- **`toJsValue(v, options?)`** —— 把字符串自动推断为数字、布尔、对象、数组、Map、日期；
  开关见下文「注意事项」。

### 对象 / 选项列表解析

- **`toObject(s, { sep?, ignoreNil?, keys? })`** —— 把 `"value:text:icon"` 形式解析成对象，
  `keys` 支持 `text?value` 后备字段写法。
- **`toObjList(s, options?)`** —— 逐行解析为对象列表，规则同 `toObject`。

### 任意值转字符串

- **`anyToStr(input)`** —— `nil` 返回空串；数组逗号拼接；错误取 `name: message`；
  对象 `JSON.stringify`；其余转字符串。
- **`anyToStrOrNum(val)`** —— 数字原样返回，其余走 `anyToStr`。
- **`safeDeep(data, regex?)`** —— 递归清除字符串中的危险字符（默认去除单双引号）。

### 拼接

- **`joinWithoutNil(sep, ...args)`** —— 拍平后丢弃 `null/undefined` 再拼接。
- **`join(list, sep, iteratee?)`** —— 拍平后可逐项映射再拼接。
- **`joinAs(list, sep, key?)`** —— 取对象指定字段拼接；字段缺失留空位。

### 命名风格转换

- **`toCase(str, mode?)`** —— 按 `StrCaseMode` 转换；`mode` 为空原样返回。
- **`getCaseFunc(mode)`** —— 取对应转换函数。
- **`toComType(comType)`** —— 归一化为 kebab-case 类型名。
- **`toStdComType(comType)`** —— 归一化为首字母大写的驼峰名。

`toCase` 支持的模式：

| mode | 含义 |
| --- | --- |
| `lowerAll` | 全小写 |
| `upperAll` | 全大写 |
| `upperFirst` | 首字母大写 |
| `upper` | 大写下划线风格 |
| `lower` | 小写下划线风格 |
| `camel` | 驼峰 |
| `snake` | 下划线 |
| `kebab` | 短横线 |
| `start` | 每个单词首字母大写 |
| `raw` | 保持原样 |

### 数字与字节展示

- **`intToChineseNumber(input, capitalized?)`** —— 转中文数字；`capitalized=true` 输出
  大写金额数字（零壹贰叁……）。
- **`sizeText(byte, options?)`** —— 字节数格式化为 `Bytes/KB/MB/GB/…`；`fixed` 控制小数位，
  `bytes=true` 追加原始字节数。
- **`toPercent(n, { fixed?, auto? })`** —— 浮点转百分比；`auto=true` 去掉末尾多余的零。
- **`substrbytes(str, maxByte)`** —— 按 UTF-8 字节长度截断字符串。

### 可打印字符判定

- **`isPrintableCompat(c)`** —— 兼容判定：非控制字符即可打印（支持中文、emoji）。
- **`isPrintableAscii(c)`** —— 严格 ASCII 可打印字符判定。
- **`isPrintableAsciiExt(c)`** —— ASCII 加扩展字符集判定。

### Base64 解码

- **`base64ToU8Bytes(str)`** —— 解码为 `Uint8Array`。

## 典型用法

以下示例改写自 `src/test/core/text.str.test.ts`，可直接对照测试核对。

```ts
import { Str } from "@site0/tijs";

// 空白判断
Str.isBlank(" \n ")        // true
Str.sBlank("   ", "NA")    // "NA"

// 引号感知拆分
Str.splitQuote(`'A,B',C,"'D;E'",F`)
// ["'A,B'", "C", "\"'D;E'\"", "F"]

// 分段显示（金额从右向左，宽度 3）
Str.partitions("12345678", { to: "left", width: 3 })
// "12 - 345 - 678"

// 字符串自动推断 JS 值
Str.toJsValue("123")                       // 123
Str.toJsValue("true")                      // true
Str.toJsValue("'true'")                   // "true"
Str.toJsValue("{x:100,y:99}")            // { x: 100, y: 99 }

// 命名风格
Str.toCase("Nb A", "camel")                // "nbA"
Str.toCase("a b c", "kebab")               // "a-b-c"
Str.toComType("camel-snake_kbab")          // "camel-snake-kbab"

// 中文数字
Str.intToChineseNumber(98465)               // "九万八千四百六十五"
Str.intToChineseNumber(98465, true)         // "玖万捌仟肆佰陆拾伍"

// 展示格式化
Str.sizeText(1024)                          // "1KB"
Str.sizeText(6764544)                       // "6.45MB"
Str.toPercent(0.673)                        // "67.3%"

// 字段拼接
Str.joinAs([{ name: "ming" }, { name: "qing" }], ",", "name")
// "ming,qing"
```

## 注意事项

- **`toJsValue` 开关**：`autoNum / autoBool / autoJson / autoMap / autoDate / autoNil /
  autoVar / autoDefault / trimed / context`，缺省 `autoNum/autoBool/autoJson/autoMap`
  开启，`autoDate/autoNil/autoVar/autoDefault` 关闭。
- **`toJsValue` 不会解析 `=` 开头的动态字典片段**（如 `xxx(=petId)`），避免被误当 JSON。
- **`partitions(null/undefined/""` 返回空串**；非空输入先转字符串再分段。
- **`splitQuote` 的 `keepQuote` 缺省 `true`**：保留引号；`ignoreBlank` 缺省 `false`，
  空段也会保留。
- **`sizeText` 的单位顺序固定**为 `Bytes → KB → MB → GB → PB → TB`，可通过 `units`
  选项替换。

## 延伸阅读

- **源码入口**
  - `src/core/text/ti-str.ts` —— `Str` 全部实现。
  - `src/test/core/text.str.test.ts` —— 覆盖各函数行为的单元测试。
- **相关文档**
  - 模板渲染底层：[Tmpl 模板引擎](120-tmpl.md)。
  - 日期解析开关：[DateTime 日期时间](110-datetime.md)。
