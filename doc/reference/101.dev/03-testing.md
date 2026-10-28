---
title: Vitest 测试约定
keywords: [测试, vitest, test, core, setup.ts, 断言, yarn test]
status: draft
---

# Vitest 测试约定

TiJS 用 Vitest 跑单测。当前测试只覆盖 `src/core/` 工具层，**组件层（`src/lib/`）
目前没有单测**——这是现状，不是待补齐的承诺；给组件补测试前先与维护者确认方向，
不要默默新建 `src/test/lib/` 之类的目录。

## 目录与命名

```text
src/test/
├── setup.ts                 # 全局 setup，被 vite.config.ts 的 test.setupFiles 引用
└── core/
    ├── num.test.ts
    ├── text.str.test.ts
    ├── dict.simple.test.ts
    └── …                    # 一个模块一个 <模块>.test.ts
```

- 测试文件与被测模块同名，后缀 `.test.ts`，放在 `src/test/core/` 下。
- 文件名保留模块的点分层级，例如 `src/core/text` 的测试叫 `text.str.test.ts`，
  一眼能对上源码位置。

## setup.ts 做了什么

```ts
import { beforeAll } from "vitest";
import { installTiCoreI18n } from "../core";

beforeAll(() => {
  installTiCoreI18n("en-us");
});
```

全部测试启动前统一安装核心 i18n（当前固定英文）。被测函数若依赖 i18n 翻译结果，
用例预期要按 `en-us` 写。不要在单个测试文件里再重复安装。

## 现有用例的写法

从 `src/test/core/num.test.ts` 归纳出的固定形态：

```ts
import { expect, test } from 'vitest';
import { Num } from '../../core/';
import _ from 'lodash';

test('scrollIndex', () => {
  expect(Num.scrollIndex(3, 5)).eq(3);
  expect(Num.scrollIndex(5, 5)).eq(0);
  expect(Num.scrollIndex(-1, 5)).eq(4);
});
```

- **import 形态**：`expect, test` 从 `'vitest'` 引入；被测对象从 `'../../core/'`
  目录桶文件引入命名空间，不深链具体文件。
- **平铺结构**：现有用例一律 `test('用例名', …)` 平铺，没有用 `describe` 分组；
  新用例保持这个风格。
- **断言风格**：`expect(...).eq(...)`（chai 风格链式断言），一个行为一组相关断言，
  边界值（0、模、负数）尽量多列几条。
- 需要辅助数据时才引入 `lodash` 等，不预设依赖。

## 怎么跑

```bash
# 跑全部测试（等价于 package.json 的 scripts.test）
yarn test

# 只跑某个文件
yarn test src/test/core/num.test.ts

# 按用例名过滤
yarn test -t scrollIndex
```

`yarn test` 对应 `vitest --silent=false`：不压制输出，能看到每个用例的打印。
`setup.ts` 已在 `vite.config.ts` 的 `test.setupFiles` 里登记，无需手动指定。

## 延伸阅读

- **源码入口**：`src/test/setup.ts`、`src/test/core/num.test.ts`、`vite.config.ts`（`test.setupFiles` 段）、`package.json`（`scripts.test`）
- **相关文档**：[构建与发布](04-build-and-release.md)（`yarn build` 与 `yarn test` 在 CI 里的先后关系）、[仓库源码布局](01-source-layout.md)（core 工具层全貌）
