# 输入的值

```js
// 扁平对象
{
    name: "xiaobai",
    title: "XiaoBai",
    age: 12,
    website: "www.site0.xyz",
    actived: true
}
// 分组对象
{
    general: {
        name: "xiaobai",
        title: "XiaoBai",
        age: 12,
        website: "www.site0.xyz",
        actived: true
    },
    address: {
        city: 'Beijing',
        street: "My Home Is Here",
        postcode: '10086',
        email: "zozoh@site0.xyz",
        mobile: "13910110054",
        phone: "88765543",
    },
    note: "xxx",
    comment: "hello world"
}
```

# 如何识别字段

> 用 `fieldDepth`

# 如何指定每个字段的设置

> 采用 `fields` 以及 ``defaultFields`


# 按模式整理对象值

```bash
FormMode='tabs'

FormMode='form'
```
