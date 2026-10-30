---
title: use-field-change 字段值变更处理
keywords: [hook, useFieldChange, use-field-change, 字段变更, changeMode, 字段联动, linkFields, 必选校验, change-fields, FieldChange]
status: draft
---

# `use-field-change` 字段值变更处理

## 解决什么问题

一条表单记录里某个字段的值变了，往往要连着做一串事：先把空值/无值规整成字段默认值，
再按字段定义做必选与格式校验，校验不过就发错误提示，过了还要按"字段联动"规则顺带改掉
关联字段，最后把改动按约定的口径（只给差异 / 给合并后整行数据）通知出去。

这件事如果散落在 `TiForm`、表格行编辑、过滤条等各处，每个地方都要重写一遍校验、联动、
通知逻辑。`useFieldChange` 把这条"值变更 → 规整 → 校验 → 联动 → 通知"的流水线固定下来，
`useFormFieldChange` 在它之上再叠加表单字段解析能力（见 [use-form-field-change](./use-form-field-change.md)）。

## 输入 Props

```ts
useFieldChange<T extends AbstractField>(props, fields?)
```

- **`props: FieldChangeProps<T>`**：
  - **`changeMode?: 'diff' | 'all'`** —— 通知口径。`'diff'` 只回传本次差异对象，`'all'` 把改动
    合并进原始数据后回传整行。（类型注释里还提过 `'pair'` 回传名值对列表，但当前联合类型
    只声明了 `'diff' | 'all'`。）
  - **`allowUndefinedFields?: boolean`** —— 改动命中的字段没有定义时，按校验通过处理；否则
    返回 `FIELD_UNDEFINED`。
  - **`blockInvalid?: boolean`** —— 校验失败时不再发 `change` 通知（错误提示仍会发）。
  - **`makeVirtualField?: true | (change: FieldValueChange) => T`** —— 找不到字段定义时的兜底。
    设为 `true` 会自动按值类型造一个虚拟字段；给函数则用它临时生成字段。
  - **`linkFields?: Record<string, LinkFieldLoader<T>>`** —— 字段联动表，键为字段 `uniqKey`。
    取值是异步函数 `(value, data, field) => Promise<LinkFieldChange[] | undefined>`，返回
    非空数组表示还需联动修改的其他字段。
- **`fields?: T[]`** —— 受监控的字段定义列表；hook 内部按 `uniqKey` 建映射。

## 返回值 API

```ts
const change = useFieldChange(props, fields);
```

- **`fieldMapping: Map<string, T>`** —— `uniqKey → 字段定义` 映射表。
- **`getField(uniqKey)`** —— 按 `uniqKey` 取字段定义。
- **`verifyFieldChange(change, data)`** —— 异步校验单次改动：必选（`field.isRequired(data)`
  为真且值为空时返回 `VALUE_NIL`）与自定义 `field.validate`，通过返回 `{ type: 'OK' }`。
- **`applyFieldChange(change, data)`** —— 异步应用改动，执行 `linkFields` 联动，返回展开后的
  `FieldChange[]`。
- **`makeChangeData(changes, data?)`** —— 按 `changeMode` 生成对外通知的数据对象。
- **`getDiffData(data, change)`** —— 计算改动数据与原始数据的差异。
- **`tidyValueChange(change, options, notifyChange, notifyValidation?)`** —— 完整流水线：值规整
  （`defaultAs / emptyAs / serializer`）→ 校验 → 联动 → 生成数据 → 按 `checkEquals` 决定是否通知。
- **`handleValueChange(change, { emit, data, checkEquals? })`** —— 对外主入口，内部走
  `tidyValueChange`，并通过 `emit` 发三类事件。
- **`getValidationErrorMessage(validation, change, data, field?)`** —— 把校验结果翻译成
  `{ name, uniqKey, type, text }` 形态的字段状态（文案走 `i18n:`）。

通过 `emit` 发出的事件（类型 `FieldChangeEmitter`）：

- **`change`** —— 载荷 `Vars`，按 `changeMode` 生成的数据。
- **`change-fields`** —— 载荷 `FieldChange[]`，展开后的字段改动列表（含联动字段）。
- **`change-validate`** —— 载荷 `FieldChangeValidateResult`（`FieldStatus & Pick<AbstractField,'name'|'uniqKey'>`），
  仅在校验失败时携带错误；通过时不发。

## 配合使用

- **与字段值序列化**：流水线在自定义校验前会先执行字段的 `serializer`，空值/无值按
  `defaultAs / emptyAs` 替换；规则见 [use-field-serializer](./use-field-serializer.md)。
- **与表单字段解析**：直接监控原始字段列表时用本 hook；若字段来自 schema / `FieldRefer`
  配置，用 [use-form-field-change](./use-form-field-change.md) 包装一层。
- **与可见性/必选**：必选判断 `field.isRequired(data)` 接收当前整行数据，可结合
  [共享 Props](../../10.concepts/02-common-props.md) 中的条件匹配写法。

典型调用片段（容器控件 `setup` 内）：

```ts
const change = useFieldChange(
  {
    changeMode: 'all',
    blockInvalid: true,
    // 改了省份，联动带出城市候选
    linkFields: {
      province: async (v, data, field) => [{ name: 'city', value: null }],
    },
  },
  fields
);

// 控件值变化时统一交给本 hook 处理
await change.handleValueChange(
  { uniqKey: 'age', value: 40, oldVal: 38 },
  { emit, data: rowData, checkEquals: true }
);
```

## 注意事项

- **`changeMode: 'all'` 时通知的是合并后整行**，不是差异；做增量提交时选 `'diff'`。
- **联动字段本身也要有定义**：`linkFields` 返回的改动若找不到字段，且未开
  `allowUndefinedFields` / `makeVirtualField`，该联动改动会被跳过（不影响主字段）。
- **`getValidationErrorMessage` 的错误文案是英文模板 + `i18n:` 键**，国际化键见源码
  `i18n:e-field-undefined` / `i18n:e-val-nil` / `i18n:e-field-val-invalid`。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/field/use-field-change.ts` —— 本 hook 实现。
  - `src/lib/_features/field/use-form-field-change.ts` —— 叠加表单字段解析的封装。
- **相关文档**
  - 字段值的序列化/反序列化规则：[use-field-serializer](./use-field-serializer.md)、
    [use-field-tranformer](./use-field-tranformer.md)。
  - 字段到控件的选择：[use-field-com](./use-field-com.md)。
  - 校验结果的逐字段状态：[validate/use-data-validate](../validate/use-data-validate.md)。
