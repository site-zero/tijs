---
title: TiJS 参考手册
keywords: [参考手册, reference, 文档索引, 组件, 工具, 概念, feature, 分区导航]
status: draft
---

# TiJS 参考手册

> 面向二次开发者与 AI Agent 的 TiJS 机制、工具、组件与 feature 手册。
> 写作规范见 `docs/skill/write-tijs-doc.skill.md`；总索引见 [`INDEX.md`](INDEX.md)，
> 源码 ↔ 文档对照见 [`SOURCEMAP.md`](SOURCEMAP.md)。

## 分区导航

| 分区 | 内容 | 目录 |
| --- | --- | --- |
| 入门 | 安装引导、`main.ts` 五步引导、第一个组件 | [`00.start-here/`](00.start-here/README.md) |
| 概念机制 | 全库共同地基，先读这一部分 | [`10.concepts/`](10.concepts/README.md) |
| core 工具 | `src/core/` 各命名空间 API | [`20.core-utils/`](20.core-utils/README.md) |
| 组件 | 72 个可用注册组件逐个说明（另有 3 个弃用组件不收录） | [`30.components/`](30.components/README.md) |
| feature hook | `src/lib/_features/` 可复用特性 | [`40.features/`](40.features/README.md) |
| 开发规范 | 源码布局、新增组件、测试与发布 | [`101.dev/`](101.dev/README.md) |

## 阅读建议

- **第一次接触**：先读 [`00.start-here/`](00.start-here/README.md) 跑通接入，再按顺序读完
  `10.concepts/` 六篇概念机制。
- **查某个组件**：先到 [组件手册](30.components/README.md) 按类检索，再读对应组件篇。
- **查工具或 hook**：分别到 [`20.core-utils/`](20.core-utils/README.md) 与
  [`40.features/`](40.features/README.md) 按主题分组查找。
- **实现新组件前**：读概念篇的共享 Props、事件绑定、字典模型，再对照
  [`101.dev/`](101.dev/README.md) 的开发规范与组件范本。

## 篇目覆盖

- 入门篇：`00.start-here/` 2 篇已建齐。
- 概念机制篇：`10.concepts/` 7 篇（README + 六篇机制）已建齐。
- 工具篇：`20.core-utils/` 16 个命名空间已建齐。
- 组件篇：`30.components/` 72 篇已建齐；`TiFilter`、`TiComboFilter`、`TiFilterBar` 弃用不收录。
- Feature 篇：`40.features/` 48 篇已建齐（含 hook 与模块概述），按 value / options / shared / interaction / field / range / validate 分组。
- 开发规范篇：`101.dev/` 6 篇已建齐。

> 「已建齐」表示篇目覆盖完整，不等同于逐篇源码复核完成；各篇 front-matter 的
> `status: draft | done | deprecated` 才表示具体核对状态。
