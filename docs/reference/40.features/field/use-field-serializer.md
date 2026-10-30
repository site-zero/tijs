---
title: use-field-serializer 字段值序列化
keywords: [hook, useFieldSerializer, use-field-serializer, prepareFieldValue, serializer, defaultAs, emptyAs, getFieldConvertor]
status: draft
---

# `use-field-serializer` 字段值序列化

## 解决什么问题

字段值从"控件里输入的形态"落到"要存进数据模型的形态"，中间常要过几道转换：空字符串要
落成 `null`，无值要给默认值，数字字段要按精度规整，最后再跑一段自定义序列化函数。
`useFieldChange` 的流水线在发通知前就是靠这套逻辑把值"收拾"干净的。

每个字段都写一遍"无值/空值兜底 + 类型转换 + 自定义函数"会重复，`useFieldSerializer`
把它压成一个函数 `prepareFieldValue`。

## 输入 Props

```ts
useFieldSerializer(props: FieldSerializerProps)
```

`FieldSerializerProps` 是 `Field` 的子集（`Pick<Field, 'name' | 'type' | 'defaultAs' | 'emptyAs' | 'serializer'>`）：

- **`name`** —— 字段名，作为自定义 `serializer` 的第三个参数传入。
- **`type?: FieldValueType`** —— 字段类型，缺省按 `'String'` 取内置转换器。
- **`defaultAs?: any`** —— 值为 `nil`（`undefined / null`）时的兜底值；哨兵 `'~~undefined~~'`
  会被翻译成真正的 `undefined`。
- **`emptyAs?: any`** —— 值"空"（如空字符串、空数组，但布尔/数字/日期/正则除外）时的兜底值；
  同样支持 `'~~undefined~~'` 哨兵。空值兜底优先于默认值。
- **`serializer?: FuncA2`** —— 自定义序列化函数 `(val, data, name) => any`，在内置类型
  转换之后执行。

## 返回值 API

```ts
const fs = useFieldSerializer(props);
const stored = fs.prepareFieldValue(rawVal, rowData);
```

- **`prepareFieldValue(val, data)`** —— 按固定顺序加工：
  1. `val` 为 `nil` → 用 `defaultAs` 兜底；
  2. 否则 `val` 为空（且不是布尔/数字/日期/正则）→ 用 `emptyAs ?? defaultAs` 兜底；
  3. 值非空时按 `type` 取内置转换器 `getFieldConvertor(type)` 的 `serialize`；
  4. 若声明了 `serializer`，再用它做最终转换。

## 配合使用

- **与 `useFieldChange`**：后者的 `tidyValueChange` 在发通知前对每个改动值执行与本 hook
  相同的 `defaultAs / emptyAs / serializer` 逻辑，二者口径一致。
- **与反序列化**：[use-field-tranformer](./use-field-tranformer.md) 负责把存储值读出来，
  本 hook 负责把输入值写进去，二者共用 `getFieldConvertor`。

典型调用片段：

```ts
const fs = useFieldSerializer({
  name: 'tags',
  type: 'Array',
  emptyAs: '~~undefined~~', // 空数组落成 undefined
});

const stored = fs.prepareFieldValue([], rowData); // => undefined
```

## 注意事项

- **`'~~undefined~~'` 是库内约定的哨兵串**，不是普通字符串；想真的存这个串要绕开。
- **空值判断会跳过布尔/数字/日期/正则**：`false`、`0`、`new Date(...)` 不会被当成空值兜底。
- **内置类型转换来自 `getFieldConvertor`**，具体每种 `FieldValueType` 的 `serialize` 行为
  以源码 `lib-type-fields` 为准。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/field/use-field-serializer.ts` —— 本 hook 实现。
- **相关文档**
  - 读取方向的反序列化：[use-field-tranformer](./use-field-tranformer.md)。
  - 调用本 hook 逻辑的变更流水线：[use-field-change](./use-field-change.md)。
