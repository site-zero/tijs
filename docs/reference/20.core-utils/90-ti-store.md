---
title: TiStore 本地存储
keywords: [TiStore, TiStorage, localStorage, sessionStorage, 本地存储, 会话存储, 缓存, getObject, getInt, getBoolean, JSON5]
status: draft
---

# `TiStore` 本地存储

## 职责

`TiStore` 是 `src/core/storage/ti-storage.ts` 导出的本地 / 会话存储封装。它在 Web 原生
`Storage`（`localStorage` / `sessionStorage`）之上补了三件事：**按类型自动读写**（字符串、
数字、布尔、对象数组）、**对象读取走 JSON5 容错解析**、**空值写入即删除**。

需要区分两层：导出的 **类 `TiStorage`** 接受任意 `Storage` 实例构造；以及模块预建好的两个
**实例 `local` / `session`**，分别绑死 `localStorage` 与 `sessionStorage`，业务代码直接用即可。

## 导出清单

### 类 `TiStorage`（构造时传入一个 `Storage`）

**读取（键不存在时返回缺省值）**

- **`get<T>(key, dft, formater)`** —— 通用读取：取出原始串后交给 `formater` 转换；
  键不存在直接返回 `dft`。
- **`getString(key, dft="")`** —— 读字符串，原样返回。
- **`getObject(key, dft={})`** —— 读对象，用 `JSON5.parse` 容错解析。
- **`getStrArray(key, dft=[])`** —— 读字符串数组，同样走 `JSON5.parse`。
- **`getInt(key, dft=-1)`** —— 读整数（`parseInt`），缺省 `-1`。
- **`getNumber(key, dft=-1)`** —— 读浮点数（`parseFloat`），缺省 `-1`。
- **`getBoolean(key, dft=false)`** —— 读布尔；仅当原始串匹配 `true|yes|on|ok`
  （大小写敏感）时为 `true`。

**写入与删除**

- **`set(key, val)`** —— 写任意值；`val` 为 `null/undefined` 时转成 `remove`；否则用
  `Str.anyToStr` 转字符串后写入。
- **`setObject(key, obj?)`** —— 写对象（`JSON.stringify`）。
- **`mergeObject(key, obj?)`** —— 读取已有对象后用 `_.merge` 深合并再写回；`obj` 为空
  直接跳过。
- **`remove(key)`** —— 删除单个键。
- **`clear()`** —— 清空整个绑定的 `Storage` 域。

### 预建实例

- **`TiStore.local`** —— 绑 `globalThis.localStorage` 的实例，跨会话持久。
- **`TiStore.session`** —— 绑 `globalThis.sessionStorage` 的实例，随标签页会话结束。

## 典型用法

```ts
import { TiStore } from "@site0/tijs";

// 直接用预建实例，无需自己 new；写入统一走 set
TiStore.local.set("user.name", "xiaobai");
TiStore.local.getString("user.name")            // "xiaobai"
TiStore.local.getString("nope", "未设置")        // "未设置"

TiStore.local.set("age", 18);
TiStore.local.getInt("age")                      // 18

TiStore.local.set("dark", true);
TiStore.local.getBoolean("dark")                // true

// 对象读取走 JSON5，容忍尾逗号等宽松写法
TiStore.local.setObject("profile", { name: "qing", tags: ["a", "b"] });
TiStore.local.getObject("profile")               // { name: "qing", tags: [...] }

// 深合并已有对象
TiStore.local.mergeObject("profile", { city: "bj" });

// 空值写入等价于删除
TiStore.local.set("age", null);                 // 删除 "age"

// 会话级存储：关标签页即失效
TiStore.session.set("draft", "编辑中...");
```

> 本命名空间当前无单元测试覆盖；上述示例按源码行为描述。

## 注意事项

- **`setObject` 的实现疑点**：源码中 `obj` 为 `null/undefined` 时调用了 `remove(key)`，
  但**缺少 `return`**，随后仍会执行 `JSON.stringify(obj)` 并把字符串 `"undefined"` 写回去，
  即「写空对象」并不会真正删键，反而留下脏数据。依赖该行为前请先核实，或改用
  `set(key, null)` 明确删除。
- **读与写的序列化不对称**：`set` 用 `Str.anyToStr`（对象走 `JSON.stringify`），但
  `getObject/getStrArray` 用 `JSON5.parse`；读取容错更宽松，写入仍是标准 JSON。
- **`getBoolean` 只认四个词**：`true / yes / on / ok`，其余（含 `"1"`、`"True"`）一律
  判为 `false`。
- **缺省值口径**：`getInt/getNumber` 默认缺省是 `-1` 而非 `0`，用之前确认语义符合预期。
- **模块加载期即访问 `globalThis.localStorage/sessionStorage`**：在 SSR 或无 `Storage`
  的环境里 import 本模块会直接抛错；浏览器环境外请自行 `new TiStorage(自定义Storage)`。
- **`clear()` 是整域清空**：会清掉该 `Storage` 域下全部键，不只是本库写入的。

## 延伸阅读

- **源码入口**
  - `src/core/storage/ti-storage.ts` —— `TiStorage` 类与 `local/session` 预建实例。
- **相关文档**
  - [10-str](10-str.md) —— `set` 序列化底层的 `Str.anyToStr`。
