---
title: TiInputPassword 密码输入框
keywords: [密码, password, TiInputPassword, 密码强度, 遮蔽输入, 显示隐藏密码]
status: draft
---

# TiInputPassword 密码输入框

## 介绍

`TiInputPassword` 是输入类（`INPUT`）的密码输入框：输入内容默认以圆点遮蔽，带一个眼睛图标
切换明文 / 密文，并在框下展示一条密码强度指示条（很弱 → 很强五档）。

使用时需要注意：

- 强度档位按输入长度划分，弱档阈值由 `weakSize` 控制。
- 不需要强度条或切换按钮时，用 `showIndicator` / `allowToggleVisible` 关掉。

源码目录：`src/lib/input/passwd/`。

## 例子

### JSON 配置

```json
{
  "value": "",
  "placeholder": "Please input password"
}
```

### Vue 标签调用

```xml
<TiInputPassword value="" placeholder="Please input password" @change="onChange" />
```

## 控件参数

### 数据

- **`value`（`string | null`）**：密码值。
- **占位文本**：`placeholder`、`autoI18n` 见 [共享 Props](../../10.concepts/02-common-props.md)。

### 行为

- **`readonly`（`any`）**：只读条件，见 [共享 Props](../../10.concepts/02-common-props.md)。
- **`allowToggleVisible`（`boolean`，默认 `true`）**：是否允许通过眼睛图标切换明文 / 密文。
- **`autoSelect`（`boolean`）**：聚焦后是否自动选中内容。
- **`weakSize`（`number`，默认 `8`）**：弱档长度阈值，小于该长度视为最弱档。

### 外观

- **`showIndicator`（`boolean`，默认 `true`）**：是否显示密码强度指示条。
- **`width`（`number | string`）**：输入框宽度。
- **`inputStyle`（`Vars`）**：输入元素追加内联样式。
- **`type` / `boxFontSize` / `boxPadding` / `boxRadius` / `hideBorder` 等**：来自 `BoxAspectProps`，
  与 `TiInput` 外观字段一致，见 [样式系统](../../10.concepts/05-style-system.md)。

### 回调

本组件无此组参数。

### 嵌套

本组件未提供插槽，内容由 `value` 与上述图标 / 指示条属性决定。

### 事件

- **`change`**：载荷为新密码（`string | null`）；编辑提交时触发。

> 本组件继承 `CommonProps`（`className`、`style`），字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单密码框（`simple`）

**JSON 配置**

```json
{
  "value": "",
  "placeholder": "Please input password"
}
```

**Vue 标签**

```xml
<TiInputPassword value="" placeholder="Please input password" />
```

## 总结

`TiInputPassword` 专用于密码录入：需要普通文本用 `TiInputText`，需要可输入候选用 `TiInput`。
强度指示仅按长度粗分，不做字符复杂度分析，高安全场景需自行叠加校验。

## 延伸阅读

- **源码入口**
  - `src/lib/input/passwd/ti-input-password-index.ts` —— 注册表信息与示例配置。
  - `src/lib/input/passwd/ti-input-password-types.ts` —— `InputPasswordProps`、`InputPasswordEmitter`。
  - `src/lib/input/passwd/TiInputPassword.vue` —— 视图与强度计算。
  - `src/lib/input/passwd/use-ti-input-password-api.ts` —— 明文切换与强度分级。
- **相关文档**
  - 基础输入框外观：[ti-input](ti-input.md)。
  - 状态色与尺度变量：[样式系统](../../10.concepts/05-style-system.md)。
