---
title: use-value-translator 值翻译器
keywords: [hook, useValueTranslator, use-value-translator, 翻译, translator, valueTranslators, 字典翻译, Match, explainText]
status: draft
---

# `use-value-translator` 值翻译器

## 解决什么问题

标签云、过滤器这类**展示型**组件常常要把一组内部值变成人类可读文本：`'pdvvddh*'`
要显示成"高权限用户"，布尔匹配描述要展开成"状态=启用"，一组多选值要拼成
"A or B or C"。这些值可能来自字典、可能就是匹配表达式、也可能要按业务规则自定义。

`useValueTranslator` 提供一个**按名字查表的翻译器工厂**：你在 `valueTranslators` 里
为每类值登记一种翻译方式（函数、字典名、内置名），之后只要调用
`translator(名字, 值)`，它就会异步返回展示文本。当前被 `TiTags` 标签云使用；
`view/filter/_old` 下的旧过滤器代码也用过（已归档）。

## 输入 Props

`ValueTranslatorProps`（声明于 `use-value-translator.ts`）：

- **`valueTranslators?: Record<string, string | ValTrans>`** —— 翻译注册表：键是翻译器名字，值是 `(val) => Promise<string>` 自定义函数，或以 `#` 开头的静态字典名（如 `"#userStatus"`）。
- **`valueIsMatcher?: boolean`** —— 某类值没登记翻译器时，是否按"匹配条件展示"兜底（见下）。

## 返回值 API

```ts
const translate = useValueTranslator(props);
const text = await translate('userStatus', val);
```

返回 **`ValueTranslator = (name: string, val: any) => Promise<string>`**：
按 `name` 从 `valueTranslators` 取出对应配置，再按下列顺序解析出实际翻译函数：

- **未登记**：
  - `valueIsMatcher` 开启 → `Match.parse(val).explainText(Match.createExplainI18n())`，把匹配描述展开成自然语言。
  - 否则 → `` `${val ?? I18n.get("nil")}` ``，空值走国际化"无"文案。
- **登记为函数**：直接调用该函数。
- **登记为 `"#字典名"`**：`Dicts.checkDict(name)` 取静态字典；单值走 `dict.getText(val)`；值为数组时排序后逐项 `getText`，再用 `" or "` 连接。
- **登记为其他字符串**：到内置翻译器注册表 `_BUILTIN_TRANS` 里查；查不到直接抛错 `Fail to found built-in translator '...'`。

## 配合使用

- **与静态字典**：`"#userStatus"` 形态复用已注册的静态字典，字典机制见
  [字典模型](../../10.concepts/06-dict-model.md)；动态字典不在本 hook 覆盖范围。
- **与 `useDict`**：需要在控件侧直接持有字典实例时用 [use-dict](../options/use-dict.md)；本 hook 只是字典文本翻译的一个轻量门面。

典型调用片段（`TiTags` 风格）：

```ts
const translate = useValueTranslator({
  // 状态值走静态字典翻译；匹配描述类值走默认展开
  valueTranslators: {
    userStatus: '#userStatus',
    level: async (v) => `Lv.${v}`,
  },
  valueIsMatcher: true,
});

// 标签展示前把值翻译成文本
const text = await translate('userStatus', tagName);
```

## 注意事项

- **内置翻译器注册表当前为空**：`_BUILTIN_TRANS` 是模块级 `Map`，仓库内没有任何地方登记内置翻译器；因此"字符串既不是 `#字典名` 也不是函数"的写法目前必然抛错，可用的形态只有函数与 `#字典名` 两种。
- **字典必须事先注册**：`"#userStatus"` 走 `checkDict`，字典未注册会抛错，不返回兜底文本。
- **数组值会先排序再拼接**：多选值翻译结果形如 `a or b or c`，分隔符是固定的英文 `" or "`。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/use-value-translator.ts` —— 本 hook 实现。
  - `src/lib/tile/tags/use-tags.ts` —— 消费方 `TiTags` 标签云。
- **相关文档**
  - 字典数据模型：[字典模型](../../10.concepts/06-dict-model.md)。
  - 控件侧字典实例构建：[use-dict](../options/use-dict.md)。
