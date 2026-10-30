---
title: 快速上手
keywords: [快速上手, getting started, 安装, install, main.ts, 引导, TiLabel, 第一个组件, ti-demo]
status: draft
---

# 快速上手

从零开始，三步把 TiJS 接进一个 Vue 3 + Vite 工程：装包、在 `main.ts` 按顺序引导、
在入口样式文件引入两行 Sass。走完这三步，模板里就能直接用 `<TiLabel />` 这样的组件标签。

下面的引导顺序对照演示工程 `ti-demo` 的 `src/main.ts` 实测过，可直接照抄。

## 安装

```bash
npm install @site0/tijs
# 或
yarn add @site0/tijs
```

注意 `vue` 是外部依赖，不会被打进产物；你的工程里需要已经装好 Vue `3.5`。

## 引导入口（`main.ts`）

TiJS 的引导有严格的先后顺序，打乱顺序会出现语言未生效、组件查不到等问题。一共五步：

1. **安装核心语言包** `installTiCoreI18n(langKey)`——并入 core 工具层与组件自带的
   核心文案，支持 `zh-cn / zh-hk / en-us / en-uk`。
2. **注册内置标准表单字段与表格列**：`init_ti_std_fields()`、`init_ti_std_columns()`，
   让后续用 `TiForm`、`TiTable` 时开箱即有一批标准字段与列定义。
3. **创建应用** `createApp(App)`。
4. **批量注册全部组件** `installTiComponents(app)`——把 72 个可用内置组件挂进 Vue 应用
   （另有 3 个已标记弃用、不收录进文档），之后模板里才能用 `<TiXxx />` 标签，
   运行时才能按类型名查到组件。
5. **统一切换组件语言** `updateInstalledComponentsLangs(langKey)`——必须放在组件注册
   之后，此时所有组件的局部语言包才就位。

**两条顺序约束要记牢：**

- 用 `tiPutComponents({ 名称: 组件信息 })` 追加自定义组件，**必须在
  `installTiComponents(app)` 之前**调用，否则追加的组件不会随批量注册一起接入。
- `updateInstalledComponentsLangs(...)` **必须在 `installTiComponents(app)` 之后**，
  先切语言再注册组件会让组件语言包停留在默认状态。

一份可照抄的最小 `main.ts`：

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

// 1. 安装核心语言包（业务自己的多语言包如需并入，可在此之前用 I18n.putAll 并入）
installTiCoreI18n("zh-cn");

// 2. 注册内置标准表单字段与表格列
init_ti_std_fields();
init_ti_std_columns();

// 3. 创建应用
const app = createApp(App);

// 4. 批量注册全部 TiJS 组件（自定义组件请在此之前用 tiPutComponents 追加）
installTiComponents(app);

// 5. 组件注册完成后，统一切换一遍组件自身的语言
updateInstalledComponentsLangs("zh-cn");

app.mount("#app");
```

> i18n 为什么要分「核心包 / 组件局部包」两层、`i18n:` 前缀怎么解析、运行时如何切语言，
> 属于机制细节，见 [国际化 i18n](../10.concepts/04-i18n.md)。

## 引入样式

在业务工程自己的入口样式文件（如 `src/style.scss`）里加两行：

```scss
@use "@site0/tijs/sass/_all.scss" as *;
@use "@site0/tijs/sass/app.scss";
```

`_all.scss` 提供全套变量与 mixin（颜色、尺度、`SZ()` 等），`app.scss` 提供组件运行所需的
基础样式。样式变量体系与亮暗主题切换，见 [样式体系](../10.concepts/05-style-system.md)。

## 第一个组件：`TiLabel`

`TiLabel` 是最简单的只读展示控件，用来呈现一个值——它不收输入、不弹面板，最适合验证
引导是否成功。引导完成后，在任意模板里直接写：

```xml
<TiLabel value="待处理" />
```

同样这件事，从「配置对象」视角看是一份普通 JSON（`comConf`）：

```json
{
  "value": "待处理"
}
```

两种写法等价：前者是模板标签调用，后者是 schema / 动态渲染视角。`TiLabel` 的完整 Props
（占位文本、状态色、前后缀图标、字典翻译、点击复制等）见
[TiLabel 标签](../30.components/tile/ti-label.md)。

> 上面的 `{ type: "TiLabel", ... }` 式配置如何在运行时按类型名找到对应组件并渲染出来，
> 靠的是组件注册表与 `TiComInfo` 描述对象——这属于组件模型机制，入门阶段知道「有这回事」即可，
> 详解见 [组件模型](../10.concepts/01-component-model.md)。

## 跑通后读什么

按下面的清单决定下一步：

- **先读 [`10.concepts/`](../10.concepts/README.md)**：注册表、共享 Props（只读、占位、
  显隐等横切属性）、事件回写、i18n 分层、样式变量、字典模型——这是后面所有组件篇与
  工具篇引用的共同地基。
- **查工具 API**：`20.core-utils/`——`Str`、`I18n`、`DateTime`、`Dicts`、`Net`、
  `Num` 等命名空间，什么时候需要纯函数处理字符串、时间、字典时翻这里。
- **查组件用法**：`30.components/`——72 个可用组件按六类归档（另有 3 个弃用组件不收录），
  按目录 README 检索后读对应组件篇。
- **复用钩子**：`40.features/`——只读、选项、校验、拖拽等 composable，内置组件在用，
  你写自定义组件时也能直接复用。
- **参与仓库开发**：[开发规范](../101.dev/README.md)——新增组件流程、测试、构建发布命令。

## 本地浏览内置示例

最快看到每个组件全部示例的方式，是跑演示工程 `ti-demo`（与本库同体系，[仓库地址](https://github.com/site-zero/ti-demo)）：

```bash
# 在 ti-demo 工程目录
yarn install
yarn dev
```

启动后访问 `http://localhost:<端口>/#/TiLabel` 之类的地址即可浏览；它用 hash 路由，
路径形参为 `/:comType?/:example?`——第一段是组件类型名（如 `TiLabel`），
第二段可选地指定示例名（对应组件 `ti-xxx-index.ts` 里的 `exampleProps`）。

## 延伸阅读

- **源码入口**：包导出聚合 `src/core/ti-exports.ts`；组件注册表 `src/core/ti-coms.ts`
  （`installTiComponents` / `tiPutComponents` 等）；标准字段与列初始化
  `src/lib/_features/field/init-ti-std-fields.ts`、`init-ti-std-columns.ts`。
- **相关文档**：[分区导览](README.md)；[TiLabel 标签](../30.components/tile/ti-label.md)；
  [组件模型](../10.concepts/01-component-model.md)、[国际化 i18n](../10.concepts/04-i18n.md)、
  [样式体系](../10.concepts/05-style-system.md)。
