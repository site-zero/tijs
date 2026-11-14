---
title: 开发者参考手册
keywords: [开发规范, 源码布局, 新增组件, 测试, 构建发布, 文档同步, 弃用组件]
status: draft
---

# 开发者参考手册

本分区面向在本仓库（`@site0/tijs`）内提交代码的开发者。参考手册其余分区回答
「这个组件怎么用、这个机制为什么存在」，本分区回答另一类问题：**源码怎么组织、
新增一个组件要走哪几步、测试怎么写、构建发布跑什么命令、文档与源码如何保持同步**。

## 阅读顺序

后面的篇目按开发任务的自然顺序排列，建议顺读：

1. [仓库源码布局](01-source-layout.md) —— `src/` 各目录职责，以及单个组件目录的固定组成。
2. [新增一个组件](02-add-component.md) —— 从确定 race 分类、建目录写类型，到注册导出的完整步骤。
3. [测试约定](03-testing.md) —— Vitest 的目录、命名、写法与本地跑法。
4. [构建与发布](04-build-and-release.md) —— `yarn build` 三步各自做什么，产物与 `dist/` 的关系。
5. [文档与弃用规则](05-doc-and-deprecation.md) —— 三处文档同步、Props 回读核对、deprecated 组件处理。

## 延伸阅读

- **源码入口**：`src/index.ts`、`src/lib/index.ts`、`src/lib/lib-com-types.ts`、`vite.config.ts`、`package.json`
- **相关文档**：[核心概念机制](../10.concepts/README.md)（组件模型、共享 Props、i18n 的设计动机）、[组件手册](../30.components/README.md)（六类划分与组件索引）、写作规范 `../../skill/write-tijs-doc.skill.md`
