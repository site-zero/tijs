# TiJS —— 基于 Vue 3 的 Web UI 组件库与工具核心库

`@site0/tijs` 是 site-zero 体系下的一套前端基础库，由两层组成：

- **core 工具层**：与 UI 无关的纯 TypeScript 工具，包括字符串、国际化、日期时间、字典、模板、匹配规则、网络、数值、存储、算法等命名空间；
- **lib 组件层**：6 大类共 72 个可用的 Vue 3 组件（输入、小片、动作、搁架、编辑、视图；另有 3 个已标记弃用），并配套一套 composable 特性层、标准表单字段/表格列、全局弹窗与提示。

仓库地址：<https://github.com/site-zero/tijs> ｜ 许可证：BSD-3-Clause ｜ 作者：Peter Zhang

## 技术栈

- 框架：Vue `3.5`（组件外部依赖，打包时不打进产物）
- 语言与构建：TypeScript `5.9`、Vite `5.4`、Sass
- 测试：Vitest（目前只覆盖 `src/core` 下的工具模块）
- 主要三方依赖：`lodash`、`crypto-js`、`json5`、`sprintf-js`、`chance`、`html2canvas`、`sortablejs`、`leaflet`（含 `leaflet.markercluster`）、`prosemirror` 全家桶（富文本编辑器底层）

## 在业务项目中使用

下面的引导步骤对照演示工程 [site-zero/ti-demo](https://github.com/site-zero/ti-demo) 的 `src/main.ts` 核实过，可直接照抄。

### 安装

```bash
npm install @site0/tijs
# 或
yarn add @site0/tijs
```

### 入口引导（`main.ts`）

```ts
import { createApp } from "vue";
import {
  installTiComponents,
  installTiCoreI18n,
  updateInstalledComponentsLangs,
  init_ti_std_fields,
  init_ti_std_columns,
} from "@site0/tijs";
import App from "./App.vue";

// 1. 安装核心语言包（支持 zh-cn / zh-hk / en-us / en-uk）
installTiCoreI18n("zh-cn");

// 2. 注册内置标准表单字段与表格列
init_ti_std_fields();
init_ti_std_columns();

const app = createApp(App);

// 3. 批量注册全部 TiJS 组件
installTiComponents(app);

// 4. 组件注册完成后，统一切换一遍组件自身的语言
updateInstalledComponentsLangs("zh-cn");

app.mount("#app");
```

> 顺序要求：先 `installTiCoreI18n`，再 `installTiComponents`，最后 `updateInstalledComponentsLangs`；
> 自定义组件通过 `tiPutComponents({ 名称: 组件信息 })` 追加进注册表，必须在 `installTiComponents(app)` 之前调用。

### 引入样式

在业务项目自己的入口样式文件（如 `style.scss`）中：

```scss
@use "@site0/tijs/sass/_all.scss" as *;
@use "@site0/tijs/sass/app.scss";
```

组件在模板中的直接用法、各组件 Props/事件说明，见
[参考手册 · 组件篇](./doc/reference/30.components/README.md)；
可交互演示：本地运行 [ti-demo](https://github.com/site-zero/ti-demo) 工程，按路由
`/:comType?/:example?` 浏览每个组件的内置示例。

## 开发本仓库

| 命令 | 脚本（见 `package.json`） | 说明 |
| --- | --- | --- |
| `yarn install` | — | 安装依赖 |
| `yarn build` | `vue-tsc && vite build && tsc --emitDeclarationOnly` | 类型检查、打包到 `dist/`，生成类型声明 |
| `yarn test` | `vitest --silent=false` | 运行 core 工具层单元测试 |
| `yarn preview` | `vite preview` | 本地预览构建产物 |

## 工程目录导览

```bash
tijs/
|-- src/                      # 全部源代码，主要看这里
|   |-- core/                 # 核心工具层（与 UI 无关，可独立引用）
|   |   |-- ti-coms.ts        # 组件注册表：installTiComponents / tiGetComponent 等运行时查询
|   |   |-- ti-exports.ts     # 命名空间聚合导出：Str/I18n/DateTime/Match/Dicts/Alg/Net/Num/…
|   |   |-- _top/             # 全局顶级帮助函数：消息总线、环境变量、图标解析、随机数、矩形、汇率、范围与颜色类型
|   |   |-- alg/              # 算法工具：base26 编码、浏览器标签指纹、签名、雪花 ID、字符/链式栈
|   |   |-- dict/             # 字典体系：工厂、选项、包装器、动态字典，供下拉/选择类控件使用
|   |   |-- fuse/             # 保险丝机制：一组异步 Detonator 全部通过后触发熔断回调
|   |   |-- g2d/              # 二维几何：点距离等坐标计算
|   |   |-- match/            # 条件匹配规则：20+ 种 by-* 匹配器（字符串/正则/范围/映射/空值/类型…）
|   |   |-- net/              # 网络辅助：动态 ES Module 加载
|   |   |-- num/              # 数值工具：数学计算与数值换算、格式化
|   |   |-- storage/          # 本地存储封装：TiStorage 类，导出 local / session
|   |   |-- text/             # 文本与国际化：Str 字符串工具、I18n 语言包
|   |   |-- time/             # 日期时间：DateTime 解析/格式化/时区、time-info 时间对象
|   |   |-- tmpl/             # 模板引擎：Tmpl 解析与执行、token 与分段渲染
|   |   |-- util/             # 通用工具：集合、冲突、diff、取值、调用、路径、记录、语言判断
|   |   `-- web/              # Web 辅助：CssUtils、Dom、EventUtils、Be 行为集合
|   |-- lib/                  # UI 组件层，6 大类共 72 个可用组件（另 3 个已弃用）
|   |   |-- action/           # 动作类：按钮、动作条、侧边栏、标签页、分页、下拉标签
|   |   |-- edit/             # 编辑类：富文本、代码编辑器、成对编辑器、记录编辑、筛选条…
|   |   |-- input/            # 输入类：各类表单录入控件（数量最大）
|   |   |-- shelf/            # 搁架类：表单、栅格、布局、区块、日历等组合容器
|   |   |-- tile/             # 小片类：标签、缩略图、图标、进度条、上传等小面积展示
|   |   |-- view/             # 视图类：表格、列表、树、树表、地图、瀑布流、流程等大面积视图
|   |   |-- _features/        # 35 个 composable 复用钩子（只读、选项、校验、拖拽、字典…）
|   |   |-- _modal/           # 全局弹窗：Alert / Confirm / Prompt / openAppModal
|   |   |-- _toast/           # 全局轻提示 Toast / openToast
|   |   |-- _tipbox/          # 页面提示框 API
|   |   `-- _vue/             # Vue 插件与辅助工具
|   |-- _type/                # 全部 TypeScript 类型契约（CommonProps / TiComInfo / 字段与列类型…）
|   |-- i18n/                 # 核心语言包：zh-cn / en-us
|   `-- test/                 # Vitest 单元测试，目前覆盖 core 工具层
|
|-- doc/                      # 项目文档体系：reference 参考手册已完成，其余分区见下一节
|-- fragment/                 # 可复用代码片段（组件用法、core 调用范例）
|-- prompt/                   # 缓存提示词
|-- index.d.ts                # 包类型入口：export * from "./src"
|-- dist/                     # 构建产物，不用看
|-- node_modules/             # 依赖目录，不用看
|-- vite.config.ts            # Vite 库构建配置（external: vue）
|-- tsconfig.json             # TypeScript 配置
|-- typedoc.json              # TypeDoc 配置
|-- .prettierrc               # 代码格式化规则
`-- LICENSE                   # BSD-3-Clause
```

## 文档与 AI 协作

- **参考手册**：[`doc/reference/`](./doc/reference/README.md)，按入门、概念、core 工具、组件、特性钩子、开发规范分模块组织，附全量索引 [`INDEX.md`](./doc/reference/INDEX.md) 与源码映射 [`SOURCEMAP.md`](./doc/reference/SOURCEMAP.md)。
- **写作规范**：[`doc/skill/write-tijs-doc.skill.md`](./doc/skill/write-tijs-doc.skill.md)，约束参考手册的结构、参数分组与索引格式。
- **AI 入口**：[`AGENT.md`](./AGENT.md)，给 Agent 的最少 token 阅读路线、源码地图与契约速览。
- **技能文档**：`doc/skill/`，后续沉淀"如何新增组件 / 写测试 / 排错"等可复用套路。
- **工作笔记**：`doc/note/`，通读源码后的非正式记录，可能过时，不对外发布。

## 注意事项

- 文档与源码不一致时，**以源码为准**；修改 `src/` 中已 documented 的行为需同步更新对应文档。
- 以下组件在 `src/lib/lib-com-types.ts` 中已标注待删除，新代码不要使用：
  `TiFilter`、`TiComboFilter`、`TiFilterBar`。
- `.gitignore` 忽略的目录与产物（`dist/`、`node_modules/`、日志等）一律不用阅读。

## License

[BSD-3-Clause](./LICENSE)
