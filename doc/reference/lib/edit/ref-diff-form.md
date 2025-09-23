# `TiDiffForm` 差异表单

## 控件概述

`TiDiffForm` 根据给定的参考数据，为每个表单字段标识出差异。并提供快速修改值的方
法

## 控件属性

它继承所有的 `TiForm` 属性，并且增加了下面的属性

### `referData` 参考数据

```ts
type DiffFormReferData = {
    // 参考数据的标题名称
    title: string;

    // 参考数据本身
    data: Vars;
}
referData: DiffFormReferData | DiffFormReferData[]
```
