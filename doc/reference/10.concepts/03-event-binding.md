---
title: 事件绑定
keywords: [事件, emit, emits, EmitAdaptor, exampleModel, 事件适配, change, value, 事件回写]
status: draft
---

# 事件绑定

## 要解决的问题

一个组件对外发事件，在不同场景下需要三种不同的处理方式：

- **组件自身**：按 Vue 标准 `defineEmits` 声明事件名与载荷类型，向外 `emit`。
- **容器组件**：把子组件的事件改名、拦截原生事件冒泡，或者转交给一个统一回调，而不是把
  子组件的事件原样透传出去。
- **Playground / 动态表单**：用户在演示界面操作组件后，需要把事件载荷自动写回当前
  `comConf` 配置，让右侧配置面板实时反映"现在的值是什么"。

这三件事在 TiJS 里分成三层：**组件 emits 声明**、**事件适配器 `events` Props**、
**注册表 `exampleModel` 回写规则**。

## 解决思路

### 第一层：组件 emits 声明

每个组件在 `ti-xxx-types.ts` 里定义自己的 Emitter 类型，例如按钮：

```ts
export type ButtonEmitter = {
  (event: 'click', payload: any): void;
};
```

组件 `TiXxx.vue` 内 `defineEmits<ButtonEmitter>()` 取得 `emit`，用户交互时调用
`emit('click', payload)`。

注册表包装成 `TiComImpl` 时，会读取组件 `com.emits` 把事件名收集到 `events` 数组，
供容器与 Playground 知道"这个组件一共会发哪些事件"。

### 第二层：事件适配器 `EmitAdaptorProps`

容器类组件（如 `TiBlock`、`TiTextSnippet`）通过 `events` Props 描述如何处理子组件事件：

```ts
export type EmitAdaptorProps = {
  events?: Record<string, EmitAdaptor>;
};

export type EmitAdaptor = boolean | string | EmitAdaptorHandler;
```

`useEmitAdaptor(COM_TYPE, props, options)` 遍历 `events`，为每个事件名生成一个监听函数，
三种取值对应三种适配方式：

- **`boolean`** —— 仅做拦截：原生 `Event` 会被 `stopPropagation()` 拦下；非原生载荷
  交给可选的 `handler` 统一处理。
- **`string`** —— 事件改名：用模板字符串（上下文为 `{ eventName, payload }`）渲染出新
  事件名，再交给 `handler`；同样先拦截原生事件冒泡。
- **`EmitAdaptorHandler` 函数** —— 完全自定义：收到 `{ eventName, orginName, data }`
  后自行决定如何转发。

`options.handler` 是统一出口，容器在其中把适配后的事件再 `emit` 给自己的父级；
`options.ignoreNativeEvents` 缺省 `true`，即默认拦截原生 DOM 事件冒泡。

### 第三层：`exampleModel` 事件回写（Playground）

组件注册表 `TiComInfo.exampleModel` 描述"某个事件触发后，把载荷写回 `comConf` 的哪个
位置"。未声明时缺省为：

```ts
{ change: "value" }
```

即 `change` 事件的载荷直接写入 `comConf.value`。

Playground 收到事件后按下面的规则更新配置（见 `use-playground-api.ts` 的
`__handle_sub_event`）：

1. 先把事件转发到应用事件总线 `TiAppBus`。
2. 取 `comInfo.exampleModel`；如果它是函数，直接调用 `model(eventName, payload)` 结束。
3. 按事件名找到目标 `target`，支持数组形式一次写多个位置。每个目标有三种形态：

   - **字符串** —— 模板路径，载荷写入该路径：`{ change: "value" }`。
   - **对象** —— 精细控制：

     ```ts
     { key: "data.${name}", val: "=value", mode: "assign", scope: "..." }
     ```

     - `key`：写入路径，支持模板；`"..."` 表示把 `val` 整体合并进当前对象。
     - `val`：取值表达式，由 `Util.explainObj(payload, val)` 从载荷中抽取。
     - `mode`：`assign`（覆盖合并，缺省）或 `merge`（深合并）。
     - `scope`：先定位 `comConf` 内的子对象，再在该范围内写入。
   - **函数** —— 收到 `(payload, oldComConf)`，返回新的配置对象，完全自定义回写。

4. `Map` 类型载荷会先转成普通对象再写入；更新完成后刷新 Playground 右侧的 JSON 配置文本。

不在 `exampleModel` 里的事件，只走事件总线广播，不回写配置。

### 整体数据流

```text
用户交互
   │
   ▼
组件 emit(eventName, payload)
   │
   ├── 容器组件：useEmitAdaptor(events) 拦截 / 改名 / 自定义转发
   │
   └── Playground：getLiveEventHandlers 挂载监听
            │
            ├── 总线广播 _bus.emit(eventName, payload)
            └── exampleModel 命中 → 按 target 写回 comConf
                  exampleModel 未命中 → 仅广播，不回写
```

## 关键细节

- **原生事件默认被拦截**：`useEmitAdaptor` 收到 `payload instanceof Event` 时先
  `stopPropagation()`，避免原生点击/表单事件穿透容器。
- **`exampleModel` 是注册表级别的演示约定**：业务代码直接使用组件时并不需要它，它只服务
  Playground 与动态配置器。
- **事件名归一化与模板**：改名、写回路径都走 `Tmpl.exec`，可以引用 `payload` 字段。
- **`TiComImpl.events`** 来源于组件 `com.emits`，不要在 `TiComInfo` 里重复手工维护事件清单。

## 主要代码入口

- `src/lib/_features/use-emit-adaptor.ts` —— 事件适配器 hook。
- `src/core/_top/ti-com.ts` —— `events` 清单收集、`exampleModel` 缺省值。
- `src/_type/core-types.ts` —— `EmitAdaptor`、`EmitAdaptorProps`、`TiComExampleModelTarget`。
- `ti-demo` 工程 `src/components/playground/use-playground-api.ts` —— 回写规则的实际消费方。

## 延伸阅读

- 组件注册表与 `exampleProps`：[组件模型](01-component-model.md)。
- 事件总线 `TiAppBus`：[_top 顶级工具](../20.core-utils/160-top.md)。
- 每个组件的事件清单在对应组件篇 `## Events` 小节列出。
