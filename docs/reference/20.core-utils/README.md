---
title: core 工具命名空间
keywords: [core, 工具, 命名空间, Str, I18n, DateTime, Dicts, Match, Tmpl]
status: draft
---

# core 工具命名空间

`src/core/` 下不依赖 Vue 组件体系的工具库，**一个命名空间一篇**。各命名空间的对外出口
以 `src/core/ti-exports.ts` 为准；共享 Props、事件、字典等组件层机制见
[`../10.concepts/`](../10.concepts/README.md)。

## 已建成

### 文本与国际化

- [Str 字符串工具](10-str.md)：空白判断、值转换、分段、命名风格转换与尺寸文本等字符串处理。
- [I18n 国际化](100-i18n.md)：维护文案语言表与取值的核心 i18n 工具。

### 算法与匹配

- [Alg 算法工具](20-alg.md)：base26、指纹、对象改动、签名、雪花号等通用算法。
- [Match 条件匹配](60-match.md)：把条件声明编译成对数据的匹配判断。
- [Num 数值工具](80-num.md)：数值数学、取整、范围、步长等数值处理。
- [G2D 二维几何](50-g2d.md)：轻量二维坐标与几何计算。

### 字典与数据

- [Dicts 字典注册表](30-dicts.md)：静态字典与动态字典的全局注册表和工厂。
- [DateTime 日期时间](110-datetime.md)：任意输入到日期时间的解析、格式化与比较。
- [Tmpl 模板引擎](120-tmpl.md)：带占位符的轻量模板字符串渲染。
- [TiStore 本地存储](90-ti-store.md)：localStorage / sessionStorage 的封装。

### 浏览器与通用

- [Util 通用工具集](130-util.md)：组件与模型层复用最广的通用辅助函数集合。
- [Web 浏览器 DOM 工具](140-web.md)：CSS 工具、DOM 操作、HTML 与事件辅助。
- [Be 元素行为扩展](150-be.md)：作用于宿主元素的一次性交互行为集合。
- [_top 顶级工具](160-top.md)：消息总线、环境变量、图标解析等最底层工具。
- [Net 网络辅助](70-net.md)：无 UI 依赖的网络小工具。
- [fuse 异步保险丝](40-fuse.md)：发布订阅式异步熔断 / 保险丝机制。

## 延伸阅读

- 源码出口：`src/core/ti-exports.ts`
- 写作模板：`docs/skill/write-tijs-doc.skill.md` 第 4.2 节
