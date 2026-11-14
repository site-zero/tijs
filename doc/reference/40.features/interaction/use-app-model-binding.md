---
title: use-app-model-binding 应用模型绑定
keywords: [hook, makeAppModelDataProps, makeAppModelEventListeners, getAppModelListenEvents, use-app-model-binding, AppModelBinding, 模型绑定, v-on, 动态事件]
status: draft
---

# `use-app-model-binding` 应用模型绑定

## 解决什么问题

`TiAppModal` 会按一段"应用模型"配置动态渲染一个子控件，并把模型里的字段同时作为子控件的
Props 传入、把它的事件回写到模型结果。绑定关系有多种写法（字段名、键值对映射、事件路径…），
把这套"配置 → Props 对象 / 事件监听器表"的换算写在组件里会很绕。

`use-app-model-binding` 模块把这两段换算抽成纯函数：`makeAppModelDataProps` 按绑定描述把
结果对象拆成一组 Props；`makeAppModelEventListeners` 按事件绑定描述生成一张可直接挂到
`v-on` 的监听器表；`getAppModelListenEvents` 取出绑定涉及的事件名清单。

> 现状说明：`src/lib/_features/index.ts` 在导出本模块时留了注释「没看到哪里可复用」——
> 当前仓库内唯一消费方是 `TiAppModal.vue`，属于应用弹层专属工具，尚不具备通用复用度。

## 输入 Props

本模块导出的是三个独立纯函数，均不消费组件 Props：

- **`makeAppModelDataProps(bindingData: AppModelBindingData, getResult: () => any)`**
- **`makeAppModelEventListeners(options: MakeAppModelEventListenerOption)`**，其中
  `options` 字段为：
  - **`COM_TYPE: string`** —— 仅用于调试日志，标明是哪个组件。
  - **`convertResult?: (result: any) => Promise<any>`** —— 事件载荷的前置转换。
  - **`setResult: (result: any) => Promise<void>`** —— 单值回写。
  - **`assignResult: (meta: any) => Promise<void>`** —— 多键值回写。
  - **`bindingEvent?: AppModelBindingEvent`** —— 事件绑定描述。
- **`getAppModelListenEvents(bindingEvent?: AppModelBindingEvent): string[]`**

## 返回值 API

**`makeAppModelDataProps`** 返回 `Record<string, any>`，按 `bindingData` 形态分流：

- `null` → 返回空对象 `{}`；
- 字符串 `"value"` → `props["value"] = cloneDeep(result)`；
- 字符串数组 `["a","b"]` → `props[key] = _.get(result, key)`；
- 对象映射 `{a: "x"}` → `props["x"] = _.get(result, "a")`。

**`makeAppModelEventListeners`** 返回 `Record<string, AppModelActionHandler>`，可直接绑到
`v-on`，按 `bindingEvent` 形态分流：

- `null` → 空表。
- 字符串 `"change"` → 监听 `change`，载荷经 `convertResult` 后 `setResult(re)`；
  字符串带点号 `"select.checkedIds"` → 监听 `select`，再 `_.get(re, "checkedIds")`
  后 `setResult`。
- 对象映射按键展开：
  - 值是函数 `(api, payload) => …` → 直接作为监听器；
  - 值是字符串数组 `["a","b"]` → `_.pick(re, "a","b")` 后 `assignResult(meta)`；
  - 值是映射对象 `{a: "x"}` → 把 `re.a` 写到 `result.x`，`assignResult`。

**`getAppModelListenEvents`** 返回事件名数组：字符串取其事件名部分（去掉点号路径），
对象取其键；`null` 返回 `[]`。

## 配合使用

```ts
// TiAppModal setup 内：组装动态子控件的 Props 与事件
const comProps = computed(() =>
  _.assign({}, comConf, makeAppModelDataProps(model.data, () => _result.value))
);

const Listeners = computed(() =>
  makeAppModelEventListeners({
    COM_TYPE: "TiAppModal",
    bindingEvent: model?.event,
    setResult: async (v) => { _result.value = v; },
    assignResult: async (meta) => _.assign(_result.value, meta),
  })
);

const eventNames = getAppModelListenEvents(model.event); // 供 EmitAdaptor 查表
```

```xml
<!-- 动态渲染子控件 -->
<component :is="comType" v-bind="comProps" v-on="Listeners" />
```

## 注意事项

- **本模块无独立状态**：三个函数都是纯换算，调用方在 `computed` 里调用以保持响应性。
- **「没看到哪里可复用」是源码里的现状标注**：除 `TiAppModal.vue` 外没有其他消费方；
  新业务场景不要默认把它当通用绑定层，先确认是否就是应用弹层需求。
- **`debug` 常量为 `false`**：打开后会打印绑定换算过程，排障时临时改源码开启。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/use-app-model-binding.ts` —— 本模块三个函数。
  - `src/lib/_modal/TiAppModal.vue` —— 当前唯一消费方。
- **相关文档**
  - 组件事件如何回写：[事件绑定](../../10.concepts/03-event-binding.md)。
  - 应用级消息总线：[`use-app-bus`](use-app-bus.md)。
