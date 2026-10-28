---
title: use-docking 弹层停靠定位
keywords: [hook, useDocking, use-docking, docking, 停靠, 弹层定位, genDockingStyle, 象限, popover, 尺寸约束]
status: draft
---

# `use-docking` 弹层停靠定位

## 解决什么问题

日期选择、下拉弹层这类浮层，弹出位置要根据触发元素在视口中的位置自动选：元素靠近上边缘
就往下弹、靠近右边缘就右对齐，否则反过来。每个弹层组件自己算「目标元素在哪个象限、浮层
该放哪一侧、宽高约束多少」会重复且容易算错。

`useDocking` 输入一个取目标元素的函数与尺寸约束，输出一个 `genDockingStyle()`，调用即得
绝对定位样式。它目前被 `TiInputDate`、`TiInputDatetime` 的日期弹层使用。

## 输入 Props

`DockingOptions`（在 `use-docking.ts` 内声明，扩展自 `DockingProps`）：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `getElement` | `() => HTMLElement \| null \| undefined` | 取要停靠的目标元素 |
| `width / height` | `string` | 弹层宽高约束 |
| `minWidth / maxWidth` | `string` | 最小/最大宽度 |
| `minHeight / maxHeight` | `string` | 最小/最大高度 |
| `space` | `number` | 目标元素与弹层间距（px），注释声明默认 4 |

> `DockingProps` 同时也是 `DockingStyle` 的基础字段，由 hook 原样带回到结果样式里。

## 返回值 API

```ts
const dock = useDocking(options);
const style = dock.genDockingStyle();
```

- **`genDockingStyle(): DockingStyle`** —— 返回 `DockingProps & { top?, left?, right?, bottom? }`：
  - 取不到目标元素（或非元素）时返回 `{}`；
  - 否则用 `Rects.createBy` 算目标元素矩形与视口矩形，按 `win.getQuadrant(box)` 得出
    `top-left / top-right / bottom-left / bottom-right` 象限：
    - `top-left`：浮层在目标下方、左对齐，`maxWidth = 视口宽 - 元素左`；
    - `top-right`：下方、右对齐，`maxWidth = 元素右`；
    - `bottom-left`：上方、左对齐，`maxWidth = 视口右 - 元素左`；
    - `bottom-right`：上方、右对齐，`maxWidth = 元素右`；
  - 同时按象限重算 `maxHeight`，给视口边缘预留固定 4px 边框。

文件还单独导出纯函数 **`getDockingStyle(props, $el?, box?, win?)`**，不依赖 `getElement`，
可在已有矩形数据时直接调用。

## 配合使用

- **与弹层组件**：在弹层打开时调用 `genDockingStyle()`，把返回对象绑到浮层根节点的
  `:style`。
- **与 `Rects`**：矩形与象限计算复用 core 的 `Rects`，调用方不必自己写视口换算。

典型调用片段：

```ts
import { ref } from 'vue';
import { useDocking } from '../_features';

const anchorEl = ref<HTMLElement>();
const dock = useDocking({
  getElement: () => anchorEl.value, // 触发元素
  width: '320px',
  maxHeight: '480px',
});

// 弹层打开时计算一次停靠样式
const popupStyle = dock.genDockingStyle();
```

```xml
<!-- 浮层根节点绑停靠样式 -->
<div class="popup" :style="popupStyle">…</div>
```

## 注意事项

- **`space` 当前未接线**：`DockingOptions.space` 已声明（注释默认 4），但 `genDockingStyle`
  内部用硬编码 `boxBorder = 4`，并未读取 `options.space`；传入该值暂不生效，保留备用。
- **每次打开都要重算**：返回值是一次性样式对象，目标元素滚动或视口尺寸变化后需再次调用
  `genDockingStyle()`。
- **象限只决定上下与左右对齐**：不处理水平居中、自动翻转动画等高级策略。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/use-docking.ts` —— 本 hook 与纯函数 `getDockingStyle`。
  - `src/lib/input/date/TiInputDate.vue`、`src/lib/input/datetime/TiInputDatetime.vue` —— 消费方。
- **相关文档**
  - `DockingProps` 在共享 Props 体系中的位置：[共享 Props](../../10.concepts/02-common-props.md)。
