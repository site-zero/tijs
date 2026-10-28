---
title: 仓库源码布局
keywords: [源码布局, 目录结构, src, core, lib, _type, i18n, test, 组件目录]
status: draft
---

# 仓库源码布局

接手一个组件库，最先要回答的问题是：**某段代码该放在哪个目录、某个功能去哪找**。
TiJS 的源码按「类型契约 → 工具层 → 组件层 → 测试」分层组织，下面先给一张目录树，
再逐层说明职责。

## 目录树

```text
tijs/
├── index.d.ts              # 包入口声明：re-export ./src
├── package.json            # scripts / main / module / exports / files
├── vite.config.ts          # 库模式构建 + vitest 配置
├── tsconfig.json
├── doc/                    # 文档体系（reference / skill / note）
└── src/
    ├── index.ts            # 源码总出口：re-export _type / core / lib，附带 en_us / zh_cn
    ├── style.scss
    ├── assets/             # 全局样式源（sass 变量、mixins、主题）
    ├── _type/              # 全库共享类型：TiComInfo / TiComRace / 共享 Props / 字典与表格类型
    ├── core/               # 工具层（无 Vue 依赖的命名空间集合）
    │   ├── _top/ alg/ dict/ fuse/ g2d/ match/ net/ num/
    │   ├── storage/ text/ time/ tmpl/ util/ web/
    │   ├── ti-coms.ts      # 组件注册与查找 API（installTiComponents / tiGetComponent…）
    │   └── ti-exports.ts   # 工具命名空间汇总导出
    ├── i18n/               # 核心语言包 en-us.ts / zh-cn.ts，match/ 子目录
    ├── lib/                # 组件库本体
    │   ├── index.ts        # 导出全部类注册表，并向 globalThis.Ti 挂全局对象
    │   ├── lib-com-types.ts# COM_TYPES：组件类型字符串常量集中登记
    │   ├── _features/       # 可复用 composable hook（use-value-input 等）
    │   ├── _modal/ _toast/ _tipbox/ _vue/   # 横切能力与 Vue 辅助
    │   ├── action/ edit/ input/ shelf/ tile/ view/   # 六类组件
    │   └── <类>/all-*.ts   # 每类一份 TiComSet 注册表（见下表）
    └── test/
        ├── setup.ts         # vitest 全局 setup
        └── core/           # core 工具层用例
```

## 各层职责

- **`src/_type/`**：只放类型，不放实现。`TiComInfo`、`TiComRace`、共享 Props
  （`CommonProps`、`ReadonlyProps`、`PlaceholderProps`…）、字典与表格列字段等契约都
  在这里。组件 `types.ts` 从这里取基类交叉组合，不要在组件目录里重复定义共享类型。
- **`src/core/`**：工具层，按命名空间组织（`Str`、`Num`、`DateTime`、`Dicts`、`Net`…），
  对应参考手册 `20.core-utils/`。这是目前唯一有单测覆盖的层。
- **`src/lib/`**：组件层本体。六个业务分类目录加四个下划线前缀的横切目录；
  每类一份 `all-*.ts` 注册表，见下表。
- **`src/i18n/`**：核心包语言包；组件局部文案在各自组件目录内维护（见下）。
- **`src/test/`**：Vitest 工程，详见 [测试约定](03-testing.md)。
- **`doc/`**：文档体系；`doc/reference/` 是本手册，`doc/skill/` 是写作与开发技能文档。

## 六个类注册表

| 分类目录 | 注册表文件 | 导出形态 |
| --- | --- | --- |
| `action/` | `action/all-actions.ts` | 默认 `TiComSet` 映射 + 每个组件命名导出 |
| `edit/` | `edit/all-edit.ts` | 同上 |
| `input/` | `input/all-input.ts` | 同上 |
| `shelf/` | `shelf/all-shelf.ts` | 同上 |
| `tile/` | `tile/all-tiles.ts` | 同上 |
| `view/` | `view/all-views.ts` | 同上 |

每份 `all-*.ts` 做两件事：把本类所有组件的 `TiXxxInfo` 收进一个
`export default { ... } as TiComSet` 映射，再 `export *` 每个组件目录的 index，
让 `src/lib/index.ts` 一句话 re-export 整类。

## 单个组件目录的固定组成

以 `src/lib/input/text/`（`TiInputText`）为范本，动作类最简范本是
`src/lib/action/button/`（`TiButton`，无 `api/`、`support/`、`example/` 子目录，
示例直接内联在 index 里）：

| 文件/目录 | 范本实例 | 职责 |
| --- | --- | --- |
| `ti-xxx-index.ts` | `ti-input-text-index.ts` | 导出 `TiXxxInfo: TiComInfo`：icon / race / name / text / i18n / com / install / defaultProps / exampleProps |
| `ti-xxx-types.ts` | `ti-input-text-types.ts` | `XxxProps`、`XxxEmitter`、`XxxApi` |
| `TiXxx.vue` | `TiInputText.vue` | 视图模板与状态接线 |
| `ti-xxx-api.ts`（可选） | `ti-input-text-api.ts` | `useXxxApi`：组件内部计算与操作 |
| `example/`（可选） | `example/ex-*.ts` + `index.ts` | `ComPropExample` 演示配置，供 `exampleProps` 引用 |
| `support/`（可选） | `support/gen-text-action-bar-config.ts` | 内部辅助逻辑 |
| 局部样式（可选） | 根级 `ti-input-text.scss`；或 `style/` 子目录（如 `action/actionbar/style/`、`view/table/style/`） | 组件私有样式 |
| 局部 i18n（可选） | 多数组件内联在 `TiComInfo.i18n`；语言包较大时拆 `i18n/` 子目录（如 `action/sidebar/i18n/`、`view/table/i18n/`） | 组件局部文案 |

**固定组成是最低集合，不是强制全建**：`TiButton` 只有 index / types / vue 三个文件，
示例内联在 `TiComInfo.exampleProps` 数组里；`TiInputText` 才带 `api.ts`、`example/`、
`support/`。按需取舍，不要为了凑齐全套而建空目录。

`TiComInfo` 的字段以现有源码为准，实际出现的有：

```ts
const TiInputTextInfo: TiComInfo = {
  icon: 'fas-message',                    // 设计器里展示的图标
  race: TiComRace.INPUT,                   // 分类，与注册表 all-*.ts 对应
  name: COM_TYPE,                          // = COM_TYPES.InputText = 'TiInputText'
  text: 'i18n:ti-input-text-com-name',     // 显示名（i18n 键）
  i18n: { en_us, en_uk, zh_cn, zh_hk },    // 组件局部语言包
  com: TiInputText,                        // 组件实现
  liveStyle: { width: '80%', /* … */ },    // 可选：设计器实时预览尺寸
  install: (app) => app.component(COM_TYPE, TiInputText),
  defaultProps: 'simple',                  // 可选：默认选中的示例名
  exampleProps: [example.simple, /* … */], // 演示配置清单
};
```

## 延伸阅读

- **源码入口**：`src/index.ts`、`src/lib/index.ts`、`src/lib/input/text/`、`src/lib/action/button/`、`src/lib/lib-com-types.ts`
- **相关文档**：[核心概念 · 组件模型](../10.concepts/01-component-model.md)（`TiComInfo` 如何被注册与查找）、[新增一个组件](02-add-component.md)（按本目录组成落地一个新组件）、写作规范 `../../skill/write-tijs-doc.skill.md` 第 5 节
