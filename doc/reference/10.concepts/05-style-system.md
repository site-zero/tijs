---
title: 样式体系
keywords: [样式, SCSS, CSS变量, 主题, light, dark, comfy, tight, mixin, liveStyle, CssUtils]
status: draft
---

# 样式体系

## 要解决的问题

这套组件如果各自写死颜色、圆角、间距、字号，亮暗主题切换、密度调整都会变成灾难。
TiJS 的样式体系把**颜色、尺度、布局**抽成 CSS 变量与 SCSS mixin：组件只引用变量和 mixin，
主题与密度通过给 `<html>` 加类名整体切换。

## 解决思路

### 样式入口

业务项目样式表引入两行即可：

```scss
@use "@site0/tijs/sass/_all.scss" as *;   // 暴露全部 mixin / 函数
@use "@site0/tijs/sass/app.scss";        // 全局基础样式与主题变量装配
```

- `_all.scss` 只 `@forward` 内部的 `_mixins.scss`，提供编译期可用的 mixin 与函数。
- `app.scss` 依次 `@use` 颜色主题、尺度档位与功能类，在 `:root` 上装配默认的
  **亮色 + 宽松（comfy）** 变量，并定义全局基础排版、滚动条、链接、表单控件等规则。

### 分层结构

```text
app.scss
 ├── color/light.scss   use_color_theme_light   亮色变量集合
 ├── color/dark.scss    use_color_theme_dark    暗色变量集合
 ├── measure/comfy.scss use_measure_comfy       宽松尺度（:root 默认）
 ├── measure/tight.scss use_measure_tight       紧凑尺度（html.tight 时覆盖）
 └── feature/*.scss     通用功能类（前缀框、路障、过渡、彩色文字）

html.dark          → @include use_color_theme_dark
html.tight         → @include use_measure_tight
html.auto-color-mode → 按 prefers-color-scheme 自动选择亮/暗
```

### 颜色变量

颜色按"区域 + 状态"命名，统一前缀 `--ti-color-`：

- **区域色**：`sky / foot / chute / body / card / menu / bar / tab / box`，
  每个区域配套 `-f`（前景文字色）。
- **状态色**：`primary / secondary / success / warn / info / danger / track /
  disable / star / nil / text / number / tip` 等，每个状态有三档：
  - 无后缀：主色；
  - `-b`：边框/亮一档；
  - `-r`：浅一档背景（反色文字用）。
- **遮罩**：`mask-heavy / bushy / thin / weak`，按不透明度分级。
- **边框**：`border-shallow / thin / weak / dark`；**链接**：`link / link-hover`。

组件样式不直接写十六进制色值，而是引用 `var(--ti-color-...)`；切换 `html.dark` 时
整套变量由暗色主题覆盖。

### 尺度变量

尺度同样分组成 `--ti-measure-*`、`--ti-gap-*`、`--ti-box-pad-*`、`--ti-iconsz-*`、
`--ti-fontsz-*`，每一组按 `t / s / m / b / h`（极小/小/中/大/超大）分级：

- **圆角**：`--ti-measure-r-h / b / m / s / t / none`。
- **控件盒**：`--ti-measure-box-pad`、`--ti-measure-box-height`、`--ti-measure-box-icon`。
- **间距**：`--ti-gap-t / s / m / b / h`；**内边距**：`--ti-box-pad-t / s / m / b / h`。
- **图标尺寸**：`--ti-iconsz-t / s / m / b / h`；**字号**：`--ti-fontsz-t / s / m / b / h`
  以及页面、表单、标签、表头专用字号。

### 通用 mixin 与函数

`_mixins.scss` 提供组件 SCSS 里直接 `@include` 的能力，主要分组：

- **尺度函数**：`SZ($sz)` 把数值换算为像素。
- **弹性布局**：`flex`、`flex-center`、`flex-full`、`flex-align`、`flex-align-nowrap`、
  `flex-align-v` 等一组方向与对齐组合。
- **字体**：`font`、`font-nice`、`font-fixed`、`font-sizes`。
- **定位**：`pos`、`pos-abs`、`pos-fixed`、`pos-abs-full`、`pos-fixed-full`。
- **颜色盒**：`color-box($name)`、`color-box-r($name)`、`button($name)`、`colorized()`。
- **分级属性批量生成**：`aspect_fontsize / aspect_gap / aspect_pad / aspect_radius /
  aspect_color` 系列，按 `t/s/m/b/h` 批量输出类名。
- **层级常量**：`$z-above / $z-cover / $z-over / $z-mask / $z-menu / $z-top`。

### 功能类（`feature/`）

- **`prefix-suffix-box.scss`** —— 前后缀输入框的 grid 布局，配合 `has-prefix`、
  `no-suffix` 等状态类切换列模板。
- **`roadblock.scss`** —— 占位/加载路障容器与图标、文字分区。
- **`transition.scss`** —— `trans-box` 等过渡类。
- **`colorized.scss`** —— `color-as-success / warn / info / error` 等文字色工具类。

### 组件内样式与 JS 侧样式合并

组件单文件的 `<style lang="scss" scoped>` 同样先 `@use "@site0/tijs/sass/_all.scss" as *;`，
再使用 mixin 与变量。JS 侧的类名与内联样式由 `CssUtils` 合并：

- **`CssUtils.mergeClassName(...)`** —— 合并静态类、状态类与 `className` Props。
- **`CssUtils.toStyle(style)`** —— 把 `style` Props 规范化为样式对象。

Playground 演示区的额外尺寸/样式来自注册表 `TiComInfo.liveStyle`，在演示容器上叠加，
不影响组件自身样式定义。

## 关键细节

- **`app.scss` 只引入一次**：重复 `@use` 不会重复输出规则，但全局基础样式只应装配一次。
- **`tight` 目前为空覆盖**：`measure/tight.scss` 的 `use_measure_tight` 暂未定义变量，
  紧凑主题属于预留档位。
- **组件 Props 里的 `boxFontSize / boxPadding / boxRadius`** 等分级属性，最终映射到
  对应 `--ti-fontsz-* / --ti-box-pad-* / --ti-measure-r-*` 变量（见按钮组件范本）。
- **不要在组件样式里硬编码色值**；需要新颜色时先判断能否复用现有状态色变量。

## 主要代码入口

- `src/assets/style/app.scss` —— 全局装配入口。
- `src/assets/style/_all.scss`、`_mixins.scss` —— mixin 与函数集合。
- `src/assets/style/color/light.scss`、`color/dark.scss` —— 两套颜色主题。
- `src/assets/style/measure/comfy.scss`、`measure/tight.scss` —— 两套尺度档位。
- `src/assets/style/feature/` —— 通用功能类。
- `src/core/web/web-css-utils.ts` —— JS 侧 `CssUtils` 类名/样式合并工具。

## 延伸阅读

- 组件 Props 中的 `className`、`style`：[共享 Props](02-common-props.md)。
- 注册表演示样式 `liveStyle`：[组件模型](01-component-model.md)。
- `CssUtils` 函数级清单：[Web 浏览器 DOM 工具](../20.core-utils/140-web.md)。
