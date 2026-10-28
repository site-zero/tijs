---
title: range 区间编辑对话框与消息键
keywords: [range, open_range_editor, get_range_info_msg_key, RangeInfo, RangeInfoMsgKey, 区间对话框, eq ne gtlt gte lte, RangeApiProps]
status: draft
---

# `range/` 区间编辑对话框与消息键

## 解决什么问题

[use-input-range-api](./use-input-range-api.md) 负责把任意值解析成区间、算出展示文案；
真正"弹出一个表单让用户改上下界与是否包含端点"这件事，以及"当前区间该用哪句国际化文案"
的判断，不在那个 hook 里，而在本目录的另外两个模块里。它们合起来让所有区间控件共用同一套
编辑对话框布局与同一套文案键命名，不用每个控件各画一遍表单。

## 对外导出

- **`open_range_editor(props, info, setup): Promise<RangeInfo<T> | undefined>`**
  （`open-range-editor.ts`）—— 打开区间编辑对话框。内部用 `openAppModal` 挂一个 `TiForm`，
  标题是按当前区间拼出的 HTML（期望值 + 区间表达式），表单分"最小 / 最大"两组，每组一个
  录入控件（`valueComType`）和一个"包含端点"复选框（`TiCheck`）；`linkFields` 在某端
  清空时自动把对应 `hasXxxValue` 置假。用户取消返回 `undefined`，确认返回更新后的
  `RangeInfo`（按是否有值回写 `hasMinValue / hasMaxValue`）。
- **`get_range_info_msg_key(info): RangeInfoMsgKey`**（`range-msg-key.ts`）—— 根据区间两端
  是否有值、是否包含端点，返回一个消息键，供拼文案。取值：
  - 两端都有且相等：`eq`（闭区间单点）、`ne`（开区间单点）；
  - 两端都有且不等：`gtelte`（双闭）、`gtlte`（左开右闭）、`gtelt`（左闭右开）、`gtlt`（双开）；
  - 只有下界：`gte` / `gt`；只有上界：`lte` / `lt`；都没有：`NA`。
- **`range/index.ts`** 当前只再导出 `./use-input-range-api`；上述两个模块由该 hook 内部引用，
  不直接对外。

## 模块职责分组

```text
use-input-range-api.ts  ──editRange()──▶  open_range_editor.ts
                                              │ 构造 TiForm 对话框
                                              │ 调用 get_range_info_msg_key
                                              ▼
                                        range-msg-key.ts
                                          返回 eq/ne/gtlt/.../NA
```

- **`open-range-editor.ts`**：对话框布局、`valueComConf / checkComConf` 合并、`msgPrefix`
  经 `_.kebabCase` 后拼 `i18n:<prefix>-edit-title / min / max / min-included / ...` 文案键。
- **`range-msg-key.ts`**：纯函数，只做区间形态 → 消息键的映射，不碰 UI。

## 配合使用

- **被 `useInputRangeApi` 调用**：`editRange()` 用 `open_range_editor` 弹框；`InfoText`
  用 `get_range_info_msg_key` 取键后拼 `i18n:<prefix>-info-<msgKey>`。
- **被区间控件消费**：`TiInputNumRange`、`TiInputDateRange` 的内部 api（`use-inrange-api.ts`、
  `use-daterange-api.ts`）经由 `useInputRangeApi` 间接使用本目录。

## 注意事项

- **对话框文案键带 `msgPrefix`**：业务要为每种区间控件提供 `<prefix>-edit-title`、
  `<prefix>-min`、`<prefix>-max`、`<prefix>-min-included`、`<prefix>-max-included`、
  `<prefix>-info-eq` … 等语言包条目，否则展示原文 key。
- **`get_range_info_msg_key` 会按 `minValue/maxValue` 是否为 nil 重新推导 `hasXxxValue`**，
  传入的 `hasMinValue/hasMaxValue` 字段不参与判断。
- **`index.ts` 当前没有 barrel 导出这两个模块**，直接用需从具体文件导入。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/range/open-range-editor.ts` —— 编辑对话框。
  - `src/lib/_features/range/range-msg-key.ts` —— 消息键映射。
  - `src/lib/_features/range/index.ts` —— 当前 barrel。
- **相关文档**
  - 上层 hook：[use-input-range-api](./use-input-range-api.md)。
