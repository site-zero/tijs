---
title: use-field-com 字段控件选择
keywords: [hook, useFieldCom, use-field-com, 字段控件, comType, comConf, readonlyComType, activatedComType, autoGetCom, 动态comConf]
status: draft
---

# `use-field-com` 字段控件选择

## 解决什么问题

一个字段在不同状态下常常要用不同控件：浏览态用只读标签，激活（编辑）态换成输入框，
表格单元格里只读时又是另一套紧凑配置。字段定义里因此同时存在 `comType / comConf`、
`readonlyComType / readonlyComConf`、`activatedComType / activatedComConf` 三对，外加
`dynamic` 动态解释、`autoValue` 自动注入当前值。

每处消费这些定义的地方都要重复写"按状态挑控件 + 克隆配置 + 动态解释 + 注入值"这套逻辑。
`useFieldCom` 把这套选择逻辑收敛成一组取值函数，供 `TiForm` 字段、表格单元格等统一调用。

## 输入 Props

```ts
useFieldCom(props: FieldComProps, options?: FieldComOptions)
```

- **`props: FieldComProps`**（字段定义上的控件相关字段）：
  - **`comType?: string` / `comConf?: Vars | (context: Vars) => Vars`** —— 默认控件与配置；
    `comConf` 为函数时按上下文实时生成。
  - **`readonlyComType?: string` / `readonlyComConf?: Vars | (context) => Vars`** —— 只读态控件。
  - **`activatedComType?: string` / `activatedComConf?: Vars | (context) => Vars`** —— 激活（编辑）态控件。
  - **`dynamic?: boolean`** —— 为真时用 `Util.explainObj(context, comConf, explainOptions)`
    按上下文解释配置里的模板占位。
  - **`explainOptions?: any`** —— 动态解释的附加选项。
  - **`autoValue?: string | null`** —— 自动注入当前值的属性名，缺省 `'value'`；设为 `null`
    则不注入。
- **`options: FieldComOptions`**：
  - **`defaultComType?: string`** —— 缺省控件类型，默认 `'TiLabel'`。
  - **`defaultComConf?: Vars`** —— 缺省配置，默认 `{}`。

## 返回值 API

```ts
const fc = useFieldCom(props, options);
```

返回 `FieldComFeature`，三组"取值 + 按状态自动选"函数：

- **`getComType()` / `getComConf(context, val?)`** —— 默认控件类型与配置；配置经克隆、
  动态解释后，按 `autoValue` 自动补上当前值（仅当目标属性未声明时）。
- **`getReadonlyComType()` / `getReadonlyComConf(context, val?)`** —— 只读态；配置最后会被
  强制写上 `readonly = true`。
- **`getActivatedComType()` / `getActivatedComConf(context, val?)`** —— 激活态控件。
- **`autoGetComType(status)` / `autoGetComConf(status, context, val?)`** —— 按 `FieldMode`
  自动选择：`status = { readonly?, actived? }`，优先用只读/激活态定义，否则回退默认；
  只读回退分支会给默认配置补 `readonly = true`。
- **`autoGetCom(status, context, val?)`** —— 一步到位返回 `{ rawCom, comType, comConf }`
  （`FieldCom`），可直接喂给动态渲染。

控件类型都经过 `tiCheckComponent` 校验，未注册的组件类型会在调用时抛出。

## 配合使用

- **与字段注册**：字段定义来自 [field 概述](./field-overview.md) 中 `useObjFields` /
  `init_ti_std_fields` 注册的标准字段，`comConf` 是其中的 `comConf / readonlyComConf / activatedComConf`。
- **与只读共享 Props**：本 hook 在只读配置上强制 `readonly = true`，与
  [共享 Props](../../10.concepts/02-common-props.md) 的只读口径一致。
- **与动态上下文**：`dynamic` 配合 `Util.explainObj`，可按表单当前值解释 `comConf` 内的
  占位表达式。

典型调用片段：

```ts
const fc = useFieldCom(field, { defaultComType: 'TiLabel' });

// 表格单元格：可编辑且激活时用输入框，否则用只读标签
const status = { readonly: !editable, actived: editing };
const { comType, comConf } = fc.autoGetCom(status, rowData, cellValue);
```

## 注意事项

- **`comConf` 每次都被 `jsonClone` 克隆**，不要在返回的配置上直接改对象再复用同一字段定义。
- **`readonlyComConf` 会被强制 `readonly = true`**，即便你在配置里显式写了别的值。
- **`autoValue` 只在目标属性未声明时写入**，已显式给 `value` 的配置不会被覆盖。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/field/use-field-com.ts` —— 本 hook 实现。
- **相关文档**
  - 字段定义从哪来：[field 概述](./field-overview.md)。
  - 字段值的序列化/反序列化：[use-field-serializer](./use-field-serializer.md)、
    [use-field-tranformer](./use-field-tranformer.md)。
