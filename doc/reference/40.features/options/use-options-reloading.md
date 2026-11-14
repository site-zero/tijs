---
title: use-options-reloading 选项异步重载
keywords: [hook, useOptionsReloading, use-options-reloading, reload, 异步加载, hint, pending, 竞态, 取消, loading, 选项重载]
status: draft
---

# `use-options-reloading` 选项异步重载

## 解决什么问题

可输入下拉（`TiInputCombo`）的候选选项是随输入关键字异步变化的：用户每敲一个键，都要
带着新 hint 重新向字典/接口要一份列表。这里有三个并发难题：只读状态下不该再加载；
相同 hint 的连续触发要去重，别让上一次慢请求把新列表盖掉；加载期间面板状态要从
`ready` 切到 `loading` 再切回来。

`useOptionsReloading` 把"该不该重载、什么时候重载、并发请求怎么排队"这套状态机固定
下来。它自己不持有数据——所有读写都通过 `setup` 回调桥接，因此可以挂在任意
输入盒子的选项面板上。当前唯一消费方是 `TiInputCombo`。

## 输入 Props

本 hook **不接收 Props 对象**，只接收一份 `OptionsReloadingSetup` 桥接配置：

- **`_last_hint: LastHintApi`** —— 上次 hint 记录器：`setLastHint` / `tryPending` / `resolvePending` / `rejectPending`，负责相同 hint 的等待队列去重。
- **`_pipe_value: ValuePipeApi`** —— hint 预处理管道（即 [use-value-pipe](../value/use-value-pipe.md) 的返回函数），请求前先加工 hint。
- **`isReadonly: () => boolean`** —— 当前是否只读。
- **`hasOptionsData: () => boolean`** —— 是否已经加载过选项数据。
- **`isOptionsDataShow: () => boolean`** —— 当前面板是否处于展示中。
- **`setOptionsStatus(s: BoxOptionsStatus)`** —— 切换面板状态（`loading / ready / hide`…）。
- **`getOptionsData() / setOptionsData(d: Vars[])`** —— 读写当前选项列表。
- **`load?: (hint?: string) => Promise<Vars[]>`** —— 实际的数据加载函数；不提供则不会触发重载。
- **`needReloadWhenHintChange: () => boolean`** —— hint 一变是否就要实时刷新（远程查询型为真，本地静态字典为假）。

## 返回值 API

```ts
const reloader = useOptionsReloading(setup);
await reloader.tryReloadOptionsData(hint);
```

两个函数：

- **`reloadOptionsData(hint?)`** —— 强制执行一次加载：只读时清空数据并 `hide`；否则置 `loading`，hint 先过管道再交给 `load`，结果写回数据；加载完成后复查只读状态决定 `ready` 还是 `hide`。
- **`tryReloadOptionsData(hint?)`** —— 入口：
  1. 已加载过数据，且（hint 变化需要实时刷新 或 面板当前未展示）→ 判定需要重载；
  2. `_last_hint.setLastHint(hint)` 记录本次 hint；
  3. `tryPending(hint)`：已有相同 hint 在途则直接返回它的 Promise（等待队列去重）；
  4. 需要重载则 `await reloadOptionsData`，出错 `rejectPending`；
  5. 最后 `resolvePending(当前列表, hint)` 唤醒等待方。

## 配合使用

- **与 `useOptionsFilter`**：本 hook 拉回的原始列表，接下来交给 [use-options-filter](./use-options-filter.md) 拼装成面板最终列表。
- **与 `use-value-pipe`**：hint 在请求前经管道加工（去空白、命名转换等），见 [use-value-pipe](../value/use-value-pipe.md)。
- **与字典查询**：`load` 内部通常就是 `dict.queryData`，异步与取消语义见 [字典模型](../../10.concepts/06-dict-model.md)。

典型调用片段（`use-input-combo-api.ts` 风格）：

```ts
const reloader = useOptionsReloading({
  _last_hint,               // 组件持有的 LastHintApi 实例
  _pipe_value: (h) => h,     // hint 预处理
  isReadonly: () => state.isReadonly,
  hasOptionsData: () => !_.isEmpty(state.optionsData),
  isOptionsDataShow: () => state.optionsStatus === 'ready',
  setOptionsStatus: (s) => (state.optionsStatus = s),
  getOptionsData: () => state.optionsData,
  setOptionsData: (d) => (state.optionsData = d),
  load: async (hint) => dict?.queryData({ hint }) ?? [],
  needReloadWhenHintChange: () => !!props.optionQuery,
});

// 用户输入变化时：
await reloader.tryReloadOptionsData(state.boxInputing);
```

## 注意事项

- **只读二次防守**：加载完成回写后会再查一次 `isReadonly`，防止等待期间用户切到只读。
- **不重复加载的前提**：`needReloadWhenHintChange` 为假且面板已展示时，同一面板打开期间只加载一次；切换 hint 不会触发新请求。
- **本 hook 自身不发 `AbortController`**：请求间去重靠 `LastHintApi` 的 pending 队列，取消语义由 `load`（字典层）负责。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/use-options-reloading.ts` —— 本 hook 实现。
  - `src/lib/input/combo/use-input-combo-api.ts` —— 唯一消费方。
- **相关文档**
  - 拉回数据后的拼装：[use-options-filter](./use-options-filter.md)。
  - hint 预处理：[use-value-pipe](../value/use-value-pipe.md)。
  - 消费方 `TiInputCombo`：[ti-input-combo](../../30.components/input/ti-input-combo.md)。
