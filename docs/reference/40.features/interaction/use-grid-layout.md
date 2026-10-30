---
title: use-grid-layout 响应式网格布局
keywords: [hook, useGridLayout, use-grid-layout, layoutHint, gridTemplateColumns, CSS Grid, 轨道宽度, 响应式, GridLayoutProps]
status: draft
---

# `use-grid-layout` 响应式网格布局

## 解决什么问题

`TiGridFields`、`TiLayoutGrid`、`TiWall` 这类"按列摆放子项"的容器，都要回答同一个问题：
容器当前多宽时，应该排几列、每列多宽。直接写死 `grid-template-columns` 在窄屏会挤成一团，
写媒体查询又啰嗦。TiJS 的做法是给一段"布局提示"（视口宽度区间 → 列数），再按轨道下标
逐列指定宽度，最后吐出一段可直接绑到根节点 `style` 的 CSS 对象。

`useGridLayout` 把这套"宽度 → 列数 → 列宽"的换算固定下来；`TiGridFields` 的字段组、
`TiLayoutGrid` 的栅格、`TiWall` 的瀑布流列都复用它。

## 输入 Props

类型 `GridLayoutProps`（定义在 `src/_type/lib-type-grid-layout.ts`）：

- **`layout?: CssGridLayout`** —— 直接给一段 CSS Grid 布局对象；若其中已写
  `gridTemplateColumns`，下列自适应列数逻辑会被整体跳过。
- **`layoutHint?: GridLayoutHint`** —— 自适应列数提示，三态：
  - `number`：固定列数；
  - `[number, number][]`：形如 `[3, 500]` 表示"宽度 ≥500 时排 3 列"的优先级臂，
    末位裸数字为兜底；缺省提示为 `[[5,1500],[4,1200],[3,900],[2,500],1]`；
  - `string`：`"<500>"` 表示每轨道固定 500px、按视口宽度整除出列数；否则按 JSON
    解析成数组。
- **`layoutGridTracks?: string | string[]`** —— 逐列宽度；`['20%,1fr']` 表示首列
  20%、其余 `1fr`；支持 `"#3:100px,1fr,200px"` 这种"3 列时用这组"的分档写法。
- **`customizedGridTracks?: (i, trackCount, dftGetter) => string`** —— 自定义每列宽度
  函数，`dftGetter` 为缺省换算器。

## 返回值 API

本模块导出三个粒度递进的入口（均在本 hook 文件内声明返回类型）：

```ts
// ① 只要换算器：配合 useViewport 自己控制刷新时机
const grid = useGridLayoutTrack(props);
const trackCount = grid.getTrackCount(viewportWidth);   // 宽度 → 列数
const css = grid.getLayoutCss(trackCount);              // 列数 → CSS 对象

// ② 已经知道当前宽度：一步到位
const style = useGridLayoutStyle(grid, viewportWidth);

// ③ 合并了 ①②：最常用
const layout = useGridLayout(props, viewportWidth);
```

`useGridLayout(props, viewportWidth)` 返回：

- **`trackCount: number`** —— 按当前视口宽度换算出的列数。
- **`layoutCss: Vars`** —— 合并了 `props.layout` 与 `gridTemplateColumns` 的样式对象，
  可直接绑到容器 `:style`。
- **`mergetStyle(css: Vars): Vars`** —— 在 `layoutCss` 基础上再深拷贝合并一段额外样式，
  返回新对象。

`useGridLayoutTrack` 单独暴露 `getTrackCount` / `getLayoutCss` 两个纯函数，供需要缓存
中间结果的场景使用。

## 配合使用

- **与 `use-viewport`**：列数依赖容器实时宽度，典型组合是先 `useViewport` 拿到
  `size.width`，再喂给 `useGridLayout`；建议整段放进 `computed` 以获得响应性（源码注释
  也推荐 computed）。

```ts
// 容器组件 setup 内
const viewport = useViewport({
  getElement: () => rootEl.value,
  onMounted, onUnmounted,
});

// 视口宽度变化时自动重算列数与列宽
const layout = computed(() => useGridLayout(props, viewport.size.width));
```

```xml
<!-- 模板根节点直接绑定 -->
<div :style="layout.layoutCss" class="ti-grid">
  <!-- 子项按列流排布 -->
</div>
```

## 注意事项

- **`layout.gridTemplateColumns` 一旦手写，`layoutHint` 与 `layoutGridTracks` 全部失效**。
- **`layoutHint` 为字符串且不是 `"<n>"` 形态时会走 `JSON.parse`**，非法串会直接抛错。
- **轨道宽度越界会被 `_.clamp` 收回到已声明的最后一档**，不会生成空列。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/use-grid-layout.ts` —— 本模块三个入口。
  - `src/_type/lib-type-grid-layout.ts` —— `GridLayoutProps`/`GridLayoutHint`/
    `GridLayoutTrackGetter` 类型。
  - `src/lib/shelf/grid-fields/TiGridFields.vue`、`src/lib/shelf/layout/grid/TiLayoutGrid.vue`、
    `src/lib/view/wall/TiWall.vue` —— 实际消费方。
- **相关文档**
  - 视口尺寸来源：[`use-viewport`](use-viewport.md)。
  - 消费组件：[TiGridFields](../../30.components/shelf/ti-grid-fields.md)、
    [TiLayoutGrid](../../30.components/shelf/ti-layout-grid.md)、
    [TiWall](../../30.components/view/ti-wall.md)。
