# fragment/ — 可复用代码片段

> 给二次开发者与 AI Agent 的高频用法片段库：**拿来即可粘贴**，每篇一个场景。
> 片段内容必须与源码示例（`src/lib/**/example/`）保持一致；改源码示例时同步改这里。
> 本目录不发布到文档站；正式教程仍在 `docs/reference/`。

## 收录约定

- 一篇一个场景，文件 kebab-case：`NN-场景名.md`。
- 每篇固定三小节：**何时用**、**片段**（JSON 配置 + Vue 标签各一份）、**要点与坑**。
- 片段优先改写自组件 `example/` 的 `comConf`，禁止写跑不通的伪配置；
  涉及注册表机制、共享 Props 的细节不展开，链接到 `docs/reference/` 对应篇目。

## 片段清单

| 片段 | 场景 |
| --- | --- |
| [01-main-ts-setup.md](01-main-ts-setup.md) | 业务工程 `main.ts` 五步接入引导 |
| [02-std-form.md](02-std-form.md) | 用 `TiForm` 搭一个标准录入表单 |
| [03-dict-droplist.md](03-dict-droplist.md) | 用 `TiDroplist` 接静态 / 动态字典选项 |
| [04-table-columns.md](04-table-columns.md) | 用 `TiTable` 列定义搭数据表格 |
