# AGENT.md — 快速了解 TiJS 项目

> 给 AI Agent 的入口文件。读完本篇，再按顺序点开 2~3 个链接即可建立对全项目的认知，
> 不要盲目翻源码。人类读者请先看根目录 [`README.md`](./README.md)。

## 这个项目是什么

`@site0/tijs` 是一套 **Vue 3 + TypeScript + Vite 的 Web UI 组件库**，外加一层与 UI 无关的
工具核心库（BSD-3-Clause，作者 Peter Zhang，仓库 <https://github.com/site-zero/tijs>）。

一句话目标：开发者只保留少量 HTML/CSS 常识，就能搭出样式统一、行为一致的合格界面。

- **两层结构**：`src/core/` 是无 Vue 依赖的纯 TS 工具命名空间；`src/lib/` 是六大类共
  72 个可用 Vue 组件，外加一套 composable 特性层、标准表单字段 / 表格列、全局弹窗与提示。
- **注册表驱动**：每个组件由 `TiComInfo` 描述并统一注册，运行时凭类型名（如 `"TiButton"`）
  动态查找；组件配置对 JSON / schema 友好，便于搭建所见即所得编辑器。
- **横切能力共享**：只读、占位、前后缀、悬浮提示、显隐等由公共 Props 与 features hook
  统一提供，不在每个组件里重复实现。
- **字典模型**支撑动态下拉与选择；字段、列可集中注册管理，服务复杂表单与复杂表格。
- **i18n 分层**：核心语言包 + 组件局部语言包，可在运行时切换语言。

## 最少 token 阅读顺序

1. [`doc/README.md`](doc/README.md) —— 文档站首页，先弄清正式手册与内部写作流程的边界。
2. [`doc/reference/INDEX.md`](doc/reference/INDEX.md) —— 全量文档索引，按主题或关键词
   检索，直达对应篇目。
3. [`doc/reference/10.concepts/README.md`](doc/reference/10.concepts/README.md) 及其六篇
   机制 —— 全库共同地基，先读这一部分再看组件或工具。
4. [`doc/reference/SOURCEMAP.md`](doc/reference/SOURCEMAP.md) —— 拿到源码文件 / 类名时，
   反查对应文档；反之从文档回到源码入口。
5. 动手改代码前，先看 [`doc/reference/101.dev/`](doc/reference/101.dev/README.md) 对应
   篇目；**写文档前必读** [`doc/skill/write-tijs-doc.skill.md`](doc/skill/write-tijs-doc.skill.md)。
6. 查具体内容：组件 → `doc/reference/30.components/<类>/`；hook → `doc/reference/40.features/`；
   工具 API → `doc/reference/20.core-utils/`。

## 文档体系（doc/ 与根目录）

```text
doc/
├── README.md             # 文档站首页与内容分区说明
├── www-gen-site.json5    # 静态文档站生成配置
├── reference/            # 正式参考手册（篇目已建齐，持续核对）
├── skill/                # Agent 技能套路，不发布到文档站
└── note/                 # 工作过程笔记（尚未建立，非正式、可能过时，不发布）
fragment/                 # 根目录，可复用代码片段（待补）
prompt/                   # 根目录，提示词缓存
```

- 根 [`README.md`](./README.md) 面向人类使用者；本篇 `AGENT.md` 面向 Agent。
- 文档与源码冲突时，**以源码为准**；修改已有文档记录的行为，必须同步更新对应文档。
- 新增、删除篇目或改变标题、归属、源码入口时，按需同步 `INDEX.md`、`SOURCEMAP.md`、
  所属分区 README；格式要求见写作规范。

## 源码布局

完整目录树与各目录职责见根 [README.md · 工程目录导览](./README.md#工程目录导览)，
本篇不重复维护。定位代码时先看那棵树；下面只补 README 没写的结构约定。

- **`src/_type/`**：只放类型契约（`TiComInfo`、`TiComRace`、共享 Props、字典与表格字段类型），
  组件 `types.ts` 从这里交叉组合，不要在组件目录重复定义共享类型。
- **`src/core/`**：工具层，目前唯一有单元测试的层；出口在 `ti-exports.ts`，注册表 API 在
  `ti-coms.ts`。
- **`src/lib/`**：组件层；每类一份 `all-*.ts` 注册表，`lib/index.ts` 统一 re-export 并向
  `globalThis.Ti` 挂全局弹窗与提示。

### 组件注册表与六类划分

- 每个组件目录导出 `TiXxxInfo: TiComInfo`，字段含 `icon / race / name / text / i18n / com /
  install / defaultProps / exampleProps` 等，以现有源码为准。
- 六类目录与 `TiComRace` 对应：`action` 动作、`edit` 复杂编辑、`input` 简单输入、
  `shelf` 布局组合、`tile` 小片展示、`view` 大面积视图；另有 `PLAY`（当前无对外组件）、
  `INNER`（内部件，不建议直接使用）。
- 单个组件目录的固定组成是**最低集合，按需取舍**：`ti-xxx-index.ts`、`ti-xxx-types.ts`、
  `TiXxx.vue`；可选 `ti-xxx-api.ts`、`example/`、`support/`、局部 scss、局部 i18n。
- 范本：最简 [`src/lib/action/button/`](src/lib/action/button/)；完整
  [`src/lib/input/text/`](src/lib/input/text/)；复杂 [`src/lib/view/table/`](src/lib/view/table/)。

## 接入引导契约（顺序不能乱）

业务工程 `main.ts` 的五步顺序（实测来源：演示工程 `ti-demo/src/main.ts`）：

1. `installTiCoreI18n(langKey)` —— 并入核心语言包；
2. `init_ti_std_fields()`、`init_ti_std_columns()` —— 注册内置标准字段与表格列；
3. `createApp(App)`；
4. `installTiComponents(app)` —— 批量注册全部组件；
5. `updateInstalledComponentsLangs(langKey)` —— 组件注册完成后统一切换语言。

两条硬约束：

- 用 `tiPutComponents({ 名称: 组件信息 })` 追加自定义组件，**必须在 `installTiComponents(app)`
  之前**调用。
- `updateInstalledComponentsLangs(...)` **必须在 `installTiComponents(app)` 之后**。

入口样式两行：

```scss
@use "@site0/tijs/sass/_all.scss" as *;
@use "@site0/tijs/sass/app.scss";
```

`vue` 是外部依赖，不会被打进产物。

## 常用命令（package.json）

| 命令 | 脚本 | 说明 |
| --- | --- | --- |
| `yarn install` | — | 安装依赖 |
| `yarn build` | `vue-tsc && vite build && tsc --emitDeclarationOnly` | 类型检查、打包 `dist/`、生成类型声明 |
| `yarn test` | `vitest --silent=false` | 运行 core 工具层单测；组件层无单测 |
| `yarn preview` | `vite preview` | 本地预览构建产物 |

可交互演示在独立仓库 `site-zero/ti-demo`：本地 `yarn install && yarn dev`，hash 路由
`/:comType?/:example?`，第一段是组件类型名，第二段可选示例名。

## 不要读、不要用

- **弃用组件**（`src/lib/lib-com-types.ts` 已标注 TODO 删除，新代码不要使用）：
  `TiFilter`、`TiComboFilter`、`TiFilterBar`；参考手册不为它们写使用教程。
- `BatchFormName` 是 `TiBatchForm` 的 `INNER` 内部子控件，不单独使用、不单独成篇。
- **骨架占位组件**（视图仅固定文本、无实际 Props / 事件）：`TiInputColor`、`TiInputIcon`、
  `TiFalls`、`TiWeeks`、`TiTimeSlots`；文档已据实标注为占位。
- `dist/`、`node_modules/`、日志等被 `.gitignore` 忽略的产物一律不用阅读。
- 已记录但**尚未修复**的源码疑点（默认值错配、重复判断、失效导出路径等），见
  [`doc/reference/101.dev/04-build-and-release.md`](doc/reference/101.dev/04-build-and-release.md)
  与对应组件篇注意事项；不要在文档里把未接线属性写成已生效功能。

## 动手时的纪律

- Props、事件、默认值、示例必须回读 `ti-xxx-types.ts`、`TiXxx.vue` 的 `withDefaults`、
  `ti-xxx-index.ts` 核对；源码里读不到就标注待补充，**禁止臆造**。
- 新增或修改组件后，同步组件篇、`INDEX.md`、`SOURCEMAP.md`、分区 README；流程见
  [新增一个组件](doc/reference/101.dev/02-add-component.md) 与
  [文档与弃用规则](doc/reference/101.dev/05-doc-and-deprecation.md)。
- 组件篇固定结构、参数六分组、代码块语言（Vue 标签用 ` ```xml `、JSON 用 ` ```json `、
  TS 用 ` ```ts `、SCSS 用 ` ```scss `）一律以
  [写作规范](doc/skill/write-tijs-doc.skill.md) 为准。
- 共享 Props 不在组件篇重复罗列，统一链接到
  [共享 Props](doc/reference/10.concepts/02-common-props.md)。

## 关键 API 入口

- **注册与查找**（`src/core/ti-coms.ts`）：`installTiComponents`、`installTiCoreI18n`、
  `updateInstalledComponentsLangs`、`tiPutComponents`、`tiGetComponent`、`tiCheckComponent`、
  `tiAllComponents`、`tiFindComponents`、`tiGetDefaultComPropValue`、`tiSetDefaultComPropValue`。
- **工具命名空间**（`src/core/ti-exports.ts`）：`Str`、`Alg`、`Dicts`、`fuse`、`G2D`、
  `Match`、`Net`、`Num`、`TiStore`、`I18n`、`DateTime`、`Tmpl`、`Util`、`web`、`Be`、
  `Features`。
- **全局弹窗与提示**（`src/lib/index.ts` 挂到 `globalThis.Ti`）：`Alert`、`Confirm`、
  `Prompt`、`openAppModal`、`Toast`、`openToast`、`TI_APP_TIPS`。
