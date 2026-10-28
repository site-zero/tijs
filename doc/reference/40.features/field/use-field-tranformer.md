---
title: use-field-tranformer 字段值反序列化
keywords: [hook, useFieldTransformer, use-field-tranformer, getFieldValue, transformer, 字段读取, getFieldConvertor]
status: draft
---

# `use-field-tranformer` 字段值反序列化

> 文件名与导出名均照源码拼写为 `tranformer`（非 `transformer`），引用时不要纠正。

## 解决什么问题

与 [use-field-serializer](./use-field-serializer.md) 相反方向：把存储在整行数据里的原始值
"读出来"喂给字段。读的时候要分两种取法——单个字段按路径取值，对象型字段（如
`[start, end]`）要把整行里若干键挑成一个子对象——取到后还要按字段类型做反序列化，
再跑自定义 `transformer`。

`useFieldTransformer` 把"从 `data` 里取字段值并转换"这一步压成一个函数 `getFieldValue`。

## 输入 Props

```ts
useFieldTransformer(props: FieldTransformerProps)
```

`FieldTransformerProps` 是 `Field` 的子集（`Pick<Field, 'name' | 'type' | 'transformer'>`）：

- **`name: string | string[]`** —— 字段名。为字符串时按路径 `_.get(data, name)` 取值；
  为数组时按 `_.pick(data, name)` 取子对象。
- **`type?: FieldValueType`** —— 字段类型，缺省按 `'String'` 取内置转换器。
- **`transformer?: (val, data, name) => any`** —— 自定义反序列化函数，在内置类型转换之后执行。

## 返回值 API

```ts
const ft = useFieldTransformer(props);
const value = ft.getFieldValue(rowData);
```

- **`getFieldValue(data)`** —— 固定顺序：
  1. 按 `name` 形态从 `data` 取值（字符串路径或数组挑选）；
  2. 值非空时按 `type` 取 `getFieldConvertor(type)` 的 `transform` 做反序列化；
  3. 若声明了 `transformer`，再用它做最终转换。

返回类型标注为 `Convertor<Vars, any>`，即一个接收 `Vars`、返回字段值的函数。

## 配合使用

- **与序列化成对出现**：`transformer` 负责读、`serializer` 负责写，常成对声明在同一个
  字段定义上（例如 `fldInputDateRange` 用 `str` 前缀往返转换）。
- **与字段注册**：字段定义来自 [field 概述](./field-overview.md) 的标准字段集。

典型调用片段：

```ts
// 对象型字段：把 [from, to] 两个键拼成一个区间对象读出来
const ft = useFieldTransformer({ name: ['from', 'to'], type: 'Object' });
const range = ft.getFieldValue({ from: 1, to: 10 }); // => { from: 1, to: 10 }
```

## 注意事项

- **内置 `transform` 与 `serialize` 是一对逆操作**，由 `getFieldConvertor` 按类型提供；
  自定义 `transformer` 永远在它之后执行。
- **`name` 为数组时返回的是挑出来的子对象**，不是单值；表单里对象型字段（如
  `TiInputNumUnit`、区间）走这条分支。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/field/use-field-tranformer.ts` —— 本 hook 实现（文件名照源码拼写）。
- **相关文档**
  - 写入方向的序列化：[use-field-serializer](./use-field-serializer.md)。
  - 字段定义从哪来：[field 概述](./field-overview.md)。
