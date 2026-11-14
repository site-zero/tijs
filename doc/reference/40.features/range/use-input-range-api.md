---
title: use-input-range-api 区间输入 API
keywords: [hook, useInputRangeApi, use-input-range-api, 区间, range, RangeInfo, RangeValue, editRange, clearRange, 数值区间, 日期区间]
status: draft
---

# `use-input-range-api` 区间输入 API

## 解决什么问题

数值区间、日期区间这类控件（`TiInputNumRange`、`TiInputDateRange`）对外存的值形态很多：
字符串 `"[1,10)"`、数组 `[1, 10]`、区间对象、区间信息对象都可能；点一下还要弹出对话框编辑
上下界与是否包含端点，编辑完再按声明的输出形态回写。

每种区间控件都要重复实现"输入值 → 解析成区间 → 算出展示文案 → 打开编辑对话框 → 回写"。
`useInputRangeApi` 把这段链路固定下来，数字区间控件（`input/num-range/use-inrange-api.ts`）
与日期区间控件（`input/date-range/use-daterange-api.ts`）都通过它接上层。

## 输入 Props

```ts
useInputRangeApi<T, C extends Vars, V extends Vars>(props, setup)
```

- **`props: RangeApiProps<T, C, V>`** —— 区间控件的 Props，hook 实际读取：
  - **`value?: RangeValue<T>`** —— 当前值，任意区间形态；缺省按 `"()"`（空区间）处理。
  - **`valueType?: 'auto' | RangeValueType`** —— 声明输出形态；`'auto'` 时按输入形态推断。
  - **`readonly?: boolean`** —— 为真时 `editRange()` 直接返回，不打开编辑框。
  - 其余透传给编辑对话框（`valueComType / valueComConf / checkComConf` 等，见
    [range 概述](./range-overview.md)）。
- **`setup: InputRangeApiSetup<T>`** —— 由区间控件自身提供的适配：
  - **`valueComType: () => string`** —— 编辑框里录入上下界所用的控件类型。
  - **`valueToRange: (value) => AnyRange<T>`** —— 把任意输入值解析成区间对象。
  - **`emit: (event: 'change', payload: RangeValue<T> | null) => void`** —— 回写函数。
  - **`isMatchType: MatchValueType<T>`** —— 判断值是否为区间对象/信息对象的类型谓词。
  - **`msgPrefix: string`** —— 文案国际化前缀（如 `ti-input-num`），用于拼提示语。
  - **`defaultValue: T`** —— 某一端未填时的兜底值。
  - **`editFieldType?: FieldValueType`** —— 编辑框字段类型，缺省 `'String'`。
  - **`editDialog?: () => AppModalProps`** —— 自定义对话框细节（与默认配置合并）。

## 返回值 API

```ts
const range = useInputRangeApi(props, setup);
```

计算属性（均为 `computed`）：

- **`Info`** —— 当前区间的 `RangeInfo<T>`（含 `hasMinValue/hasMaxValue/minValue/maxValue/
  minValueIncluded/maxValueIncluded`）。
- **`InfoText`** —— 按区间形态（`eq/ne/gtlt/gte/lte/NA` 等，见 [range 概述](./range-overview.md)）
  拼出的国际化展示文案。
- **`InputValueType`** —— 推断出的输入值形态：`'str' | 'array' | 'obj' | 'info' | null`。
- **`OutputValueType`** —— 最终输出形态（按 `valueType` 或推断结果）。
- **`isEmpty`** —— 当前是否为空区间。
- **`_range`** —— 解析出的底层 `AnyRange` 对象。

操作函数：

- **`editRange()`** —— 打开区间编辑对话框（`readonly` 时跳过）；取消则不回写；两端都空时
  回写 `null`，否则把结果按 `OutputValueType` 转成字符串/数组/对象/信息对象并 `emit('change')`。
- **`clearRange()`** —— 直接回写 `null`。

## 配合使用

- **与区间编辑对话框**：`editRange` 内部调用 [range 概述](./range-overview.md) 中的
  `open_range_editor`，对话框字段布局与 `msgPrefix` 文案由该模块统一提供。
- **与具体区间控件**：数字/日期区间控件各自实现 `valueToRange` 与 `emit` 后复用本 hook。

典型调用片段（区间控件 `setup` 内）：

```ts
const range = useInputRangeApi(props, {
  valueComType: () => 'TiInputNum',
  valueToRange: (v) => NumRange.parse(v),
  emit: (val) => emit('change', val),
  isMatchType: isNumRangeObj,
  msgPrefix: 'ti-input-num',
  defaultValue: 0,
  editFieldType: 'Integer',
});

// 模板上：点击展示区打开编辑，旁边放清除按钮
// <button @click="range.editRange">编辑</button>
// <button @click="range.clearRange">清除</button>
```

## 注意事项

- **输出形态由 `OutputValueType` 决定**：选 `'array'` 且区间非法或缺端时返回 `[]`，不是空字符串。
- **两端都清空时回写 `null`**，而不是空串；接收方要把 `null` 当作"未设区间"。
- **`isEmpty` 当前实现为 `!hasMinValue && !hasMinValue`**（源码 `use-input-range-api.ts` 内
  两次判断 `hasMinValue`，疑似漏写 `hasMaxValue`，按源码现状记录）。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/range/use-input-range-api.ts` —— 本 hook 实现。
- **相关文档**
  - 对话框与消息键：[range 概述](./range-overview.md)。
