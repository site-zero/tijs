---
title: 新增一个组件
keywords: [新增组件, 开发流程, TiComInfo, Props, Emitter, 注册表, exampleProps]
status: draft
---

# 新增一个组件

在 TiJS 里加一个组件，本质是**按固定组成建一个目录、写一份 `TiComInfo`、在类注册表里
登记一行**。没有脚手架脚本，全部参照现有组件照抄结构即可。下面以新增一个虚构的
`TiXxx`（INPUT 类，目录 `src/lib/input/xxx/`）为例，每一步给出真实源码参照。

## 第 1 步：确定 race 分类与类型字符串

先回答「这个组件产出什么数据、在页面上扮演什么角色」，落进六个分类之一
（划分依据见 [组件手册](../30.components/README.md)），然后在
`src/lib/lib-com-types.ts` 的 `COM_TYPES` 里登记类型字符串：

```ts
// src/lib/lib-com-types.ts
export const COM_TYPES = {
  //------------------- INPUT
  Xxx: "TiXxx",
};
```

`TiComRace` 枚举本身在 `src/_type/`，不要修改；分类选错会导致后续 `all-*.ts` 挂错类。

## 第 2 步：建组件目录与固定文件

在 `src/lib/input/xxx/` 下建最低集合（参照 `src/lib/action/button/` 的最简形态）：

```text
src/lib/input/xxx/
├── ti-xxx-index.ts     # TiComInfo
├── ti-xxx-types.ts     # Props / Emitter / Api
└── TiXxx.vue           # 视图
```

需要演示配置就加 `example/`，内部逻辑复杂就加 `ti-xxx-api.ts` 与 `support/`，
局部文案内联在 index 的 `i18n` 字段，不必先建 `i18n/`、`style/` 空目录。

## 第 3 步：写类型（ti-xxx-types.ts）

参照 `src/lib/input/text/ti-input-text-types.ts`：

```ts
import { CommonProps, ReadonlyProps, PlaceholderProps, Vars } from "@site0/tijs";

export type XxxEmitter = {
  (eventName: "change", payload: any): void;
};

export type XxxProps = CommonProps &
  ReadonlyProps &
  PlaceholderProps & {
    value?: any;
    // 组件自有 Props 写在这里；共享横切能力一律交叉引入，不要重写
  };
```

有内部计算就导出 `export type XxxApi = ReturnType<typeof useXxxApi>`
（参照 text 的 `useInputTextApi`），没有就不写。

## 第 4 步：写 TiComInfo（ti-xxx-index.ts）

参照 `src/lib/input/text/ti-input-text-index.ts` 与 `src/lib/action/button/ti-button-index.ts`：

```ts
import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiXxx from './TiXxx.vue';

const en_us = { 'com-name': 'Xxx' };
const zh_cn = { 'com-name': '某某控件' };

const COM_TYPE = COM_TYPES.Xxx;

const TiXxxInfo: TiComInfo = {
  icon: 'fas-xxx',
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: 'i18n:ti-xxx-com-name',
  i18n: { en_us, en_uk: en_us, zh_cn, zh_hk: zh_cn },
  com: TiXxx,
  install: (app: App) => {
    app.component(COM_TYPE, TiXxx);
  },
  defaultProps: 'simple',
  exampleProps: [
    {
      name: 'simple',
      text: 'i18n:simple',
      comConf: {} as XxxProps,
    },
  ],
};

export * from './ti-xxx-types';
export { TiXxx, TiXxxInfo };
```

- `exampleProps` 简单时可像 `TiButton` 一样内联；复杂时抽到 `example/ex-*.ts`
  （参照 `src/lib/input/text/example/ex-input-text-simple.ts`，默认导出
  `ComPropExample`），再在 index 里 `import example from './example'`。
- `liveStyle` 只在需要设计器实时预览尺寸时才加。

## 第 5 步：视图接线（TiXxx.vue）

在 `<script setup>` 里消费 `XxxProps`、按 `XxxEmitter` 声明 `emits` 并 `emit`。
只读、占位、显隐等横切行为不要自己判断，用 `src/lib/_features/` 下已有的 hook；
拿不准有没有现成 hook，先扫一遍 `_features/` 再动手。

## 第 6 步：在类注册表里登记

打开对应类的 `all-*.ts`（INPUT 类是 `src/lib/input/all-input.ts`），加两处：

```ts
import { TiXxxInfo } from "./xxx/ti-xxx-index";

export default {
  // …
  TiXxx: TiXxxInfo,   // 加进默认 TiComSet 映射
} as TiComSet;

export * from "./xxx/ti-xxx-index";   // 命名导出整组件
```

`src/lib/index.ts` 已经 `export * from "./input/all-input"`，**不需要再改 lib/index.ts**。

## 第 7 步：自检与补文档

1. `yarn build` 跑过 `vue-tsc` 类型检查（见 [构建与发布](04-build-and-release.md)）。
2. 若组件参与演示注册表，确认 `exampleProps` 里的 `comConf` 真能渲染，不要写跑不通的伪配置。
3. 按 [文档与弃用规则](05-doc-and-deprecation.md) 同步文档三处；新组件属于正常收录，
   在 `30/components/` 对应类下补组件篇。

## 延伸阅读

- **源码入口**：`src/lib/lib-com-types.ts`、`src/lib/input/text/ti-input-text-index.ts`、`src/lib/input/text/ti-input-text-types.ts`、`src/lib/input/all-input.ts`、`src/lib/action/button/ti-button-index.ts`
- **相关文档**：[仓库源码布局](01-source-layout.md)（固定组成详解）、[组件手册](../30.components/README.md)（六类划分依据）、[核心概念 · 共享 Props](../10.concepts/02-common-props.md)
