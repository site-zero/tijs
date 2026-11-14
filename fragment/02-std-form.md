# 标准录入表单（TiForm）

## 何时用

需要一张「标题 + 字段 + 提示」的单条记录录入表单；字段校验、变更事件、只读态都由
容器统一处理。改写自 `src/lib/shelf/form/example/ex-form-simple.ts`。

## 片段

**JSON 配置**

```json
{
  "changeMode": "diff",
  "title": "Simple Form With Sticky Title",
  "className": "title-sticky",
  "data": {
    "species": "Tiger",
    "age": 5
  },
  "fields": [
    { "title": "Species", "name": "species", "required": true, "comType": "TiInput" },
    { "title": "Age", "name": "age", "type": "Integer", "comType": "TiInput" }
  ]
}
```

**Vue 标签**

```xml
<TiForm
  change-mode="diff"
  title="Simple Form"
  :data="record"
  :fields="[
    { title: 'Species', name: 'species', required: true, comType: 'TiInput' },
    { title: 'Age', name: 'age', type: 'Integer', comType: 'TiInput' }
  ]"
  @change="onChange"
/>
```

## 要点与坑

- `changeMode: "diff"` 时 `change` 事件只带改动差异；要整条记录用 `"all"`。
- 字段不写 `comType` 时走默认控件；只读 / 激活态控件由字段机制自动切换。
- 字段联动、校验、虚拟字段等进阶能力见
  `docs/reference/30.components/shelf/ti-form.md` 与
  `docs/reference/30.components/shelf/ti-grid-fields.md`。
