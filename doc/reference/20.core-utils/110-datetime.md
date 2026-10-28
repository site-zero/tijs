---
title: DateTime 日期时间
keywords: [DateTime, 日期, 时间, 解析, 格式化, 时区, parse, format, quickParse, timeText, TiTime]
status: draft
---

# `DateTime` 日期时间

## 职责

`DateTime` 是 `src/core/time/datetime.ts` 导出的日期时间工具命名空间，集中处理：任意输入到
`Date` 的解析、按占位符模板格式化、时间轴加减与月份推算、时区偏移换算，以及相对时间文案
（“刚刚 / 5 分钟前”）。它不依赖第三方日期库，时区与占位符语义以本篇源码实现为准，不是
moment/dayjs 的方言。

与它配套的**纯时间分量**（`TiTime` 类、`isTimeInfo`、`toTimeInfo`、`setTimeToDate`）由
`src/core/time/time-info.ts` 平铺导出，不在 `DateTime` 命名空间内，本篇末尾单独说明。

## 导出清单

### 解析

- **`parse(d, options?)`** —— 把任意输入转成 `Date`，无法解析时打印 `console.trace` 并返回
  `undefined`。`options: { timezone?, overrideTimezone? }`。支持的输入见下文「注意事项」。
- **`quickParse(input, options?)`** —— 面向“纯数字简写”的快速解析，失败回退 `parse`。
  `options.mode` 为 `"ymd" | "dmy" | "mdy"`，默认 `"dmy"`；`options.timezone` 附加时区后缀。
- **`isDateTimeQuickParseMode(input)`** —— 判断输入是否为合法的 `quickParse` 模式名。
- **`parseTime(input, unit?, tz?)`** —— 把时间串（如 `"08:21"`、`"082114"`）解析为 `TiTime`。

### 格式化

- **`format(date, options?)`** —— 按占位符模板输出字符串。`options: { fmt?, as?, trimZero?, timezone? }`。
- **`formats(list, options?)`** —— 对日期数组逐项 `format`，返回字符串数组。
- **`genFormatContext(date, timezone?)`** —— 生成格式化上下文变量对象（`yyyy/MM/dd/HH/mm/...`），
  供自定义渲染复用；解析失败返回 `{}`。
- **`timeText(d, { justNow?, i18n? })`** —— 相对时间文案：`justNow` 分钟内视为“刚刚”，
  之后按分 / 时 / 天 / 周 / 年内 / 任意年分档输出；文案可经 `i18n` 覆盖。

### 时区

- **`getDefaultTimezoneOffset(dftAsLocal=true)`** —— 读环境变量 `TIMEZONE`（`GMT±N`/`UTC±N`），
  未设置时按 `dftAsLocal` 返回本地时区偏移（小时）或 `undefined`。
- **`getDefaultTimezoneProp(comType, timezone?, propKey?, dftValue?)`** —— 组件级时区 prop 取默认值：
  优先入参，其次组件默认 prop（`tiGetDefaultComPropValue`），最后回退本地时区 / `"Z"`。

### 时间设置与推算

- **`setTime(d, time?, tz?)`** —— 把 `Date` 的时分秒毫秒设为指定值，**原地修改**并返回 `d`；
  `time` 缺省归零（当天 `00:00:00.000`）。
- **`setDayLastTime(d, tz?)`** —— 原地设为当天 `23:59:59.999`。
- **`today(tz?)` / `todayInMs(tz?)`** —— 今天零点的 `Date` / 其毫秒时间戳。
- **`moveYear(d, offset=0)` / `moveMonth(d, offset=0)` / `moveDate(d, offset=0)`** —— 原地
  加减年 / 月 / 日，返回 `d`。
- **`moveToLastDateOfMonth(d)`** —— 原地移到当月最后一天。
- **`createDate(d, offset=0)`** —— 复制 `d` 后按天偏移（不修改原对象）。
- **`countMonthDay(d)`** —— 本月有多少天。
- **`isSameDate(d1, d2)`** —— 同年同月同日才为 `true`；任一为空返回 `false`。
- **`isInMonth(d1, d2)`** —— 同年同月即为 `true`。

### 星期

- **`getWeekDayAbbr(day)`** —— 下标 `0-6` → `"sun"..."sat"`，越界 clamp 到边界。
- **`getWeekDayName(day)`** —— 下标 `0-6` → `"sunday"..."saturday"`。
- **`getWeekDayValue(name, dft=-1)`** —— 星期缩写 / 全名反查下标；非法返回 `dft`。

### 占位符（`format` 的 `fmt`）

`fmt` 按正则 `y{2,4} | Mmm | M{1,4} | dd? | HH? | mm? | ss? | S{1,3} | E{1,4} | '字面量'`
替换。注意：**月份是 `M/MM/MMM/MMMM`，分钟是 `m/mm`，二者不同字母段**。

| 占位符 | 含义 | 示例 |
| --- | --- | --- |
| `yyyy` / `yy` | 年 / 两位年 | `2023` / `23` |
| `M` / `MM` | 月（不补零 / 补零） | `7` / `07` |
| `MMM` / `Mmm` / `MMMM` | 月缩写大写 / 缩写 / 全称 | `JUL` / `Jul` / `July` |
| `d` / `dd` | 日（不补零 / 补零） | `3` / `03` |
| `H` / `HH` | 时（不补零 / 补零） | `8` / `08` |
| `m` / `mm` | 分 | `6` / `06` |
| `s` / `ss` | 秒 | `2` / `02` |
| `S` / `SS` / `SSS` | 毫秒（补零到 3 位） | `13` / `013` / `013` |
| `E` / `EE` / `EEE` | 星期缩写（同值） | `Mon` |
| `EEEE` | 星期全称 | `Monday` |
| `'...'` | 单引号包裹字面量 | 原样输出 |

`timezone` 取值：`"Z"`（UTC）、`"auto"`（读环境变量）、数字小时偏移（如 `8` = GMT+8）；
缺省走浏览器本地时区。

## 典型用法

以下示例改写自 `src/test/core/data.datetime.test.ts`，可对照测试核对。

```ts
import { DateTime } from "@site0/tijs";

// 解析
DateTime.parse("now")                          // 当前时刻
DateTime.parse("today")                         // 今天 00:00:00
DateTime.parse(1696321830000)                  // 数字=毫秒时间戳
DateTime.parse("2023-06-01 08:00:01.126+8")
DateTime.parse("20210612+8")                    // yyyyMMdd 简写
DateTime.parse(undefined)                       // undefined（不抛错）

// 简写快速解析（默认 dmy：日月年）
DateTime.quickParse("0108")                     // 当年-08-01
DateTime.quickParse("2408", { mode: "ymd" })    // 2024-08-01
DateTime.quickParse("1705 110235")              // 当年-05-17 11:02:35

// 格式化（timezone:8 表示按 GMT+8 展示）
let d = DateTime.parse("2023-09-21 00:00:00+8")!
DateTime.format(d, { timezone: 8 })             // "2023-09-21 00:00:00"
DateTime.format(d, { fmt: "yyyy/MM/dd", timezone: 8 })  // "2023/09/21"
DateTime.format(d, { fmt: "yyyy-MM-dd" })       // 缺省 fmt 走环境变量默认模板

// 时区换算：同一时刻按不同时区展示
DateTime.format(new Date("2025-12-05 02:00+8"), { fmt: "yyyy-MM-dd HH:mm", timezone: "Z" })
// "2025-12-04 18:00"

// 时间设置（原地修改）
DateTime.setTime(d, { hours: 1, minutes: 2, seconds: 3 })   // 设为 01:02:03
DateTime.setDayLastTime(d)                      // 当天 23:59:59
DateTime.today()                                // 今天零点

// 月份推算
DateTime.countMonthDay(DateTime.parse("2023-02-28")!)   // 28（平年 2 月）
DateTime.countMonthDay(DateTime.parse("2000-02-28")!)   // 29（闰年）
DateTime.moveToLastDateOfMonth(DateTime.parse("2023-02-26+8")!)  // 2023-02-28

// 相对时间文案（测试环境以 en-us 核心包为默认）
DateTime.timeText(new Date())                   // "Just now"
DateTime.timeText(new Date(Date.now() - 30*60*1000))  // "In 30 Mins"

// 星期
DateTime.getWeekDayAbbr(0)                      // "sun"
DateTime.getWeekDayValue("monday")              // 1
```

## 注意事项

- **`parse` 解析失败不抛错**：对非法输入打印 `console.trace` 后返回 `undefined`；`nil/空白串/空数组`
  也返回 `undefined`，调用方需自行判空。注释里写的“抛错”与实现不符，以实现为准。
- **`parse` 的字符串容忍分隔符**：年月日之间的非数字字符都接受（`-` `/` `\` 甚至无分隔），
  但要求四位年、月日为数字；`yyyyMMdd` 与 `yyyy-MM-dd HH:mm:ss[.ms][Z|±HH[:mm]]` 两类主格式。
- **`format` 的字符串入参默认按 UTC 补 `Z`**：不带时区后缀的字符串先 `new Date(str + "Z")`，
  带后缀（`Z` 或 `±HH[:mm]`）才直接 `new Date(str)`；无法识别返回 `"!!!"`。
- **`move*` 系列原地修改**：`moveYear/moveMonth/moveDate/moveToLastDateOfMonth/setTime` 都改传入的
  `Date` 对象；需要保留原对象请用 `createDate` 或自行 `new Date(d)`。
- **`quickParse` 只吃纯数字日期段**：日期段一旦含非数字字符就直接回退 `parse`；两位年按当前世纪
  补齐（`Math.floor(当前年/100)*100`）。
- **`timeText` 依赖 `installTiCoreI18n` 装过文案**：未装语言包时用代码内英文兜底（`Just now` 等）。
- **平铺导出的 `TiTime` 不在 `DateTime.` 命名空间下**：`import { TiTime, isTimeInfo } from "@site0/tijs"`
  直接用，不能写成 `DateTime.TiTime`。`TiTime.toString(fmt)` 支持 `"auto"`（按精度自适应
  `HH:mm`/`HH:mm:ss`/`HH:mm:ss.SSS`）与 `"min"`（不足一小时省略时位），占位符为
  `a/HH?/kk?/KK?/hh?/mm?/ss?/SSS`。

## 延伸阅读

- **源码入口**
  - `src/core/time/datetime.ts` —— `DateTime` 命名空间全部函数。
  - `src/core/time/time-info.ts` —— `TiTime` 类与 `setTimeToDate` / `isTimeInfo` / `toTimeInfo`（平铺导出）。
  - `src/core/time/index.ts` —— time 目录汇总出口。
  - `src/test/core/data.datetime.test.ts` —— 解析 / 格式化 / 时区 / 星期 / 时间设置的单元测试。
- **相关文档**
  - [`Str` 字符串工具](./10-str.md) —— `Str.toJsValue` 解析日期开关与 `DateTime` 解析互为补充。
  - [`I18n` 国际化](./100-i18n.md) —— `format` 的月 / 星期名与 `timeText` 文案走 `I18n.get` 取词。
