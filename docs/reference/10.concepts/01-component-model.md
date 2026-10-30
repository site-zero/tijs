---
title: 组件模型
keywords: [组件模型, TiComInfo, TiComRace, 注册表, install, 组件注册, TiCom, race]
status: draft
---

# 组件模型

## 要解决的问题

TiJS 并不是一堆彼此独立的 Vue 组件。表单 schema、Playground、动态渲染器都需要
在运行时**只凭一个类型名字符串**（例如 `"TiButton"` 或 `"ti-button"`）回答下面这些问题：

- 这个组件属于哪一类（输入框、按钮、表格……）？
- 它的中文名、图标、局部语言包是什么？
- 它默认展示哪个示例配置？内置了哪些演示用的 `comConf`？
- 它会向外发出哪些事件？演示时事件触发后应该把结果回写到配置的哪个字段？
- 在演示区给它预留多大尺寸、什么样式？

**普通的 Vue `app.component(...)` 注册只保存组件实现本身，回答不了这些问题。** 因此 TiJS
在 Vue 注册之上，再加了一层"组件描述 + 全局注册表"。

## 解决思路

### 两层结构

```text
┌────────────────────────────────────────────────────────────┐
│ TiComInfo（静态描述，写在每个组件的 ti-xxx-index.ts 里）      │
│  race / name / text / icon / i18n / install / com /          │
│  defaultProps / exampleProps / exampleModel / liveStyle …    │
└───────────────────────┬────────────────────────────────────┘
                        │ 构造
                        ▼
┌────────────────────────────────────────────────────────────┐
│ TiComImpl（运行时包装，src/core/_top/ti-com.ts）              │
│  补齐默认值、从 com.emits 收集事件清单、提供 getProps/checkProps │
└───────────────────────┬────────────────────────────────────┘
                        │ 以 kebab-case 类型名为键存入全局 Map
                        ▼
┌────────────────────────────────────────────────────────────┐
│ ALL_TI_COMS: Map<string, TiCom>（src/core/ti-coms.ts）       │
│  installTiComponents / tiGetComponent / tiFindComponents …      │
└────────────────────────────────────────────────────────────┘
```

### 启动时注册

内置六类组件先由各自 `all-*.ts` 汇总成 `TiComSet`，在 `ti-coms.ts` 模块加载时逐一
包装进全局 Map；`installTiComponents(app)` 遍历注册表，调用每个描述对象自带的
`install(app)` 方法，完成真正的 Vue 组件注册：

```ts
// 业务应用 main.ts 中的典型顺序
import { installTiComponents, tiPutComponents } from "@site0/tijs";

// 1. 自定义组件必须在 installTiComponents 之前放入注册表
tiPutComponents({ MyCustomBox: MyCustomBoxInfo });

// 2. 把注册表内全部组件安装到 Vue 应用
installTiComponents(app);
```

### 组件分类：`TiComRace`

`race` 是组件在界面生态中的角色，决定 Playground 演示区的排布方式，也是文档分目录的
依据：

| race | 含义 | 典型组件 |
| --- | --- | --- |
| `INPUT` | 产出单一简单数据的输入控件 | TiInput、TiSwitcher、TiCheck |
| `EDIT` | 产出较复杂数据的编辑控件 | TiEditPairs、TiEditRecords |
| `SHELF` | 组合子控件的布局容器 | TiForm、TiLayoutGrid、TiTabsForm |
| `ACTION` | 执行命令的动作控件 | TiButton、TiTabs、TiPager |
| `TILE` | 小面积信息展示 | TiLabel、TiIcon、TiTags、TiThumb |
| `PLAY` | 多媒体内容展示 | （预留分类） |
| `VIEW` | 大面积复杂数据视图 | TiTable、TiList、TiTree、TiWall |
| `INNER` | 内部使用，不建议直接调用 | 内部辅助组件 |

### `TiComInfo` 字段

每个组件目录的 `ti-xxx-index.ts` 导出一个 `TiComInfo` 对象，字段含义如下：

- **`race: TiComRace`** —— 组件分类，必填。
- **`name: string`** —— 组件类型名，与 `install` 里 `app.component` 注册名保持一致。
- **`com: DefineComponent`** —— Vue 组件实现。
- **`install(app)`** —— 真正执行 Vue 注册的函数；注册表安装时统一回调它。
- **`icon?: string`** —— 列表/选择器里展示的图标标识，缺省为 `fas-question`。
- **`text?: string`** —— 展示名，支持 `i18n:` 前缀；缺省回退到 `name`。
- **`i18n?: I18nSet`** —— 组件局部语言包，按 `en_us / en_uk / zh_cn / zh_hk` 分组。
- **`tags?: string[]`** —— 检索标签，供 `tiFindComponents` 过滤。
- **`asInner?: boolean`** —— 标记为内部组件，缺省 `false`。
- **`defaultProps?: string`** —— 默认示例名；未指定时为 `_auto_`。
- **`exampleProps?: ComPropExample[]`** —— 演示用配置集合，详见下文。
- **`exampleModel?`** —— 事件回写规则，详见 [事件绑定](03-event-binding.md)。
- **`liveStyle?: Vars`** —— Playground 演示区施加在组件容器上的默认样式。

### 示例配置：`exampleProps`

`exampleProps` 是一组 `ComPropExample`，Playground 据此生成示例切换器：

- **`name`** —— 示例在控件内的唯一标识，路由参数与 `defaultProps` 都用它。
- **`text?`** —— 示例显示文本，支持 `i18n:` 前缀。
- **`expectWidth?`** —— 演示区期望最小宽度；空间不足时 Playground 会折叠配置面板。
- **`comConf: Vars | (() => Vars)`** —— 示例配置对象；可以是静态对象，也可以是返回
  配置的函数（动态生成）。

`TiComImpl.getProps(name?)` 按示例名取出 `comConf`（函数会先执行、对象会深拷贝）；
`checkProps(name?)` 在找不到示例时直接抛错。

### 注册表查询 API

`src/core/ti-coms.ts` 对外提供的查询与管理函数：

- **`tiGetComponent(key, dft?)`** —— 按类型名查 `TiCom`；名字会先归一化为 kebab-case；
  找不到时回退到 `dft`（默认 `TiUnknown`）。
- **`tiCheckComponent(key)`** —— 同上，找不到直接抛错。
- **`tiAllComponents()`** —— 返回完整注册表 `Map`。
- **`tiFindComponents(filter?)`** —— 按过滤函数遍历，返回 `TiCom[]`。
- **`tiPutComponents(coms)`** —— 追加一批自定义组件描述，必须在 `installTiComponents`
  之前调用。
- **`tiGetDefaultComPropValue(comType, propName, dft?)` / `tiSetDefaultComPropValue(...)`**
  —— 按"组件 + 属性"覆盖全局默认值，底层走环境变量存储。

## 关键细节

- **类型名归一化**：注册表键统一是 kebab-case；传入 `TiButton`、`ti-button`、`tiButton`
  都能查到同一个组件。
- **事件清单自动收集**：`TiComImpl` 构造时读取 `com.emits`，把事件名存入 `events` 数组，
  供 Playground 挂载监听，不需要在 `TiComInfo` 里重复声明。
- **`exampleModel` 缺省值**：未声明时为 `{ change: "value" }`，即 `change` 事件的载荷
  直接写回 `comConf.value`。
- **语言包延迟并入**：组件局部语言包不是在注册时并入全局词典，而是由
  `updateInstalledComponentsLangs(lang)` 在安装阶段统一并入，详见 [国际化 i18n](04-i18n.md)。
- **弃用组件**：`TiFilter`、`TiComboFilter`、`TiFilterBar` 已标记待删除，新代码不要使用，
  文档中也不提供使用教程。

## 主要代码入口

- `src/core/ti-coms.ts` —— 全局注册表、安装函数、查询与默认值 API。
- `src/core/_top/ti-com.ts` —— `TiComImpl` 运行时包装类。
- `src/_type/core-types.ts` —— `TiComInfo`、`TiComRace`、`ComPropExample`、`TiCom` 类型定义。
- `src/lib/<类>/all-*.ts` —— 每一类组件的描述汇总。
- `src/lib/<类>/<组件>/ti-xxx-index.ts` —— 单个组件的 `TiComInfo` 定义范本。

## 延伸阅读

- 组件目录内各文件分别提供什么素材：写作规范 `docs/skill/write-tijs-doc.skill.md` 第 5 节。
- 事件如何回写到演示配置：[事件绑定](03-event-binding.md)。
- 组件局部语言包如何并入全局词典：[国际化 i18n](04-i18n.md)。
