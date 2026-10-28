
我需要让 tijs 项目对 AI AGent 更加友好，因此我需要在项目里建立一套文档系统

```bash
/tijs/
|-- doc/             # 所以文档目录
|   |-- refernce/    # 代码库参考手册
|   |-- skill/       # 写给 AI 的技能文档
|   |-- note/        # 给 AI 用的工作过程知识笔记
|   |-- www-gen-site.json5  # 发布站点配置信息
|-- src/             # 源码文档目录
|-- fragment/        # 常用代码片段
|-- prompt/          # 缓存一些提示词
|-- README.md        # 项目的总体说明介绍
|-- AGENT.md         # 写给 AGENT 的说明
```

我需要你先阅读一下项目的源码，然后与我讨论一下如何规划一下这个文档系统。
我们先从 `tijs/README.md` 开始

整个文档体系，你可以参考一下 `D:\workspace\git\github\zozoh\walnut`
下面的文档，它是个后端项目，文档体系比较齐全，对 AI 也比较友好
