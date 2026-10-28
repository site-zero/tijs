---
title: Num 数值工具
keywords: [Num, 数值, 数学, gcd, lcm, 区间, scrollIndex, precise, round, floor, ceil, padTo, scopeToLimit, fillSteps]
status: draft
---

# `Num` 数值工具

## 职责

`Num` 是 `src/core/num/ti-num.ts` 导出的无 UI 依赖数值工具命名空间，汇总三类能力：
**数论计算（最大公约数 / 最小公倍数）**、**高精度取整与单位对齐**（避免 `0.1+0.2` 类浮点误差）、
**分页区间与循环索引换算**。组件库的数值区间解析（`[2,5)`）底层也复用它。

## 导出清单

### 数论

- **`gcd(a, b)`** —— 两数最大公约数（欧几里得算法；先 `Math.round` 取整）。
- **`gcds(...args)`** —— 一组数的最大公约数；空参数返回 `NaN`，单个数返回其自身；
  参数会被 `_.flatten` 拍平，支持传入数组。
- **`lcm(a, b)`** —— 两数最小公倍数 `a*b/gcd(a,b)`。
- **`lcms(...args)`** —— 一组数的最小公倍数；空参数返回 `NaN`，单个数返回其自身。

### 高精度取整

- **`precise(n, p=2)`** —— 保留 `p` 位小数：`p>0` 四舍五入到 `10^p`；`p=0` 取整；
  `p<0` 原样返回。
- **`round(n, precision=100)`** —— 按精度四舍五入；`precision=1` 等同 `Math.round`，
  `precision=0` 原样返回，其他值按 `Math.round(n*precision)/precision` 计算（如
  `precision=100` 保留两位）。
- **`floor(n, precision=100)`** / **`ceil(n, precision=100)`** —— 同精度口径的向下 / 向上取整。

### 单位对齐

- **`padTo(n, unit=1)`** —— 就近取整到 `unit` 的倍数（先除后四舍五入再乘回）。
- **`ceilUnit(v, unit=1)`** —— 向上对齐到 `unit` 的倍数。
- **`floorUnit(v, unit=1)`** —— 向下对齐到 `unit` 的倍数。

### 区间与序列

- **`scopeToLimit(scope, dft)`** —— 把 `"1-50"` / `"51:80"` / `"51,80"` 形式的区间串
  解析为 `{ limit, skip }`（连字符、冒号、下划线、逗号均可作分隔符）；非法且未给 `dft`
  时抛 `e-data-InvalidScope`，给了 `dft` 则返回 `dft`。
- **`fillSteps(source, startValue=0, { len?, step=1 })`** —— 用等差序列原地填充数组；
  `len` 缺省取 `source.length`；直接改传入的 `source` 并返回它。
- **`scrollIndex(index, len=0)`** —— 循环索引换算：`len<=0` 返回 `-1`；否则把任意整数
  （含负数）折算进 `[0, len)` 区间，如 `scrollIndex(6,5)=1`、`scrollIndex(-1,5)=4`。

## 典型用法

以下 `scrollIndex` 用例改写自 `src/test/core/num.test.ts`，可直接对照测试核对；
其余函数当前无单元测试覆盖，示例按源码行为描述。

```ts
import { Num } from "@site0/tijs";

// 循环索引（环形翻页 / 轮播位移的典型用法）
Num.scrollIndex(3, 5)    // 3
Num.scrollIndex(5, 5)   // 0
Num.scrollIndex(6, 5)   // 1
Num.scrollIndex(-1, 5)  // 4
Num.scrollIndex(-6, 5)  // 4
Num.scrollIndex(3, 0)    // -1（长度非法）

// 数论
Num.gcd(12, 18)          // 6
Num.gcds([12, 18, 24])   // 6
Num.lcm(4, 6)            // 12

// 高精度取整（规避浮点误差）
Num.precise(1.005, 2)    // 1.01 类口径；具体值按 Math.round(100.5)/100 计算
Num.round(1.005, 100)    // 按两位精度四舍五入

// 单位对齐
Num.ceilUnit(11, 5)      // 15
Num.floorUnit(11, 5)     // 10
Num.padTo(12, 5)         // 10

// 分页区间串转跳过/取条数
Num.scopeToLimit("1-50", { limit: 0, skip: 0 })    // { limit: 50, skip: 0 }
Num.scopeToLimit("51-80", { limit: 0, skip: 0 })   // { limit: 30, skip: 50 }
```

## 注意事项

- **`round/floor/ceil` 与全局 `Math` 同名**：它们是 `Num` 命名空间下的函数，多一个
  `precision` 参数，默认 `100`（两位精度），不是 `Math.round` 的同义别名；误用全局名会丢
  精度口径。
- **`gcd/lcm` 先四舍五入再运算**：传入小数时会先取整，`gcd(1.5, 2.5)` 等价于
  `gcd(2, 3)`，不会按精确小数计算。
- **`scopeToLimit` 要求左端点从 1 开始**：正则为 `^([1-9]\d*)[:,_-](\d+)$`，`"0-10"`
  不会命中；端点顺序颠倒（如 `"80-51"`）会自动按大小重排，`skip = min-1`。
- **`fillSteps` 是原地修改**：会改写传入的 `source` 数组，不要对共享数组直接调用。
- **测试覆盖现状**：当前 `src/test/core/num.test.ts` 只覆盖 `scrollIndex`；`gcd/gcds/lcm/
  lcms/precise/round/floor/ceil/padTo/ceilUnit/floorUnit/scopeToLimit/fillSteps`
  当前无单元测试覆盖。

## 延伸阅读

- **源码入口**
  - `src/core/num/ti-num.ts` —— `Num` 命名空间聚合导出。
  - `src/core/num/num-math.ts` —— `gcd/gcds/lcm/lcms`。
  - `src/core/num/num-util.ts` —— 取整、单位对齐、`scopeToLimit`、`fillSteps`、`scrollIndex`。
  - `src/test/core/num.test.ts` —— 当前仅覆盖 `scrollIndex`。
- **相关文档**
  - `20.core-utils/`（`Match` 篇）—— 数值区间 `[2,5)` 的判定底层消费 `NumRange`。
