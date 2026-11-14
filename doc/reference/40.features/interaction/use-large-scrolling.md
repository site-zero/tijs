---
title: use-large-scrolling 大列表渲染裁剪
keywords: [hook, useLargeScrolling, use-large-scrolling, 虚拟滚动, 大列表, 视口裁剪, cacheZone, lineMarkers, 行渲染]
status: draft
---

# `use-large-scrolling` 大列表渲染裁剪

## 解决什么问题

一个表格有几千行时，把所有行都渲染成 DOM 节点会让首屏卡死。但每行高度不一样、又要
保留滚动条长度，常见做法是：维护一列"哪些行该渲染"的标记，只把落在视口上下各扩一段
缓冲区（cache zone）内的行输出成节点，其余行只占位不渲染。

`useLargeScrolling` 就是这条判定：传入视口尺寸、各行高度、当前滚动位置与一块"渲染标记"
数组，它逐行累计高度算出每一行是否落在渲染区，并返回一个 `(rowIndex) => boolean` 的判断
函数供模板使用。当前只被 `TiTable` 消费。

## 输入 Props

本 hook 不消费组件 Props，而是接收一个 `LargeScrollingState`（在本 hook 文件内声明）：

- **`viewport: Size2D`** —— 视口宽高；`height` 为 0 时 hook 直接返回"全部不渲染"。
- **`lineHeights: number[]`** —— 各行高度（px），`0` 或缺省表示用默认行高。
- **`defaultLineHeight: number`** —— 默认行高（px）。
- **`lineCount: number`** —— 行总数。
- **`scrollTop: number`** —— 视口内容当前滚动距离。
- **`cacheZoneHeight: number`** —— 视口上下各扩出的缓冲高度（px）。
- **`lineMarkers: number[]`** —— 整数渲染标记：`0` 无需渲染、`1` 需要渲染；hook 会直接
  回写这个数组，已写过的标记不会被重复计算。

## 返回值 API

```ts
const shouldRender = useLargeScrolling(state);
```

- **`shouldRender(rowIndex: number): boolean`** —— 返回该行是否应渲染；读取
  `lineMarkers[rowIndex] > 0`。

渲染区的计算口径：

```text
lrzStart = max(scrollTop - cacheZoneHeight, 0)
lrzEnd   = scrollTop + viewport.height + cacheZoneHeight

sumHeight 逐行累加；累计高度落在 [lrzStart, lrzEnd] 的行标记为 1，其余为 0
```

## 配合使用

- **与 `use-viewport`**：`viewport.height` 通常来自 `useViewport` 观察表格容器得到的
  响应式尺寸。
- **与 `use-row-indent` / `use-tree-data`**：树形展开折叠会改变可见行集合，调用方需要在
  重算前先刷新 `lineHeights` 与 `lineMarkers`。

```ts
// 表格组件内部：滚动时重算渲染标记
const shouldRenderRow = useLargeScrolling({
  viewport: { width: tableEl.clientWidth, height: tableEl.clientHeight },
  lineHeights: heights,        // 每行实际高度
  defaultLineHeight: 32,
  lineCount: rows.length,
  scrollTop: scrollArea.scrollTop,
  cacheZoneHeight: 200,        // 视口外预渲染缓冲
  lineMarkers: markers,        // 回写标记数组
});
```

```xml
<!-- 模板里逐行判断是否输出节点 -->
<template v-for="(row, i) in rows" :key="row.id">
  <TableRow v-if="shouldRenderRow(i)" :row="row" />
</template>
```

## 注意事项

- **`lineMarkers` 是一次性的**：hook 只补写尚未标记的行；滚动后想重新判定，调用方需要
  先把 `lineMarkers` 清空，否则会沿用上一轮结果。
- **`viewport.height` 为 0 时返回恒 `false`**：布局未完成期间不渲染任何行。
- **当前无组件之外的通用消费方**：除 `TiTable.vue` 外，仓库内没有其他组件直接调用本 hook。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/use-large-scrolling.ts` —— 本 hook 与 `LargeScrollingState`。
  - `src/lib/view/table/TiTable.vue` —— 当前唯一消费方。
- **相关文档**
  - 视口尺寸来源：[`use-viewport`](use-viewport.md)。
  - 消费组件：[TiTable](../../30.components/view/ti-table.md)。
