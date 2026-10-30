---
title: use-boolean-input 布尔输入逻辑
keywords: [hook, useBooleanInput, use-boolean-input, 布尔, toggle, check, switch, values, isTrue, emitToggle, TiToggle, TiCheck]
status: draft
---

# `use-boolean-input` 布尔输入逻辑

## 解决什么问题

开关（`TiToggle`）、勾选（`TiCheck`）这类布尔控件长得不同，但共享同一套问题：当前
值算"开"还是"关"？开/关各自显示什么文本、图标、提示？点击后该把哪个值写出去？
真值/假值不一定是 `true/false`——可能是 `[0, 1]`，也可能是业务自定义的两个枚举值。

`useBooleanInput` 把这套判断与切换逻辑固定下来：输入 `value` 与一对真假值，输出
一组响应式状态（`Yes`、`Text`、`Icon`、`DomClass`……）和一个 `emitToggle` 切换
函数。`TiToggle` 与 `TiCheck` 直接以它为内部逻辑。

## 输入 Props

`BooleanProps`（声明于 `use-boolean-input.ts`），并混入 `ReadonlyProps`（只读判断，
见 [共享 Props](../../10.concepts/02-common-props.md)）：

- **`value?: any`** —— 当前值。
- **`values?: [any, any]`** —— `[假值, 真值]` 一对业务值；缺省时按当前值类型推断：数字值取 `[0, 1]`，布尔或其他取 `[false, true]`。
- **`isTrue?: (val: any) => boolean`** —— 自定义"判定为真"的函数，声明后优先于 `values` 比较。
- **`text?: string[] | string`** —— 显示文本：单值两种状态共用；长度 2 的数组则 `[假时, 真时]`，走 `I18n.text` 解析。
- **`icon?: IconInput | [IconInput, IconInput]`** —— 图标，同样支持单值或 `[假时, 真时]`。
- **`tip?: string[] | string`** —— 悬浮提示，规则同 `text`。

## 返回值 API

```ts
const Bool = useBooleanInput(props, { emit });
```

第二参数 `BooleanOptions` 只需提供 `emit`，切换时发出 `change` 事件。返回一组
`computed` 状态与函数：

- **`rawValue`** —— 直接反射 `props.value`。
- **`Yes`** —— 当前值是否为真（`isTrue` 或与 `values[1]` 深比较）。
- **`hasText / hasIcon / hasTip`** —— 对应内容是否配置了，供模板决定渲染分区。
- **`Icon`** —— 当前状态应显示的图标；数组图标按 `Yes` 取 `icons[1]/icons[0]`。
- **`IconHtml`** —— 图标经 `Icons.fontIconHtml` 渲染后的 HTML 字符串。
- **`Text` / `Tip`** —— 当前状态文本/提示，均已过 `I18n.text`。
- **`Readonly`** —— 当前是否只读（`useReadonly(props).isReadonly(props.value)`）。
- **`DomClass`** —— 模板根类名对象：`{ 'is-on': Yes, 'is-off': !Yes, 'is-readonly': Readonly }`。
- **`emitToggle(force = false)`** —— 点击切换：只读时忽略；算出对面状态的值，与当前值不同（或 `force`）时 `emit('change', 对面值)`。

## 配合使用

- **与 `ReadonlyProps`**：只读状态同时拦截切换动作与视图类名。
- **与图标体系**：`icon` 支持 `IconInput` 任意形态，渲染统一交给 `Icons.fontIconHtml`。

典型调用片段（`TiToggle.vue` 风格）：

```ts
const Bool = useBooleanInput(props, { emit });

// 模板里直接用：<span :class="Bool.DomClass"> {{ Bool.Text }} </span>
// 点击切换：@click="Bool.emitToggle()"
```

业务枚举值的用法：

```ts
// props: { value: 'on', values: ['off', 'on'], text: ['停用', '启用'] }
// 点一次 → emit('change', 'off')，再点 → emit('change', 'on')
```

## 注意事项

- **真假值比较用 `_.isEqual`**：对象类值也能正确比较；`emitToggle` 算出的新值与现值相等时不发事件。
- **数组型 `text/icon/tip` 只取前两位**：长度 1 时所有状态共用那一项；超过 2 位的尾部元素被忽略。
- **本文件从 `@site0/tijs` 包内导入自身工具**（`useReadonly`、`I18n`、`Icons`），理解实现时注意它消费的是包出口而非相对路径。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/use-boolean-input.ts` —— 本 hook 实现。
  - `src/lib/input/toggle/TiToggle.vue`、`src/lib/input/check/TiCheck.vue` —— 消费方组件。
- **相关文档**
  - 只读共享 Props：[共享 Props](../../10.concepts/02-common-props.md)。
  - 消费方 `TiToggle`：[ti-toggle](../../30.components/input/ti-toggle.md)；`TiCheck`：[ti-check](../../30.components/input/ti-check.md)。
