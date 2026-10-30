---
title: TiProgressBar 进度条
keywords: [进度条, progress, progress-bar, TiProgressBar, 百分比, 水平, 垂直, TILE]
status: draft
---

# TiProgressBar 进度条

## 介绍

`TiProgressBar` 是小片类（`TILE`）的纯展示进度条，用一条轨道 + 一段填充指示条把当前完成
比例可视化。它可以水平或垂直放置，末端显示百分比文字，适合上传、加载、任务完成度等只读
进度展示。

它不交互、不收集输入；进度来自 `value`，按 `range` 换算成 0~1 的比例后填充。

使用时需要注意：

- `value` 会被 `clamp` 到 `range` 边界；默认 `range` 是 `[0, 1]`，所以 `value` 通常传
  `0~1` 的小数（如 `0.4`）。
- 百分比文字用 `Str.toPercent` 生成；`tipAt: "none"` 不显示文字。
- `type` 只决定配色（叠加 `is-<type>` 类），不改变进度计算。

源码目录：`src/lib/tile/progress-bar/`。

## 例子

### JSON 配置

```json
{
  "value": 0.4
}
```

### Vue 标签调用

```xml
<TiProgressBar :value="0.4" />
```

## 控件参数

### 数据

- **`value`（`number`，默认 `0`）**：当前进度值；按 `range` 归一化成 0~1 后填充指示条。
- **`range`（`[number, number]`，默认 `[0, 1]`）**：进度值的取值范围，`value` 超出边界按
  边界计算，再折算成填充比例。

### 行为

本组件无此组参数（纯展示，不响应交互）。

### 外观

- **`type`（`LogicType`，无代码默认值）**：进度条状态色，叠加 `is-<type>` 类。
- **`mode`（`ProgressBarMode`，默认 `"H"`）**：`"H"` 水平进度条，`"V"` 垂直进度条。
- **`tipAt`（`ProgressBarTipPosition`，默认 `"center"`）**：百分比文字位置，可取
  `"none" | "top" | "bottom" | "left" | "right" | "center"`；`"none"` 不显示。
- **`style`（`Vars`，无默认值）**：根容器追加的内联样式。
- **`trackStyle`（`Vars`，无默认值）**：轨道（未填充部分）追加的内联样式。
- **`indicatorStyle`（`Vars`，无默认值）**：指示条（已填充部分）追加的内联样式；宽度 / 高度
  由进度计算，会与你的样式合并。
- **`tipStyle`（`Vars`，无默认值）**：百分比文字容器追加的内联样式。
- **`trackClass`（`any`，无默认值）**：轨道追加的样式类。
- **`indicatorClass`（`any`，无默认值）**：指示条追加的样式类。
- **`tipClass`（`any`，无默认值）**：百分比文字容器追加的样式类。

### 回调

本组件无此组参数。

### 嵌套

本组件未提供插槽，进度与文字全部由 `value` / `range` 计算得出，不支持通过 slot 替换内部
结构。

### 事件

本组件无对外声明的 `emit` 事件。

> 本组件同时继承 `CommonProps`（`className`、`style`），字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)，本篇不再罗列。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 水平进度条（`horizontal`）

**JSON 配置**

```json
{
  "value": 0.4
}
```

**Vue 标签**

```xml
<TiProgressBar :value="0.4" />
```

### 垂直进度条（`vertical`）

**JSON 配置**

```json
{
  "mode": "V",
  "value": 0.8,
  "tipAt": "bottom"
}
```

**Vue 标签**

```xml
<TiProgressBar mode="V" :value="0.8" tip-at="bottom" />
```

### 彩色进度条（`colorized`）

**JSON 配置**

```json
{
  "value": 0.334,
  "type": "danger"
}
```

**Vue 标签**

```xml
<TiProgressBar :value="0.334" type="danger" />
```

## 总结

`TiProgressBar` 适合只读展示一个完成比例：任务进度、上传进度、配额占用。它不带取消、暂停、
按钮等交互；需要带文件名、百分比和操作按钮的上传过程展示，请改用 `TiUploadBar`。`range`
不限于 `[0,1]`，需要按真实数值区间（如 `[0, 200]`）展示时直接传 `range` 即可。

## 延伸阅读

- **源码入口**
  - `src/lib/tile/progress-bar/ti-progress-bar-index.ts` —— 注册表信息与示例配置。
  - `src/lib/tile/progress-bar/ti-progress-bar-types.ts` —— `ProgressBarProps`、`ProgressBarMode`、`ProgressBarTipPosition`。
  - `src/lib/tile/progress-bar/TiProgressBar.vue` —— 进度归一化与水平 / 垂直布局。
- **相关文档**
  - 带上传交互的进度展示：[ti-upload-bar](ti-upload-bar.md)。
  - 状态色变量：[样式系统](../../10.concepts/05-style-system.md)。
