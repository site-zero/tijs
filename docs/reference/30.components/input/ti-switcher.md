---
title: TiSwitcher 开关组
keywords: [开关组, 分段选择, switcher, TiSwitcher, 按钮组, 标签组, 单选多选按钮]
status: draft
---

# TiSwitcher 开关组

## 介绍

`TiSwitcher` 是输入类（`INPUT`）的横排选项按钮组：把候选项渲染成一排可点的小按钮（可带图标 /
文字），点中即高亮。`multi: false` 时是单选，`multi: true` 时是多选。它常用于"视图切换、过滤条件、
标签分类"这类横向选择。

使用时需要注意：

- 单选时值为单个 ID，多选时值为 ID 数组；清空选择后 `change` 载荷为 `null`。
- 每个按钮可单独设置 `type`（状态色），整体选中色用 `defaultItemType`。

源码目录：`src/lib/input/switcher/`。

## 例子

### JSON 配置

```json
{
  "value": "cow",
  "multi": false,
  "options": [
    { "value": "cow", "text": "Cow", "icon": "fas-cow" },
    { "value": "dog", "text": "Dog", "icon": "fas-dog" }
  ]
}
```

### Vue 标签调用

```xml
<TiSwitcher
  value="cow"
  :multi="false"
  :options="[
    { value: 'cow', text: 'Cow', icon: 'fas-cow' },
    { value: 'dog', text: 'Dog', icon: 'fas-dog' }
  ]"
  @change="onChange"
/>
```

## 控件参数

### 数据

- **`value`（`any | any[]`）**：当前选中项 ID；单选为单值，多选为数组。
- **`options` / `dictVars` / `getOptionIcon/Text/Tip/Value`**：候选项字典配置（不含 `mustInOptions`），
  规则见 [字典模型](../../10.concepts/06-dict-model.md)。

### 行为

- **`multi`（`boolean`）**：是否允许多选。
- **`readonly`（`boolean`）**：是否只读。
- **`minChecked` / `maxChecked`（`number`）**：多选时最少 / 最多可选数量。

### 外观

- **`defaultItemType`（`LogicType`）**：选中按钮的默认状态色。
- **`nowrap`（`boolean`）**：选项是否强制不折行。
- **`itemSize`（`AspectSize`）**：选项按钮字号分级。
- **`itemGap`（`AspectSize | "none"`）**：按钮之间的间距。
- **`itemRadius`（`AspectSize | "none"`）**：按钮圆角。
- **`itemStyle`（`Vars | string`）**：单个按钮的追加样式。

### 回调

本组件无此组参数。

### 嵌套

本组件未提供插槽：按钮由 `options` 渲染，不支持通过 slot 替换单个按钮。

### 事件

- **`change`**：载荷为最新选中结果——单选为 `TableRowID | null`，多选为 `TableRowID[]`；点选变化时触发。

> 本组件继承 `CommonProps`（`className`、`style`），字段含义见
> [共享 Props](../../10.concepts/02-common-props.md)。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单开关（`simple`）

**JSON 配置**

```json
{
  "value": "cow",
  "multi": false,
  "nowrap": false,
  "itemSize": "b",
  "itemGap": "t",
  "itemRadius": "t",
  "defaultItemType": "info",
  "options": [
    { "value": "cow", "text": "Cow", "icon": "fas-cow" },
    { "value": "crow", "text": "Crow", "icon": "fas-crow" },
    { "value": "dog", "text": "Dog", "icon": "fas-dog" },
    { "value": "cat", "text": "Cat", "icon": "fas-cat" }
  ]
}
```

**Vue 标签**

```xml
<TiSwitcher
  value="cow"
  :multi="false"
  :nowrap="false"
  item-size="b"
  item-gap="t"
  item-radius="t"
  default-item-type="info"
  :options="[
    { value: 'cow', text: 'Cow', icon: 'fas-cow' },
    { value: 'crow', text: 'Crow', icon: 'fas-crow' },
    { value: 'dog', text: 'Dog', icon: 'fas-dog' },
    { value: 'cat', text: 'Cat', icon: 'fas-cat' }
  ]"
/>
```

### 多选开关（`multi`）

**JSON 配置**

```json
{
  "value": "cow",
  "multi": true,
  "nowrap": false,
  "itemSize": "m",
  "itemGap": "s",
  "itemRadius": "m",
  "defaultItemType": "info",
  "options": [
    { "value": "hippo", "text": "Hippo", "icon": "fas-hippo" },
    { "value": "cow", "text": "Cow", "icon": "fas-cow" }
  ]
}
```

**Vue 标签**

```xml
<TiSwitcher
  value="cow"
  :multi="true"
  :nowrap="false"
  item-size="m"
  item-gap="s"
  item-radius="m"
  default-item-type="info"
  :options="[
    { value: 'hippo', text: 'Hippo', icon: 'fas-hippo' },
    { value: 'cow', text: 'Cow', icon: 'fas-cow' }
  ]"
/>
```

### 图标开关（`icons`）

**JSON 配置**

```json
{
  "value": ["frog", "spider"],
  "multi": true,
  "nowrap": false,
  "itemSize": "b",
  "itemGap": "t",
  "itemRadius": "none",
  "minChecked": 1,
  "maxChecked": 5,
  "itemStyle": {
    "borderRadius": "50%",
    "justifyContent": "center",
    "width": "50px",
    "height": "50px"
  },
  "defaultItemType": "text",
  "options": [
    { "value": "hippo", "icon": "fas-hippo" },
    { "value": "spider", "icon": "fas-spider" },
    { "value": "frog", "icon": "fas-frog" }
  ]
}
```

**Vue 标签**

```xml
<TiSwitcher
  :value="['frog', 'spider']"
  :multi="true"
  :nowrap="false"
  item-size="b"
  item-gap="t"
  item-radius="none"
  :min-checked="1"
  :max-checked="5"
  :item-style="{ borderRadius: '50%', justifyContent: 'center', width: '50px', height: '50px' }"
  default-item-type="text"
  :options="[
    { value: 'hippo', icon: 'fas-hippo' },
    { value: 'spider', icon: 'fas-spider' },
    { value: 'frog', icon: 'fas-frog' }
  ]"
/>
```

### 按钮开关（`buttons`）

**JSON 配置**

```json
{
  "value": "info",
  "multi": true,
  "nowrap": false,
  "itemSize": "b",
  "itemGap": "b",
  "itemRadius": "b",
  "options": [
    { "value": "info", "text": "Info", "type": "info" },
    { "value": "warn", "text": "Warn", "type": "warn" },
    { "value": "danger", "text": "Danger", "type": "danger" }
  ]
}
```

**Vue 标签**

```xml
<TiSwitcher
  value="info"
  :multi="true"
  :nowrap="false"
  item-size="b"
  item-gap="b"
  item-radius="b"
  :options="[
    { value: 'info', text: 'Info', type: 'info' },
    { value: 'warn', text: 'Warn', type: 'warn' },
    { value: 'danger', text: 'Danger', type: 'danger' }
  ]"
/>
```

## 总结

`TiSwitcher` 适合横向、紧凑的单选 / 多选切换；竖排列表用 `TiRadioList` / `TiCheckList`，
单个布尔开关用 `TiToggle`，空间不足需要下拉收起时用 `TiDroplist`。

## 延伸阅读

- **源码入口**
  - `src/lib/input/switcher/ti-switcher-index.ts` —— 注册表信息与示例配置。
  - `src/lib/input/switcher/ti-switcher-types.ts` —— `SwitcherProps`。
  - `src/lib/input/switcher/TiSwitcher.vue` —— 视图与按钮组接线。
  - `src/lib/input/switcher/use-switcher.ts` —— `SwitcherEmitter` 与选择逻辑。
- **相关文档**
  - 竖排单选：[ti-radio-list](ti-radio-list.md)。
  - 竖排多选：[ti-check-list](ti-check-list.md)。
