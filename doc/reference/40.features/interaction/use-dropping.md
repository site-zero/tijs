---
title: use-dropping 文件拖放
keywords: [hook, useDropping, use-dropping, drop, dragover, dragenter, 文件拖放, FileList, 上传区]
status: draft
---

# `use-dropping` 文件拖放

## 解决什么问题

把文件从系统资源管理器拖进网页，需要在目标元素上监听 `dragenter`/`dragover`/`drop`，
并且每个事件都要 `preventDefault` 才能真正接住；拖动进入后还要监听 `body` 上的
`dragover` 来区分"还在目标内"与"已经拖出去"，最后 `pointerup` 或离开文档时清理监听。
这套原生 HTML5 DnD 样板写在上传区（`TiUpload`）与图片组件（`TiImage`）里重复了一遍。

`useDropping` 把这套监听挂接与清理封成一个函数：调用一次它返回的注册函数，目标元素上
的拖放监听就接好了，拖动过程的进入/悬停/离开/落下都通过回调暴露。

## 输入 Props

本 hook 不消费组件 Props，而是接收 `DropFileOptions`（在本 hook 文件内声明）：

- **`target: () => HTMLElement | null`** —— 取拖放目标元素的函数；注册时与每次
  `drop` 结束后都会重新调用一次，便于响应式元素引用。
- **`enter?: (el: HTMLElement, src: HTMLElement) => void`** —— 拖动进入目标时回调；
  `el` 为目标元素，`src` 为事件当前命中元素。首次进入时才会顺带开启 `body` 级监听。
- **`over?: (el, src) => void`** —— 拖动悬停在目标内部时回调。
- **`leave?: (el, src) => void`** —— 拖动离开目标、或 `pointerup`、或文档 `mouseleave`
  时回调。
- **`drop?: (files?: FileList) => void`** —— 真正落下时回调，参数为
  `event.dataTransfer.files`。

## 返回值 API

```ts
const register = useDropping(options);
```

- **`register(): void`** —— 返回值即注册函数：它重新取一次 `target()`，在该元素上
  绑定 `dragenter`/`dragover`/`drop` 的 `preventDefaults`，以及 `dragenter → onEnter`、
  `drop → onDrop`。先 `removeEventListener` 再 `addEventListener`，重复调用安全。

内部生命周期（无需调用方关心）：

- 首次 `enter` 后，hook 在 `body` 上挂 `dragover`（命中仍在目标内则走 `over`，否则走
  `leave`）与 `pointerup`，在 `ownerDocument` 上挂 `mouseleave`，用于感知"拖出去了"。
- `drop`、`pointerup`、文档 `mouseleave` 任一触发后，hook 自动 `depose()` 摘除
  `body`/文档级监听。

## 配合使用

- **与上传控件**：`src/lib/tile/upload/_support/use-uploader.ts` 用本 hook 接住拖入的
  `FileList`，再走自己的上传管线；`TiImage.vue` 直接用它实现拖图替换预览。

```ts
// 组件 setup 内：目标元素引用就绪后注册拖放
const registerDrop = useDropping({
  target: () => dropZone.value,                 // 拖放目标容器
  enter: (el) => el.classList.add("drag-over"),
  leave: (el) => el.classList.remove("drag-over"),
  drop: (files) => {
    // 拿到拖入的文件列表，交给上传逻辑
    if (files && files.length > 0) uploadFiles(files);
  },
});

onMounted(() => registerDrop());               // 元素渲染后完成绑定
```

## 注意事项

- **`drop` 回调拿到的是 `FileList`**：不是数组，遍历请用 `for (let i = 0; i < files.length; i++)`。
- **离开感知靠 `body` 级监听**：目标元素上的 `dragleave` 在子元素间反复进出会抖动，
  本 hook 改为在 `body.dragover` 里用 `el.contains(e.target)` 判断是否仍在目标内。
- **没有自动销毁注册**：本 hook 不返回卸载函数；如果目标元素会被 v-if 销毁，建议在
  `onUnmounted` 里自行不再调用 `register()`，或保证 `target()` 返回 `null` 后不再触发。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/use-dropping.ts` —— 本 hook 与 `DropFileOptions`。
  - `src/lib/tile/upload/_support/use-uploader.ts` —— 上传管线消费方。
  - `src/lib/tile/image/TiImage.vue` —— 图片预览拖入消费方。
- **相关文档**
  - 消费组件：[TiImage](../../30.components/tile/ti-image.md)、
    [TiUploadTile](../../30.components/tile/ti-upload-tile.md)。
