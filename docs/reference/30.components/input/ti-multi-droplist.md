---
title: TiMultiDroplist 多选下拉框
keywords: [多选, 下拉框, multi-droplist, TiMultiDroplist, 标签多选, 选项过滤, INPUT]
status: draft
---

# TiMultiDroplist 多选下拉框

## 介绍

`TiMultiDroplist` 是输入类（`INPUT`）的多选下拉框：已选值以标签（`TiTags`）的形式铺在
输入框里，点击输入区弹出选项浮层，在浮层里勾选 / 取消勾选若干选项，点击遮罩层或浮层底部
的「取消」后才把最终选择一次性写回。它适合「一个字段允许选多个枚举值」的场景，比如多选
标签、多选收件人、批量筛选条件。

交互上与单选下拉框不同：勾选浮层里的选项**不会立即触发 `change`**，只是暂存到浮层内部；
只有点击遮罩层收起浮层、或点击浮层底部的「清除 / 取消」时，组件才对比新旧值并决定是否
向外发 `change`。删除某个已选标签会立即触发一次 `change`。

使用时需要注意：

- `value` 传单个 id（字符串 / 数字）也能工作，组件内部会把它包成单元素数组；清空后向外
  发的是 `null` 而不是空数组。
- 选项超过一定数量时浮层顶部会出现关键字过滤框，过滤只作用于浮层内的候选列表，不影响
  已选标签。
- 已选标签支持拖拽排序，排序结果会整体作为新值向外发出。

源码目录：`src/lib/input/multi-droplist/`。

## 例子

### JSON 配置

```json
{
  "value": ["otter", "locust"],
  "placeholder": "Choose one Animal",
  "options": [
    { "value": "otter", "text": "Otter" },
    { "value": "locust", "text": "Locust" },
    { "value": "dove", "text": "Dove" }
  ]
}
```

### Vue 标签调用

```xml
<TiMultiDroplist
  :value="['otter', 'locust']"
  placeholder="Choose one Animal"
  :options="[
    { value: 'otter', text: 'Otter' },
    { value: 'locust', text: 'Locust' },
    { value: 'dove', text: 'Dove' }
  ]"
  @change="onChange"
/>
```

## 控件参数

### 数据

- **`value`（`TableRowID | TableRowID[] | null`，无默认值）**：当前选中值的 id 集合；
  传单值会被转成单元素数组处理，空集合对外为 `null`。
- **选项来源**：`options`、字典相关字段（`dictVars`、`getIcon`、`getText`、`getTip`、
  `getValue`）来自字典配置，选项数据的加载与翻译规则见
  [字典模型](../../10.concepts/06-dict-model.md)。
- **`tags`（`TagsProps`，无默认值）**：已选标签组 `TiTags` 的透传配置，可以调整标签的
  类型、尺寸等。
- **`tagsStyle`（`Vars`，无默认值）**：标签组容器追加的内联样式。

### 行为

- **`showOptionKeyword`（`number | boolean`，默认 `7`）**：是否在浮层顶部显示关键字
  过滤框。传 `number` 时，表示候选选项数量超过该阈值才显示；传 `boolean` 直接开关。
- **只读**：`readonly` 来自共享只读配置，只读状态下不弹出选项浮层，标签不可编辑、不可
  删除。
- **占位文本**：`placeholder` 为空值时显示，默认 `"i18n:no-selected"`；字段含义见
  [共享 Props](../../10.concepts/02-common-props.md)。

### 外观

- **`nowrap`（`boolean`，无默认值）**：已选标签是否强制单行不换行；透传给 `TiTags`。
- **状态色**：标签默认类型由 `type`（`LogicType`）决定，颜色变量来源见
  [样式系统](../../10.concepts/05-style-system.md)。
- **`width`（`string`，无默认值）**：控件固定宽度。

### 回调

本组件无此组参数。

### 嵌套

本组件未提供插槽，输入区与浮层内容全部由 `value`、`options` 与 `tags` 数据属性决定。

### 事件

- **`change`**：载荷为 `null | TableRowID[]`；点击标签删除、拖拽排序，或收起选项浮层后
  新值与旧值不一致时触发。浮层内勾选本身不触发本事件。

> 本组件同时继承 `CommonProps`、`DictProps`、`PlaceholderProps`、`ReadonlyProps`、
> `BoxAspectProps`、`BoxOptionsDataProps`、`BoxDropListProps`，字段含义见
> [共享 Props](../../10.concepts/02-common-props.md) 与
> [字典模型](../../10.concepts/06-dict-model.md)，本篇不再罗列。

## 更多例子

以下示例与注册表 `exampleProps` 一一对应。

### 简单多选（`simple`）

**JSON 配置**

```json
{
  "value": ["otter", "locust"],
  "placeholder": "Choose one Animal",
  "options": [
    { "value": "hippo", "text": "Hippo" },
    { "value": "cow", "text": "Cow" },
    { "value": "spider", "text": "Spider" },
    { "value": "frog", "text": "Frog" },
    { "value": "bugs", "text": "Bugs" },
    { "value": "otter", "text": "Otter" },
    { "value": "feather", "text": "Feather" },
    { "value": "fish", "text": "Fish" },
    { "value": "dragon", "text": "Dragon" },
    { "value": "locust", "text": "Locust" },
    { "value": "dove", "text": "Dove" },
    { "value": "crow", "text": "Crow" },
    { "value": "dog", "text": "Dog" },
    { "value": "worm", "text": "Worm" },
    { "value": "shrimp", "text": "Shrimp" },
    { "value": "mosquito", "text": "Mosquito" },
    { "value": "horse", "text": "Horse" },
    { "value": "cat", "text": "Cat" }
  ]
}
```

**Vue 标签**

```xml
<TiMultiDroplist
  :value="['otter', 'locust']"
  placeholder="Choose one Animal"
  :options="[
    { value: 'hippo', text: 'Hippo' },
    { value: 'cow', text: 'Cow' },
    { value: 'spider', text: 'Spider' },
    { value: 'frog', text: 'Frog' },
    { value: 'bugs', text: 'Bugs' },
    { value: 'otter', text: 'Otter' },
    { value: 'feather', text: 'Feather' },
    { value: 'fish', text: 'Fish' },
    { value: 'dragon', text: 'Dragon' },
    { value: 'locust', text: 'Locust' },
    { value: 'dove', text: 'Dove' },
    { value: 'crow', text: 'Crow' },
    { value: 'dog', text: 'Dog' },
    { value: 'worm', text: 'Worm' },
    { value: 'shrimp', text: 'Shrimp' },
    { value: 'mosquito', text: 'Mosquito' },
    { value: 'horse', text: 'Horse' },
    { value: 'cat', text: 'Cat' }
  ]"
/>
```

### 选项带图标（`with_icon`）

**JSON 配置**

```json
{
  "value": "otter",
  "placeholder": "Choose one Animal",
  "options": [
    { "value": "hippo", "text": "Hippo", "icon": "fas-hippo" },
    { "value": "cow", "text": "Cow", "icon": "fas-cow" },
    { "value": "spider", "text": "Spider", "icon": "fas-spider" },
    { "value": "frog", "text": "Frog", "icon": "fas-frog" },
    { "value": "bugs", "text": "Bugs", "icon": "fas-bugs" },
    { "value": "otter", "text": "Otter", "icon": "fas-otter" },
    { "value": "fish", "text": "Fish", "icon": "fas-fish" },
    { "value": "dragon", "text": "Dragon", "icon": "fas-dragon" },
    { "value": "locust", "text": "Locust", "icon": "fas-locust" },
    { "value": "dove", "text": "Dove", "icon": "fas-dove" },
    { "value": "crow", "text": "Crow", "icon": "fas-crow" },
    { "value": "dog", "text": "Dog", "icon": "fas-dog" },
    { "value": "worm", "text": "Worm", "icon": "fas-worm" },
    { "value": "shrimp", "text": "Shrimp", "icon": "fas-shrimp" },
    { "value": "mosquito", "text": "Mosquito", "icon": "fas-mosquito" },
    { "value": "horse", "text": "Horse", "icon": "fas-horse" },
    { "value": "cat", "text": "Cat", "icon": "fas-cat" }
  ]
}
```

**Vue 标签**

```xml
<TiMultiDroplist
  value="otter"
  placeholder="Choose one Animal"
  :options="[
    { value: 'hippo', text: 'Hippo', icon: 'fas-hippo' },
    { value: 'cow', text: 'Cow', icon: 'fas-cow' },
    { value: 'spider', text: 'Spider', icon: 'fas-spider' },
    { value: 'frog', text: 'Frog', icon: 'fas-frog' },
    { value: 'bugs', text: 'Bugs', icon: 'fas-bugs' },
    { value: 'otter', text: 'Otter', icon: 'fas-otter' },
    { value: 'fish', text: 'Fish', icon: 'fas-fish' },
    { value: 'dragon', text: 'Dragon', icon: 'fas-dragon' },
    { value: 'locust', text: 'Locust', icon: 'fas-locust' },
    { value: 'dove', text: 'Dove', icon: 'fas-dove' },
    { value: 'crow', text: 'Crow', icon: 'fas-crow' },
    { value: 'dog', text: 'Dog', icon: 'fas-dog' },
    { value: 'worm', text: 'Worm', icon: 'fas-worm' },
    { value: 'shrimp', text: 'Shrimp', icon: 'fas-shrimp' },
    { value: 'mosquito', text: 'Mosquito', icon: 'fas-mosquito' },
    { value: 'horse', text: 'Horse', icon: 'fas-horse' },
    { value: 'cat', text: 'Cat', icon: 'fas-cat' }
  ]"
/>
```

### 选项带备注（`with_tip`）

**JSON 配置**

```json
{
  "value": null,
  "placeholder": "Choose one Animal",
  "options": [
    { "value": "hippo", "text": "Hippo", "icon": "fas-hippo", "tip": "Hipo like water" },
    { "value": "cow", "text": "Cow", "icon": "fas-cow", "tip": "Cow is a domestic animal" },
    { "value": "spider", "text": "Spider", "icon": "fas-spider", "tip": "Spider has eight legs" },
    { "value": "frog", "text": "Frog", "icon": "fas-frog", "tip": "Frog can jump high" },
    { "value": "bugs", "text": "Bugs", "icon": "fas-bugs", "tip": "Bugs are small insects" },
    { "value": "otter", "text": "Otter", "icon": "fas-otter", "tip": "Otters live in water" },
    { "value": "feather", "text": "Feather", "icon": "fas-feather", "tip": "Feathers are soft" },
    { "value": "fish", "text": "Fish", "icon": "fas-fish", "tip": "Fish live in water" },
    { "value": "dragon", "text": "Dragon", "icon": "fas-dragon", "tip": "Dragons are mythical creatures" },
    { "value": "locust", "text": "Locust", "icon": "fas-locust", "tip": "Locusts can destroy crops" },
    { "value": "dove", "text": "Dove", "icon": "fas-dove", "tip": "Dove symbolizes peace" },
    { "value": "crow", "text": "Crow", "icon": "fas-crow", "tip": "Crow is a bird" },
    { "value": "dog", "text": "Dog", "icon": "fas-dog", "tip": "Dog is a loyal animal" },
    { "value": "worm", "text": "Worm", "icon": "fas-worm", "tip": "Worms live in soil" },
    { "value": "shrimp", "text": "Shrimp", "icon": "fas-shrimp", "tip": "Shrimps live in water" },
    { "value": "mosquito", "text": "Mosquito", "icon": "fas-mosquito", "tip": "Mosquitoes can bite" },
    { "value": "horse", "text": "Horse", "icon": "fas-horse", "tip": "Horses are fast runners" },
    { "value": "cat", "text": "Cat", "icon": "fas-cat", "tip": "Cats are independent animals" }
  ]
}
```

**Vue 标签**

```xml
<TiMultiDroplist
  :value="null"
  placeholder="Choose one Animal"
  :options="[
    { value: 'hippo', text: 'Hippo', icon: 'fas-hippo', tip: 'Hipo like water' },
    { value: 'cow', text: 'Cow', icon: 'fas-cow', tip: 'Cow is a domestic animal' },
    { value: 'spider', text: 'Spider', icon: 'fas-spider', tip: 'Spider has eight legs' },
    { value: 'frog', text: 'Frog', icon: 'fas-frog', tip: 'Frog can jump high' },
    { value: 'bugs', text: 'Bugs', icon: 'fas-bugs', tip: 'Bugs are small insects' },
    { value: 'otter', text: 'Otter', icon: 'fas-otter', tip: 'Otters live in water' },
    { value: 'feather', text: 'Feather', icon: 'fas-feather', tip: 'Feathers are soft' },
    { value: 'fish', text: 'Fish', icon: 'fas-fish', tip: 'Fish live in water' },
    { value: 'dragon', text: 'Dragon', icon: 'fas-dragon', tip: 'Dragons are mythical creatures' },
    { value: 'locust', text: 'Locust', icon: 'fas-locust', tip: 'Locusts can destroy crops' },
    { value: 'dove', text: 'Dove', icon: 'fas-dove', tip: 'Dove symbolizes peace' },
    { value: 'crow', text: 'Crow', icon: 'fas-crow', tip: 'Crow is a bird' },
    { value: 'dog', text: 'Dog', icon: 'fas-dog', tip: 'Dog is a loyal animal' },
    { value: 'worm', text: 'Worm', icon: 'fas-worm', tip: 'Worms live in soil' },
    { value: 'shrimp', text: 'Shrimp', icon: 'fas-shrimp', tip: 'Shrimps live in water' },
    { value: 'mosquito', text: 'Mosquito', icon: 'fas-mosquito', tip: 'Mosquitoes can bite' },
    { value: 'horse', text: 'Horse', icon: 'fas-horse', tip: 'Horses are fast runners' },
    { value: 'cat', text: 'Cat', icon: 'fas-cat', tip: 'Cats are independent animals' }
  ]"
/>
```

> 注册表 `exampleProps` 中还声明了 `multi-with-icon`、`multi-with-tip` 两个示例文件，
> 但被注释掉未启用；如需参照可阅读
> `src/lib/input/multi-droplist/example/ex-multi-droplist-with-icon.ts` 等文件。

## 总结

`TiMultiDroplist` 适合「枚举多值 + 需要看清已选项」的录入：已选值以标签平铺、可删除、
可拖拽排序。只选一个值时用 `TiDroplist`；候选集很大、需要左右两栏穿梭式搬运时改用
`TiTransfer`；需要在输入过程中按文本模糊匹配并直接采纳输入串（而非必须命中选项）时，
选择 `TiInputCombo`。注意它的 `change` 是「确认式」的——浮层内勾选不会即时回写。

## 延伸阅读

- **源码入口**
  - `src/lib/input/multi-droplist/ti-multi-droplist-index.ts` —— 注册表信息与示例配置。
  - `src/lib/input/multi-droplist/ti-multi-droplist-types.ts` —— `MultiDroplistProps`、
    `MultiDroplistEmitter`。
  - `src/lib/input/multi-droplist/TiMultiDroplist.vue` —— 视图、标签区与选项浮层接线。
  - `src/lib/input/multi-droplist/use-multi-droplist-api.ts` —— 选项加载、关键字过滤与
    变更确认。
  - `src/lib/input/multi-droplist/use-multi-droplist-actions.ts` —— 标签操作按钮。
- **相关文档**
  - 字典值到选项的翻译规则：[字典模型](../../10.concepts/06-dict-model.md)。
  - 共享 Props 与只读 / 占位字段：[共享 Props](../../10.concepts/02-common-props.md)。
  - 事件回写规则：[事件绑定](../../10.concepts/03-event-binding.md)。
  - 单值下拉框：[TiDroplist 下拉列表](./ti-droplist.md)。
