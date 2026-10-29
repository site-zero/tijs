---
title: 文档与弃用规则
keywords: [文档同步, SOURCEMAP, INDEX, 弃用, deprecated, TiFilter, 文档规范]
status: draft
---

# 文档与弃用规则

文档不是写完一次就结束的快照：组件改了 Props、加了示例、删了文件，文档就要跟着改。
本仓库的写作规范（`doc/skill/write-tijs-doc.skill.md`）对同步与弃用有硬性约定，
提交代码时一并遵守。

## 文档与源码冲突时，以源码为准

Props 名、事件名、默认值、示例配置一律从 `src/` 抽取。文档与源码不一致时**改文档**，
不是反过来迁就旧描述——源码是唯一真相。源码里读不到的行为，标「待补充」，不编造。

## 三处同步清单（索引信息变化时必做）

新增、删除篇目，或修订导致标题、分区归属、源码入口变化时，按需同步以下三处；
只调整正文措辞或示例且索引信息不变时，不必机械修改索引：

1. **`doc/reference/INDEX.md`** —— 在对应分区增删或更新一行
   `- [标题](相对路径.md)：一句话说明这篇写什么`，让不熟悉主题的读者知道本篇覆盖范围。
2. **`doc/reference/SOURCEMAP.md`** —— 按本篇「延伸阅读 · 源码入口」增删或更新
   「源码路径 ↔ 文档」映射，反向定位某个源码文件该看哪篇文档。
3. **所属分区的 `README.md` 索引** —— 新增、删除或改名时，同步计数与篇目列表
   （例如 `30.components/README.md` 按六类维护控件索引）。

另外自检相对链接可解析；若改动了已有文档记录的源码行为（Props、Events、示例），
回对应组件篇核对一遍是否仍然成立。

## 组件篇素材如何核对

写或改 `30.components/` 下某篇组件文档时，素材按固定来源回读：

- **Props / Events**：`ti-xxx-types.ts` 的 `XxxProps`、`XxxEmitter`；拿不准消费方式时
  回看 `TiXxx.vue` 里实际怎么用。
- **示例**：`example/ex-*.ts` 的 `comConf`，与 `ti-xxx-index.ts` 的 `exampleProps` 对得上；
  不允许写跑不通的伪配置。
- **中文名、race、示例清单**：`ti-xxx-index.ts` 的 `TiComInfo`。

共享 Props（`CommonProps` 等）只在 `10.concepts/` 写一次，组件篇一句话指向即可，
不复制清单。

## 弃用组件的处理

`TiFilter`、`TiComboFilter`、`TiFilterBar` 在 `src/lib/lib-com-types.ts` 中被
`TODO … 下面这三个要删掉` 标注为待删除：

```ts
// TODO: vvvvvvvvvvvvvvvvvv 下面这三个要删掉
Filter: "TiFilter",
ComboFilter: "TiComboFilter",
FilterBar: "TiFilterBar",
// TODO: ^^^^^^^^^^^^^^^^^^^ 上面这三个要删掉
```

规则：

- **新代码不要使用**这三个组件；引用旧代码时优先寻找替代控件。
- 文档只标 `deprecated` 状态，**不为它们写使用教程**（无 Props 展开、无示例）；
  在组件索引里以「待删除，不写使用教程」列出即可。
- 真正删除源码后，记得按上面的三处同步清单把索引与 sourcemap 里的残留一并清掉。

## 延伸阅读

- **源码入口**：`src/lib/lib-com-types.ts`（弃用标注段）、`doc/skill/write-tijs-doc.skill.md`（第 5、8、9 节）
- **相关文档**：[组件手册](../30.components/README.md)（弃用组件索引写法）、[新增一个组件](02-add-component.md)（新组件的文档补登位置）
