---
title: use-viewport 容器尺寸监听
keywords: [hook, useViewport, use-viewport, ResizeObserver, 视口尺寸, width, height, resize, 容器尺寸]
status: draft
---

# `use-viewport` 容器尺寸监听

## 解决什么问题

组件要做"按容器宽度自适应"时，需要一个跟随容器尺寸变化的宽高值：网格要按宽度算列数、
富文本要按高度高自适应、数字单位输入框要按宽度决定后缀是否换行。监听 `window.resize`
拿不到容器自己的尺寸，手写 `ResizeObserver` 又要在 `onMounted`/`onUnmounted` 里配对
`observe`/`disconnect`。

`useViewport` 用一个 `ResizeObserver`（100ms 防抖）把目标元素的宽高收进一个响应式对象，
并在尺寸变化时可选地向外抛 `resize` 事件；`TiWall`、`TiGridFields`、`TiLayoutGrid`、
`TiEditRichProse`、`TiInputNumUnit` 都用它作为自适应尺寸的统一来源。

## 输入 Props

本 hook 不消费组件 Props，而是接收 `ViewportOptions`（在本 hook 文件内声明）：

- **`getElement: () => HTMLElement | undefined | null`** —— 取要观察的目标元素；
  必传，hook 在 `startWatch` 与 `updateViewPortSize` 时都会重新调用一次。
- **`emit?: (event: 'resize', rect: Rect) => void`** —— 尺寸确有变化时回调，
  载荷为目标元素的 `Rect`。
- **`onMounted?: (cb: Callback) => void`** —— 通常传组件的 `onMounted`，hook 会把
  `startWatch` 注册进去。
- **`onUnmounted?: (cb: Callback) => void`** —— 通常传组件的 `onUnmounted`，hook 会把
  `stopWatch` 注册进去。

## 返回值 API

```ts
const viewport = useViewport(options);
```

- **`size: Size2D`** —— 响应式 `{ width, height }`；初始为 `{0, 0}`，观察到正尺寸后
  才更新（宽或高为 0 的读数会被忽略）。
- **`getViewElement()`** —— 原样返回传入的 `getElement`，便于外部再取元素。
- **`updateViewPortSize()`** —— 手动立即重算一次（默认走 100ms 防抖包装）。
- **`startWatch()`** —— 对目标元素开始 `observe`。
- **`stopWatch()`** —— `disconnect` 全部观察。

## 配合使用

- **与 `use-grid-layout`**：把 `viewport.size.width` 喂给 `useGridLayout`，容器一变化
  列数就自动重算。

```ts
// 组件 setup 内：观察根元素
const rootEl = ref<HTMLElement>();
const viewport = useViewport({
  getElement: () => rootEl.value,
  emit: (event, rect) => console.log("viewport resize", rect.width),
  onMounted,        // 自动注册 startWatch
  onUnmounted,      // 自动注册 stopWatch
});

// 模板里按容器宽度做响应式计算
const colCount = computed(() => Math.max(1, Math.floor(viewport.size.width / 200)));
```

```xml
<div ref="rootEl" :style="{ height: '100%' }">
  <!-- 内部内容按 viewport.size 自适应 -->
</div>
```

## 注意事项

- **宽高为 0 不更新**：元素尚未布局完成时 `Rects.createBy` 得到 0，hook 会跳过，避免
  把布局初始值写进响应式对象。
- **`emit('resize')` 在每次尺寸确认变化后触发**，即使宽高读数没变也不会重复抛。
- **重复 `startWatch` 前会先 `disconnect`**：内部用同一个 `ResizeObserver` 实例，
  不会叠加观察。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/use-viewport.ts` —— 本 hook 与 `ViewportOptions`。
  - `src/lib/view/wall/TiWall.vue`、`src/lib/shelf/grid-fields/TiGridFields.vue`、
    `src/lib/shelf/layout/grid/TiLayoutGrid.vue`、
    `src/lib/edit/rich/prose/TiEditRichProse.vue`、
    `src/lib/input/num-unit/TiInputNumUnit.vue` —— 实际消费方。
- **相关文档**
  - 用容器宽度算列数：[`use-grid-layout`](use-grid-layout.md)。
  - 大表格按视口裁剪渲染：[`use-large-scrolling`](use-large-scrolling.md)。
  - 消费组件：[TiWall](../../30.components/view/ti-wall.md)、
    [TiGridFields](../../30.components/shelf/ti-grid-fields.md)、
    [TiLayoutGrid](../../30.components/shelf/ti-layout-grid.md)、
    [TiInputNumUnit](../../30.components/input/ti-input-num-unit.md)。
