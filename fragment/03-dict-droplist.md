# 字典下拉选择（TiDroplist）

## 何时用

只读下拉单选：选项来自静态数组或注册字典。改写自
`src/lib/input/droplist/example/ex-droplist-simple.ts`。

## 片段

**JSON 配置（静态选项）**

```json
{
  "value": "otter",
  "placeholder": "Choose one Animal",
  "options": [
    { "value": "hippo", "text": "Hippo" },
    { "value": "cow", "text": "Cow" },
    { "value": "otter", "text": "Otter" }
  ]
}
```

**JSON 配置（动态字典）**

```json
{
  "value": "=currentPet",
  "placeholder": "i18n:choose-pet",
  "options": "#pets"
}
```

**Vue 标签**

```xml
<TiDroplist
  v-model:value="animal"
  placeholder="Choose one Animal"
  :options="[
    { value: 'hippo', text: 'Hippo' },
    { value: 'cow', text: 'Cow' },
    { value: 'otter', text: 'Otter' }
  ]"
  @change="onChange"
/>
```

## 要点与坑

- `options` 三种形态：静态数组、`"#字典名"` 引用已注册字典、异步加载函数；
  机制见 `docs/reference/10.concepts/06-dict-model.md`。
- 多选场景改用 `TiMultiDroplist`；需要可手打过滤时用 `TiInputCombo`。
- 选项带图标 / 备注用 `icon` / `tip` 字段，见
  `docs/reference/30.components/input/ti-droplist.md`。
