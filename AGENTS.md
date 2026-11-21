# AGENTS.md — TiJS

控件库 + 工具核心（`Ti*` 组件、注册表、两段式 GUI、schema 渲染）。人类读者先看 `README.md`。

## 先读

1. `doc/README.md` — 文档站首页；
2. `doc/reference/INDEX.md` — 全量索引（按关键词直达）；
3. `doc/reference/10.concepts/README.md` — 六篇共同地基（组件模型 / 注册表 / schema / 数据 / 事件 / 主题）；
4. `doc/reference/SOURCEMAP.md` — 源码 ↔ 文档反查；
5. 动手前：`doc/reference/101.dev/` 对应篇。

**写组件前必读** `doc/skill/write-tijs-com.skill.md`；**写文档前必读** `doc/skill/write-tijs-doc.skill.md`。

## 组件与注册表

- 组件按六类划分，通过 `TiComInfo` 注册（`icon/race/name/text/i18n/com/install`）；
- 范本：最简 `src/lib/action/button/`、完整 `src/lib/input/text/`、复杂 `src/lib/view/table/`；
- 公共 Props 见 `doc/reference/10.concepts/02-common-props.md`；新增组件步骤见 `101.dev/02-add-component.md`。

## 纪律

- 源码为准；文档冲突改文档；
- 版本号按 `write-tijs-com.skill.md` 维护；
- 弃用/占位组件清单与规则见 `101.dev/05-doc-and-deprecation.md`；
- 构建/发布见 `101.dev/04-build-and-release.md`；常用命令见 `package.json`。
