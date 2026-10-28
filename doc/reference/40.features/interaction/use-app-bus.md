---
title: use-app-bus 应用级消息总线
keywords: [hook, createAppBus, watchAppResize, use-app-bus, TiAppBus, 消息总线, BUS, APP_RESIZE, AppEvents]
status: draft
---

# `use-app-bus` 应用级消息总线

## 解决什么问题

应用级弹层（`TiAppModal`）打开时，需要一个全局消息通道让内部子控件感知"应用窗口尺寸变了"、
"滚动了"这类跨层级事件；这个通道还要在弹层关闭时彻底销毁，不能泄漏到下一次打开。

`use-app-bus` 模块提供两个函数：`createAppBus` 创建一个挂载到环境变量 `BUS` 的事件总线并
注册销毁回调；`watchAppResize` 把 window 的 `resize` 转发成 `AppEvents.APP_RESIZE` 事件。
当前只被 `TiAppModal` 使用。

## 输入 Props

本模块导出的不是 `use*` hook，而是两个工厂/接线函数，均不消费组件 Props：

- **`createAppBus(deposer: (hook: () => void) => void): TiAppBus`**
  - `deposer` 通常传组件的 `onUnmounted`；hook 会把"清空 `BUS` 环境变量 + `bus.depose()`"
    注册进去。
- **`watchAppResize(bus: TiAppBus, win = window): void`**
  - 在 `win` 上监听 `resize`，转发为 `AppEvents.APP_RESIZE`（载荷 `undefined`）。

## 返回值 API

- **`createAppBus` 返回 `TiAppBus`** —— 通过 `createBus<any>()` 创建（core `_top` 命名空间，
  见[顶层工具](../../20.core-utils/160-top.md)），同时 `setEnv('BUS', bus)` 写入环境，
  供 `TiAppBus` 类型的 `provide`/注入使用。
- **`watchAppResize` 无返回值**，副作用是绑定 window 的 `resize` 监听；当前未单独做卸载
  摘除，随 `createAppBus` 的销毁一起回收总线。

## 配合使用

```ts
// TiAppModal setup 内
import { provide } from "vue";

const bus = createAppBus(onUnmounted);   // 建总线并在卸载时清空 BUS
provide(BUS_KEY, bus);                   // 注入给内部子控件
watchAppResize(bus);                     // window resize → APP_RESIZE
```

## 注意事项

- **`createAppSubBus` 在源码中被整段注释**：类型已声明（`AppEvents.APP_RESIZE`、
  `AppEvents.APP_SCROLL`），当前版本未接线，保留备用。
- **当前无组件之外的通用消费方**：仓库内除 `TiAppModal.vue` 外，没有其他组件直接调用
  `createAppBus` / `watchAppResize`。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/use-app-bus.ts` —— 本模块。
  - `src/lib/_modal/TiAppModal.vue` —— 当前唯一消费方。
- **相关文档**
  - `createBus`/`setEnv` 的 core 实现：[顶层工具 `_top`](../../20.core-utils/160-top.md)。
