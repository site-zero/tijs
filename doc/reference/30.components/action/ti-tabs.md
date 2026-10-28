---
title: TiTabs 标签组
keywords: [标签页, 页签, tabs, tab, TiTabs, 切换, 选项卡, tab bar]
status: draft
---

# TiTabs 标签组

## 介绍

`TiTabs` 是动作类（`ACTION`）的水平页签条，把一组选项渲染成一排可点击的标签，
点击后通过 `change` 事件抛出当前选中项。它只负责标签条本身，不负责切换标签下方
的内容面板——内容切换由调用方根据 `change` 事件自行处理。

标签条支持顶部 / 底部两种位置、左 / 中 / 右对齐、超长时左右滚动按钮、每个标签
最大宽度限制，以及通过 `keepTab` 在本地记忆上次选中项。

使用时需要注意：

- 当前选中项由 `value` 与 `options` 中每项的 `value`（缺省为数组下标）匹配决定；
  组件不直接修改 `value`，需要调用方在 `change` 事件里回写。
- 标签过多超出容器宽度时，会在两侧自动出现左右滚动箭头；开启 `wrapTabs` 则改为
  换行排列。
- 声明 `keepTab` 后，组件挂载时会从本地存储读取上次选中值，若仍存在于
  `options` 中，会主动 `emit("change", it)` 触发一次回写。

源码目录：`src/lib/action/tabs/`。

## 例子

### JSON 配置

```json
{
  "tabsAt": "top",
  "tabsAlign": "left",
  "value": 1,
  "options": [
    { "icon": "zmdi-cast-connected", "text": "标签 0" },
    { "icon": "zmdi-favorite", "text": "标签 1" },
    { "text": "标签 2" }
  ]
}
```

### Vue 标签调用

```xml
<TiTabs
  tabs-at="top"
  tabs-align="left"
  :value="1"
  :options="[
    { icon: 'zmdi-cast-connected', text: '标签 0' },
    { icon: 'zmdi-favorite', text: '标签 1' },
    { text: '标签 2' }
  ]"
  @change="onTabChange"
/>
```

## 控件参数

### 数据

- **`value`（`any`，无默认值）**：当前选中项的值；与 `options` 中某项的 `value`
  （缺省为数组下标）相等时，该项高亮为当前标签。
- **`options`（`AnyOptionItem[]`，必填）**：标签选项列表；每项可包含 `value`、
  `text`、`icon`、`className`、`style`。

### 行为

- **`defaultTab`（`string | number`，无默认值）**：类型中已声明，当前版本视图
  未接线，保留备用。
- **`keepTab`（`KeepInfo`，无默认值）**：本地记忆上次选中项的配置；开启后组件
  挂载时会尝试从本地存储恢复当前标签并触发一次 `change`。

### 外观

- **`tabsAt`（`"top" | "bottom"`，默认 `"top"`）**：标签条位于内容区的上方还是
  下方。
- **`tabsAlign`（`"left" | "right" | "center"`，默认 `"left"`）**：标签在容器内
  的横向对齐。
- **`wrapTabs`（`boolean`，默认 `false`）**：标签过多时是否换行排列；关闭时
  改为横向滚动并出现左右箭头。
- **`tabItemSpace`（`AspectSize`，默认 `"m"`）**：标签之间的间距分级
  `t / s / m / b / h`。
- **`tabMaxWidth`（`string | number`，无默认值）**：单个标签的最大宽度；超出时
  标签内容省略号截断。

### 回调

本组件无用户回调函数；标签切换全部通过 `change` 事件向外抛出。

### 嵌套

本组件未提供插槽；标签内容由 `options` 数据驱动，不支持通过 slot 自定义单个标签
的渲染。

### 事件

- **`change`**：载荷为 `(current: TabDisplayItem, old?: TabDisplayItem)`；
  点击某个非当前标签时触发。`TabDisplayItem` 在标准选项基础上额外携带
  `className`、`style`、`current`、`index`。开启 `keepTab` 且本地存储命中时，
  组件挂载也会触发一次 `change`。

> 本组件同时继承 `CommonProps`（`className`、`style`），字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)，本篇不再罗列。

组件通过 `defineExpose` 暴露了实例方法 `getTabItemByValue(value)`，可在父组件
通过 `ref` 拿到对应标签的 `TabDisplayItem`。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应，先给 JSON 配置，再给等价的 Vue 标签
写法。

### 位于顶部（`at-top`）

**JSON 配置**

```json
{
  "tabItemSpace": "m",
  "tabsAlign": "left",
  "tabsAt": "top",
  "value": 1,
  "options": [
    { "icon": "zmdi-cast-connected", "text": "i18n:ti-tabs-example-t0" },
    { "icon": "zmdi-favorite", "text": "i18n:ti-tabs-example-t1" },
    { "text": "i18n:ti-tabs-example-t2" },
    { "icon": "zmdi-ticket-star", "text": "i18n:ti-tabs-example-t3" },
    { "icon": "", "text": "i18n:ti-tabs-example-t4" }
  ]
}
```

**Vue 标签**

```xml
<TiTabs
  tab-item-space="m"
  tabs-align="left"
  tabs-at="top"
  :value="1"
  :options="options"
  @change="onTabChange"
/>
```

### 位于底部（`at-bottom`）

**JSON 配置**

```json
{
  "tabItemSpace": "b",
  "tabsAlign": "center",
  "tabsAt": "bottom",
  "value": 1,
  "options": [
    { "icon": "zmdi-cast-connected", "text": "i18n:ti-tabs-example-t0" },
    { "icon": "zmdi-favorite", "text": "i18n:ti-tabs-example-t1" },
    { "text": "i18n:ti-tabs-example-t2" }
  ]
}
```

**Vue 标签**

```xml
<TiTabs
  tab-item-space="b"
  tabs-align="center"
  tabs-at="bottom"
  :value="1"
  :options="options"
  @change="onTabChange"
/>
```

### 长长的标签项（`very-long`）

**JSON 配置**

```json
{
  "tabItemSpace": "m",
  "tabsAlign": "left",
  "tabsAt": "top",
  "value": 1,
  "tabMaxWidth": "200px",
  "options": [
    { "icon": "zmdi-cast-connected", "text": "This is Very Very Long Tabs" },
    { "icon": "zmdi-favorite", "text": "它的确有很多很多的标签文字，有时候你不得不换行显示" },
    { "text": "Sometimes, I don't know why anyone would design a label layout like this" },
    { "icon": "zmdi-ticket-star", "text": "但是作为一名有荣誉感的控件库作者，" },
    { "icon": "fas-heart", "text": "My pride demands that I come up with the perfect solution" }
  ]
}
```

**Vue 标签**

```xml
<TiTabs
  tab-item-space="m"
  tabs-align="left"
  tabs-at="top"
  :value="1"
  tab-max-width="200px"
  :options="options"
  @change="onTabChange"
/>
```

### 多多的标签项（`very-many`）

**JSON 配置**

```json
{
  "className": "fit-parent",
  "tabItemSpace": "m",
  "tabsAlign": "left",
  "tabsAt": "top",
  "value": 1,
  "options": [
    { "icon": "zmdi-cast-connected", "text": "AAA" },
    { "icon": "zmdi-favorite", "text": "BBB" },
    { "icon": "zmdi-favorite", "text": "CCC" },
    { "icon": "zmdi-favorite", "text": "DDD" },
    { "icon": "zmdi-favorite", "text": "EEE" }
  ]
}
```

**Vue 标签**

```xml
<TiTabs
  class="fit-parent"
  tab-item-space="m"
  tabs-align="left"
  tabs-at="top"
  :value="1"
  :options="options"
  @change="onTabChange"
/>
```

> 示例只列了前 5 项，完整示例含 20 个标签，用于演示溢出滚动箭头的出现。

## 总结

`TiTabs` 适合水平页签切换场景：详情页内的多个标签页、配置面板的分区、编辑器顶部
文件标签。组件本身不渲染内容面板，需要调用方根据 `change` 事件配合
`v-if` / `v-show` 切换下方内容。需要竖向树形导航时改用 `TiSidebar`；需要成排
命令按钮时用 `TiActionBar`。

已知限制：`defaultTab` 属性已声明但当前版本未接线；不支持标签关闭按钮 / 拖拽
排序等高级能力；标签条与内容面板的联动需调用方自行实现。

## 延伸阅读

- **源码入口**
  - `src/lib/action/tabs/ti-tabs-index.ts` —— 注册表信息与示例配置。
  - `src/lib/action/tabs/ti-tabs-types.ts` —— `TabsProps`、`TabsEmitter`、
    `TiTabsApi`。
  - `src/lib/action/tabs/TiTabs.vue` —— 视图、溢出滚动与 `change` 派发。
  - `src/lib/action/tabs/use-tabs-item.ts` —— 选项到标签显示项的转换。
  - `src/lib/action/tabs/use-tabs-overflow.ts` —— 溢出观测与左右箭头显隐。
- **相关文档**
  - 竖向导航：[ti-sidebar](ti-sidebar.md)。
  - 成排命令：[ti-action-bar](ti-action-bar.md)。
  - 共享 Props：[共享 Props](../../10.concepts/02-common-props.md)。
  - 事件回写规则：[事件绑定](../../10.concepts/03-event-binding.md)。
