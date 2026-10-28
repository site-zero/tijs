---
title: use-defer-list 延迟处理队列
keywords: [hook, useDeferList, use-defer-list, defer, 延迟队列, blur, 防抖, change, 选项选择]
status: draft
---

# `use-defer-list` 延迟处理队列

## 解决什么问题

带下拉选项的输入框有个经典矛盾：失焦或值变化时本该收起选项、清空状态，但用户点选项这一下，
会先触发 `blur`/`change`，再触发选项的 `click`——如果立刻执行清理，选项的 DOM 就没了，
选择也就落空。常见解法是把"清理动作"先存起来，等确认不是去点选项时再统一执行。

`useDeferList` 就是一个最小的延迟队列：`addDefer` 把函数压进去，`tryDeferList` 依次执行
（异步函数会被 `await`），`clearDefer` 直接丢弃。当前被 InputBox3 与组合输入框
（`use-ti-input-box3-api.ts`、`use-input-combo-api.ts`）用来挂起失焦清理。

## 输入 Props

无 Props、无参数：

```ts
const defer = useDeferList();
```

内部用一个 `ref<Function[]>` 保存待执行函数，不接受外部配置。

## 返回值 API

- **`addDefer(deferFn: Function): void`** —— 把一个待执行函数压入队列。
- **`clearDefer(): void`** —— 丢弃队列里所有待执行函数（数下一轮再重新累积）。
- **`tryDeferList(): Promise<void>`** —— 依次执行队列里的每个函数；用 `isAsyncFunc`
  判断，异步函数会 `await`，同步函数直接调用；执行完后清空队列。

## 配合使用

- **典型时序**（源码注释给出的四种触发源）：
  1. 点击输入框以外区域 → 需要延迟处理所有 defer；
  2. 点击选项 → 先触发 `change/blur`，此时 defer 保留下来，选项 DOM 不被销毁，
     在选择选项的逻辑里可以无视这些 defer；
  3. 回车 / Tab → 立即处理，不等下一轮。

```ts
const defer = useDeferList();

// blur / change 时：先把清理动作挂起
function onBlur() {
  defer.addDefer(() => closeOptions());
  defer.addDefer(() => syncValueToModel());
}

// 用户点击选项：取消挂起的清理，直接完成选择
function onPickOption(item) {
  defer.clearDefer();                 // 放弃失焦清理
  applyOption(item);
}

// 回车：立即执行队列，不再等待
async function onEnter() {
  await defer.tryDeferList();
}
```

## 注意事项

- **队列只执行一次**：`tryDeferList` 跑完即清空；想再次延迟，需要重新 `addDefer`。
- **异步函数被 `await`**：队列是顺序执行的，前一个异步 defer 不结束不会执行下一个。
- **当前只在两个输入类内部 api 中消费**：仓库内没有其他组件直接使用。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/use-defer-list.ts` —— 本 hook。
  - `src/lib/input/box3/use-ti-input-box3-api.ts`、
    `src/lib/input/combo/use-input-combo-api.ts` —— 实际消费方。
- **相关文档**
  - 消费组件：[TiInputCombo](../../30.components/input/ti-input-combo.md)。
