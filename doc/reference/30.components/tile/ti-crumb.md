---
title: TiCrumb 面包屑导航条
keywords: [面包屑, crumb, breadcrumb, TiCrumb, 导航, 路径导航, TILE]
status: draft
---

# TiCrumb 面包屑导航条

## 介绍

`TiCrumb` 是小片类（`TILE`）的面包屑导航条，用来在页面顶部或卡片头部展示「当前位置」的
层级路径，例如 `Plant / Tree / Pine Tree`。每一项可以带图标和文字，项与项之间用分隔符隔开，
点击任意一项会触发一次 `change`，由外层决定跳转到哪一级。

它不收集表单值、不弹出面板；层级数据来自 `data`，当前停在哪一级由 `value` 指定。除了中间的
路径项，还可以在头部 / 尾部插入一段说明文字（`head`、`tail`）或通过同名插槽完全替换。

使用时需要注意：

- 项的 ID 默认取数据对象的 `value` 字段（缺省回退 `id`），用 `getValue` 可以改取其他字段或
  自定义函数。
- 当前项由 `value` 与项 ID 相等判定，会被加上 `is-current` 样式类；不是最后一项才会渲染
  分隔符。
- 点击项时按 `emitValueType` 决定 `change` 载荷是 ID、标准项还是原始项；项 ID 为空时载荷
  固定为 `null`。

源码目录：`src/lib/tile/crumb/`。

## 例子

### JSON 配置

```json
{
  "data": [
    { "value": "a", "text": "Animal" },
    { "value": "dog", "text": "Dog" },
    { "value": "wangcai", "text": "Wang Cai" }
  ],
  "value": "wangcai"
}
```

### Vue 标签调用

```xml
<TiCrumb
  :data="[
    { value: 'a', text: 'Animal' },
    { value: 'dog', text: 'Dog' },
    { value: 'wangcai', text: 'Wang Cai' }
  ]"
  value="wangcai"
  @change="onNavigate"
/>
```

## 控件参数

### 数据

- **`data`（`Vars[]`，无默认值）**：面包屑层级数据数组，每项是一个原始数据对象；会经
  `getIcon / getText / getTip / getValue` 归一化成标准选项项后渲染。
- **`value`（`TableRowID | null | undefined`，无默认值）**：当前选中项的 ID，与某一项 ID
  相等时该项标记为当前级（`is-current`）。
- **`getValue`（`string | ((it: Vars) => TableRowID)`，无默认值）**：从原始数据对象取项 ID
  的方式；传字符串按路径取字段，传函数自定义；缺省时取 `it.id || it.value`。
- **`getIcon`（`string | Convertor<Vars, IconInput | undefined>`，无默认值）**：从原始对象取
  每项前缀图标，默认取 `icon` 字段。
- **`getText`（`string | Convertor<Vars, string | undefined>`，无默认值）**：从原始对象取每项
  文字，默认取 `text`（回退 `title`、`nickname`）字段。
- **`getTip`（`string | Convertor<Vars, string | undefined>`，无默认值）**：从原始对象取每项
  悬浮提示，写到项的 `data-tip`，默认取 `tip` 字段。
- **`emptyRoadblock`（`{ text?: string; icon?: IconInput }`，无默认值）**：没有数据项时的占位
  信息；类型已声明，当前版本视图未接线，保留备用。

### 行为

- **`emitValueType`（`"id" | "std-item" | "raw-item"`，默认 `"id"`）**：点击项时 `change`
  载荷形态——`"id"` 发项 ID，`"std-item"` 发归一化后的标准项，`"raw-item"` 发深拷贝后的原始
  数据对象。

### 外观

- **`type`（`LogicType`，无默认值）**：项的状态色，映射到 `--ti-color-*` 系列变量。
- **`separator`（`IconInput`，默认 `"zmdi-chevron-right"`）**：项之间的分隔符；最后一项后面
  不渲染。
- **`sepType`（`CrumbItemSepType`，无默认值）**：分隔符形态，`"icon"` 把 `separator` 当图标
  渲染，`"text"` 当文字渲染；缺省按 `"icon"`。
- **`itemFontSize`（`AspectSize`，无默认值）**：项字号分级 `t / s / m / b / h`，映射到
  `--ti-fontsz-*`。
- **`itemPadding`（`AspectSize`，无默认值）**：项内边距分级。
- **`itemRadius`（`AspectSize`，无默认值）**：项圆角分级。
- **`currentItemStyle`（`Vars`，无默认值）**：当前项追加的内联样式，合并进当前项的 `style`。
- **`currentItemClass`（`string`，无默认值）**：当前项追加的样式类；类型已声明，当前版本视图
  未消费，保留备用。

### 回调

本组件无此组参数。

### 嵌套

- **`head`（`TextSnippetProps`）**：路径条头部一段说明文字，内部用 `TiTextSnippet` 渲染；
  传对象时按 `v-bind` 展开。
- **`tail`（`TextSnippetProps`）**：路径条尾部一段说明文字，渲染方式同 `head`。
- **`head` 插槽**：声明后替换默认的 `head` 渲染内容。
- **`tail` 插槽**：声明后替换默认的 `tail` 渲染内容。

### 事件

- **`change`**：点击某个面包屑项时触发；载荷形态由 `emitValueType` 决定（ID / 标准项 / 原始
  项），项 ID 为空时载荷固定为 `null`。

> 本组件同时继承 `CommonProps`（`className`、`style`），字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)，本篇不再罗列。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单面包屑（`simple`）

**JSON 配置**

```json
{
  "itemFontSize": "m",
  "itemPadding": "m",
  "itemRadius": "m",
  "type": "success",
  "data": [
    { "value": "plant", "text": "Plant" },
    { "value": "tree", "text": "Tree" },
    { "value": "pine", "text": "Pine Tree" }
  ],
  "value": null
}
```

**Vue 标签**

```xml
<TiCrumb
  item-font-size="m"
  item-padding="m"
  item-radius="m"
  type="success"
  :data="[
    { value: 'plant', text: 'Plant' },
    { value: 'tree', text: 'Tree' },
    { value: 'pine', text: 'Pine Tree' }
  ]"
  :value="null"
/>
```

### 带图标（`with-icon`）

**JSON 配置**

```json
{
  "itemFontSize": "m",
  "itemPadding": "m",
  "itemRadius": "m",
  "type": "success",
  "data": [
    { "value": "a", "text": "Animal", "icon": "fas-paw" },
    { "value": "dog", "text": "Dog", "icon": "fas-dog" },
    { "value": "W_C", "text": "Wang Cai", "icon": "fas-shield-dog" }
  ],
  "value": "W_C"
}
```

**Vue 标签**

```xml
<TiCrumb
  item-font-size="m"
  item-padding="m"
  item-radius="m"
  type="success"
  :data="[
    { value: 'a', text: 'Animal', icon: 'fas-paw' },
    { value: 'dog', text: 'Dog', icon: 'fas-dog' },
    { value: 'W_C', text: 'Wang Cai', icon: 'fas-shield-dog' }
  ]"
  value="W_C"
/>
```

### 定制头部（`with-head`）

**JSON 配置**

```json
{
  "head": {
    "comType": "TiButton",
    "comConf": { "text": "Click Me ^_^" },
    "events": { "click-button": true }
  },
  "type": "danger",
  "data": [
    { "value": "a", "text": "Animal", "icon": "fas-paw" },
    { "value": "dog", "text": "Dog", "icon": "fas-dog" },
    { "value": "W_C", "text": "Wang Cai", "icon": "fas-shield-dog" }
  ],
  "value": "W_C"
}
```

**Vue 标签**

```xml
<TiCrumb
  type="danger"
  :data="[
    { value: 'a', text: 'Animal', icon: 'fas-paw' },
    { value: 'dog', text: 'Dog', icon: 'fas-dog' },
    { value: 'W_C', text: 'Wang Cai', icon: 'fas-shield-dog' }
  ]"
  value="W_C"
>
  <template #head>
    <TiButton text="Click Me ^_^" @click-button="onHead" />
  </template>
</TiCrumb>
```

## 总结

`TiCrumb` 适合展示一层可读的导航路径并响应当前级点击：详情页面包屑、文件目录路径、分类
逐级回溯。它只做线性路径展示，不支持折叠、下拉溢出或树形展开；`head` / `tail` 只适合塞一段
说明文字或单个按钮，复杂操作区请另配 `TiActionBar`。`currentItemClass` 与 `emptyRoadblock`
当前版本尚未接线，等后续版本生效。

## 延伸阅读

- **源码入口**
  - `src/lib/tile/crumb/ti-crumb-index.ts` —— 注册表信息与示例配置。
  - `src/lib/tile/crumb/ti-crumb-types.ts` —— `CrumbProps`、`CrumbEmitter`、`CrumbItem`。
  - `src/lib/tile/crumb/TiCrumb.vue` —— 视图与头 / 尾插槽。
  - `src/lib/tile/crumb/use-ti-crumb-api.ts` —— 项归一化、当前级判定与点击分发。
- **相关文档**
  - 项数据到图 / 文 / 提示的归一化规则：`src/lib/_features/use-std-list-item.ts`。
  - 状态色与尺度变量：[样式系统](../../10.concepts/05-style-system.md)。
  - 头尾说明文字：[TiTextSnippet 文字片段](./ti-text-snippet.md)。
