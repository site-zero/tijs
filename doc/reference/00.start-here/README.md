---
title: 入门
keywords: [入门, 快速开始, getting started, 安装, 第一个组件, TiJS, 新手指南]
status: draft
---

# 入门

TiJS（`@site0/tijs`）是 site-zero 体系下的一套 Vue 3 前端基础库，由两层组成：
**`core` 工具层**是与 UI 无关的纯 TypeScript 工具（字符串、国际化、日期时间、字典、
网络、数值等命名空间）；**`lib` 组件层**是 6 大类共 72 个可用的 Vue 3 组件
（另有 3 个已标记弃用、不收录进文档），外加一套 composable 特性层与标准表单字段 /
表格列。一句话：工具层给你函数，组件层给你开箱即用、样式行为统一的界面控件。

下面的步骤默认你已经会 Vue 3 的基础（`createApp`、模板、`props`）；本分区帮你把库
装进来、引导好、跑出第一个组件，然后知道接下来该读哪里。

## 本分区阅读顺序

1. [快速上手](01-getting-started.md) —— 从安装到模板里跑出第一个 `TiLabel`，
   含 `main.ts` 引导五步与两行样式引入。
2. 读完后直接进入 [核心概念机制](../10.concepts/README.md) —— 注册表、共享 Props、
   i18n 分层、字典、样式变量体系都在那里一次讲清；本分区只点到为止。

## 之后去哪里

| 你想做的事 | 去哪里 |
| --- | --- |
| 理解组件如何被描述、注册、按类型名动态渲染 | [概念篇 · 组件模型](../10.concepts/01-component-model.md) |
| 查某个工具命名空间的 API（`Str`、`I18n`、`DateTime`、`Dicts`…） | [`20.core-utils/`](../20.core-utils/) |
| 查某个组件的 Props、事件与示例 | [`30.components/`](../30.components/)，清单见该目录 README |
| 复用只读、选项、校验等 composable 钩子 | [`40.features/`](../40.features/) |
| 在本仓库内新增组件、跑测试、构建发布 | [开发规范](../101.dev/README.md) |

## 延伸阅读

- **源码入口**：包入口 `src/index.ts`（类型入口见仓库根 `index.d.ts`）；
  组件注册表 `src/core/ti-coms.ts`。
- **相关文档**：仓库根 [`README.md`](../../../README.md) 的「在业务项目中使用」一节；
  演示工程 `ti-demo` 的 `src/main.ts`（本分区引导步骤的实测来源）。
