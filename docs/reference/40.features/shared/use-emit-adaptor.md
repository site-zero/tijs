---
title: use-emit-adaptor 子事件适配转发
keywords: [hook, useEmitAdaptor, use-emit-adaptor, EmitAdaptor, events, 事件适配, 容器组件, stopPropagation, 事件改名]
status: draft
---

# `use-emit-adaptor` 子事件适配转发

## 解决什么问题

容器类组件（如 `TiBlock`、`TiTextSnippet`）把子组件摆进自己的插槽后，不希望子组件事件
原样冒泡出去：有时要拦截原生 DOM 事件，有时要把事件名改名后再发，有时要完全自定义转发
逻辑。每个容器自己写一遍「遍历子事件 → 判断拦截/改名/自定义 → 再 emit」会重复。

`useEmitAdaptor` 遍历 `events` Props，为每个事件名生成一个监听函数，按取值形态选择适配
方式，统一交给 `options.handler` 出口。它目前被 `TiBlock`、`TiTextSnippet` 直接使用。

## 输入 Props

`EmitAdaptorProps`（定义在 `src/_type/core-types.ts`）：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `events` | `Record<string, EmitAdaptor>` | 事件名 → 适配规则的映射 |

`EmitAdaptor = boolean | string | EmitAdaptorHandler`：

- **`boolean`** —— 仅拦截：原生 `Event` 被 `stopPropagation()`；非原生载荷交给
  `options.handler`。
- **`string`** —— 事件改名：用 `Tmpl.exec` 以 `{ eventName, payload }` 为上下文渲染
  出新事件名，再交给 `options.handler`。
- **`EmitAdaptorHandler`** —— 自定义函数，收到 `{ eventName, orginName, data }` 后自行
  决定如何转发。

调用时还要传入：

- **`COM_TYPE: string`** —— 组件类型名，仅用于调试日志。
- **`options: EmitAdaptorOptions`** —— `{ ignoreNativeEvents?, handler? }`。

## 返回值 API

```ts
const listens = useEmitAdaptor(COM_TYPE, props, options);
```

- **`listens: Record<string, Function>`** —— 事件名 → 监听函数的映射。模板里把它展开绑到
  子组件上：`<Child v-on="listens" />`。

每个监听函数的行为：

1. 若 `ignoreNativeEvents`（缺省 `true`）且 `payload instanceof Event`，先
   `stopPropagation()` 并直接返回（原生事件被拦下，不再继续）。
2. `boolean` 规则：非原生载荷调 `options.handler({ eventName, orginName, data })`。
3. `string` 规则：`Tmpl.exec(adaptEmit, { eventName, payload })` 得出新事件名后，用新名
   作为 `eventName` 调 `options.handler`；未配 `handler` 时仅打印调试信息。
4. 函数规则：直接调用自定义适配函数，载荷同为 `{ eventName, orginName, data }`。

`options.handler` 是容器的统一出口：在其中把适配后的事件再 `emit` 给自己的父级。

## 配合使用

- **与容器 emits**：容器在 `options.handler` 内 `emit(newEventName, data)`，完成拦截/改名
  后的对外转发。
- **与子组件事件清单**：`events` 的键应是子组件 `emits` 中声明的事件名；未在
  `props.events` 里出现的事件本 hook 不生成监听函数。

典型调用片段：

```ts
import { useEmitAdaptor } from '../_features';

const emit = defineEmits<{ (e: string, payload: any): void }>();

const listens = useEmitAdaptor('TiBlock', props, {
  ignoreNativeEvents: true,
  handler({ eventName, orginName, data }) {
    // 统一出口：把适配后的事件转发给父级
    emit(eventName, data);
  },
});
```

```xml
<!-- 把子组件事件按 events 规则适配后再冒泡 -->
<slot-name v-on="listens" />
```

## 注意事项

- **原生事件默认被拦截**：`payload instanceof Event` 时 `stopPropagation()` 后直接返回，
  不再走 `handler`；需要原生事件继续冒泡时把 `ignoreNativeEvents` 设为 `false`。
- **`events` 中值为 `false` 的键会被跳过**：`if (!adaptEmit) continue`，不生成监听函数。
- **`string` 改名必须配 `handler`**：否则只在调试日志里输出新事件名，不做任何转发。
- `_features/index.ts` 将本 hook 标注为「可能要移除」（范围偏大、仅个别容器使用）；新增
  容器前先确认是否真的需要这套适配，而非直接透传子事件。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/use-emit-adaptor.ts` —— 本 hook 实现。
  - `src/_type/core-types.ts` —— `EmitAdaptorProps / EmitAdaptor / EmitAdaptorHandler / EmitAdaptorEvent`。
  - `src/lib/shelf/block/TiBlock.vue`、`src/lib/tile/text-snippet/TiTextSnippet.vue` —— 消费方。
- **相关文档**
  - 事件适配机制与 `exampleModel` 回写：[事件绑定](../../10.concepts/03-event-binding.md)。
