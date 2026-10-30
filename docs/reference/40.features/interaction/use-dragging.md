---
title: use-dragging 指针拖拽
keywords: [hook, useDragging, use-dragging, Dragging, 拖拽, pointer, 拖拽阈值, onMoving, watchZone, 列宽拖拽]
status: draft
---

# `use-dragging` 指针拖拽

## 解决什么问题

TiLayoutGrid 的面板拖拽调宽、TiTable 的列宽拖拽，都要处理同一套原生指针事件：在某个
元素上监听 `pointerdown`，按下后把 `pointermove`/`pointerup` 挂到 `body` 上，移动超过
阈值才算"真的开始拖"，移出监控区要能掐断，组件卸载要把监听器摘干净。每个控件自己写一遍
既要兼容触摸设备，又要管理 `body` 上的临时监听，很容易漏解绑。

`useDragging` 把这套指针拖拽骨架封装成一个 options 驱动的 hook，并导出 `Dragging`
上下文类——每次拖拽产生一个 `Dragging` 实例，承载起止坐标、位移、方向、速度与监控区，
控件只需在 `onMoving` 里读它来更新自己的布局。

## 输入 Props

本 hook 不消费组件 Props，而是接收 `DraggingOptions`（在本 hook 文件内声明）：

- **`getWatchTarget: () => HTMLElement`** —— 绑定 `pointerdown` 的监控根元素；必传。
- **`getViewport?: () => HTMLElement | Rect`** —— 拖拽坐标系的视口，缺省用
  `watchTarget`；`Dragging` 的相对坐标都基于它计算。
- **`getWatchZone?: (zone: Rect) => Rect`** —— 裁剪监控区；指针超出该区后不再更新点位。
- **`getDragTarget?: (el: HTMLElement) => HTMLElement | undefined`** —— 从事件 target
  换算真正的拖拽目标；返回 `undefined` 则本次不启用拖拽。
- **`onReady?: (ing: Dragging) => void`** —— 拖拽上下文刚建好（尚未越过激活阈值）时回调，
  此时仍可用 `ing.stopDragging()` 阻止后续拖拽。
- **`onStart?: (ing: Dragging) => void`** —— 越过 `activeDistance` 阈值、正式开始拖拽时回调。
- **`onMoving: (ing: Dragging) => void`** —— 每次指针移动都会调用；必传。
- **`onEnd?: (ing: Dragging) => void`** —— 拖拽正式激活后结束时回调。
- **`onDestroy?: (depose: Callback) => void`** —— 注册销毁函数（通常传组件的
  `onUnmounted`），组件卸载时摘除监控监听。

## 返回值 API

```ts
const release = useDragging(options);
```

- **`release(): void`** —— 返回值即销毁函数，手动调用可摘除 `watchTarget` 上的
  `pointerdown` 监听。

拖拽进行中，`onReady/onStart/onMoving/onEnd` 拿到的 `Dragging` 实例（`export` 自
`./drag/dragging.ts`）提供这些关键读数：

- **坐标系列**（都在 `onMoving` 时被刷新）
  - **`client: Point2D`** —— 指针的 window 坐标。
  - **`start: Point2D`** —— 按下时的起点。
  - **`move: Point2D`** —— 相对起点的位移。
  - **`offset: Point2D` / `compensation: Point2D`** —— 拖拽目标内的偏移 / 自动补偿点。
  - **`inview: Point2D` / `scale: Point2D`** —— 视口内坐标 / 相对视口的比例坐标。
- **状态**
  - **`activated: boolean`** —— 是否已越过激活阈值。
  - **`activeDistance: number`** —— 激活阈值，缺省 `5`px。
  - **`outOfWatch: boolean`** —— 当前指针是否在 `watchZone` 之外。
  - **`watchZone: Rect` / `viewport: Rect`** —— 监控区与视口矩形。
  - **`moveDistance / directionX / directionY / speed`** —— 移动距离、方向、速度。
- **方法**
  - **`update(client): boolean`** —— 内部按新坐标刷新上述读数，并在首次越阈值时触发
    `onActivated`；返回是否有有效更新。
  - **`stopDragging()`** —— 主动结束本次拖拽。
  - **`isDead()`** —— 是否已被标记终止。
  - **`release()`** —— 释放全部监听；内部会回调 `onRelease`。
  - **`autoSetCompensationByTarget()`** —— 按拖拽目标元素自动计算补偿点。

## 配合使用

- **与 `use-viewport`**：列宽/面板拖拽需要知道容器当前宽度来换算轨道宽度，`TiLayoutGrid`
  与 `TiTable` 都是先用 `useViewport` 拿到尺寸，再把宽度喂给布局计算。
- **典型用途**：`src/lib/shelf/layout/grid/use-grid-resizing.ts`（TiLayoutGrid 拖拽调轨）、
  `src/lib/view/table/use-table-resizing.ts`（TiTable 拖拽调列）。

```ts
// 在组件 onMounted 中接线
onMounted(() => {
  useDragging({
    getWatchTarget: () => dragBar.value!,           // 拖拽条元素
    getViewport: () => rootEl.value!,               // 以容器作为坐标系
    onReady: (ing) => {
      // 按下但还没拖：这里仍可按条件 ing.stopDragging()
    },
    onMoving: (ing) => {
      // 指针在移动：读位移更新列宽
      if (!ing.activated) return;
      colWidth.value = startWidth + ing.move.x;
    },
    onDestroy: onUnmounted,                         // 卸载时自动摘监听
  });
});
```

## 注意事项

- **监听挂在 `body`**：`pointermove` 以 capture 模式挂到 `ownerDocument.body`，
  `pointerup` 用 `{ once: true }`；`watchZone` 之外指针仍会触发 `onMoving`，由控件自己
  读 `ing.outOfWatch` 决定是否结束。
- **触摸设备**：源码用 `Dom.isTouchDevice()` 分支取 `Touch.touches[0]`；PC 端额外
  记录了 `POINTER_CLICK`（`click`）用于激活后拦截点击。
- **`onMoving` 里用 `ing.stopDragging()` 即可提前结束**，`onEnd` 只在"曾经激活过"时才会
  回调。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/use-dragging.ts` —— 本 hook 与 `DraggingOptions`。
  - `src/lib/_features/drag/dragging.ts` —— `Dragging` 上下文类实现。
  - `src/lib/shelf/layout/grid/use-grid-resizing.ts`、
    `src/lib/view/table/use-table-resizing.ts` —— 实际消费方。
- **相关文档**
  - 视口尺寸监听：[`use-viewport`](use-viewport.md)。
  - 消费组件：[TiLayoutGrid](../../30.components/shelf/ti-layout-grid.md)、
    [TiTable](../../30.components/view/ti-table.md)。
