---
title: fuse 异步保险丝
keywords: [fuse, 保险丝, 熔断, Detonator, useFuse, FuseApi, fire, 取消操作, 异步守卫]
status: draft
---

# `fuse` 异步保险丝

## 职责

`fuse` 是 `src/core/fuse/` 导出的异步「保险丝 / 熔断」机制命名空间，用一个轻量的发布-订阅
模型让多处业务在执行某个操作前统一询问一句：**现在该不该熔断？**

每个保险丝（`FuseApi` 实例，按字符串 key 区分）挂着一组 `Detonator`——返回
`Promise<boolean|undefined|void>` 的异步判定函数。执行方在做有副作用的操作前调 `fire()`：
依次 `await` 所有 Detonator，**任何一个返回 `true` 就立即熔断（整体返回 `true`）**；全部为假
或没有 Detonator 则放行（返回 `false`）。

它解决的是「一次交互要不要被拦截」这种跨组件守卫问题：`Wall`（墙）与 `Table`（表格）的
选中变更前都会 `useFuse().fire(key)`，被熔断就中止本次切换。它不做错误重试、不统计失败率，
与熔断模式（circuit breaker）的自动恢复无关，只是一个可插拔的异步拦截闸门。

## 导出清单

### 工厂入口

- **`useFuse()`** —— 取全局保险丝工厂（`FuseFactory`），内部维护一份
  `Map<key, FuseApi>` 的全局状态。返回：
  - **`fire(key = "_dft_fuse_key")`** —— 取（或建）该 key 的保险丝并 `await` 其 `fire()`。
  - **`get(key?)`** —— 取已有 `FuseApi`，未创建返回 `undefined`。
  - **`getOrCreate(key?)`** —— 取或建 `FuseApi`，保证非空。
  - **`remove(key?)`** —— 删除某 key 的保险丝，返回是否删成功。
- **`__getAllFuseData()`** —— 直接暴露内部 `Map<key, FuseApi>`（调试 / 测试用，带下划线前缀
  表示内部态）。

### 保险丝实例（`FuseApi` 类型）

通过 `useFuse().get() / getOrCreate()` 拿到实例后可调用：

- **`fire(): Promise<boolean>`** —— 顺序执行所有 Detonator；任一返回真值即短路返回 `true`。
- **`add(key, det)`** —— 注册一个 Detonator（同名覆盖）。
- **`remove(key)`** —— 摘除指定 Detonator。
- **`clear(keys?)`** —— 传 `undefined`/空清空全部；传数组只清指定 Detonator。
- **`keys()`** —— 返回已注册 Detonator 的 key 数组。

### 类型

- **`FuseApi`** —— `createFuseApi()` 的返回类型（即上面这组实例方法）。
- **`FuseFactory`** —— `useFuse()` 的返回类型（`fire/get/getOrCreate/remove`）。

> 实现工厂 `createFuseApi()` 本身**未通过 `index.ts` 对外导出**，只用于在 `fuse-types.ts` 里
> 推导 `FuseApi` 类型、在 `fuse-factory.ts` 里创建实例；外部一律走 `useFuse()`。

## 典型用法

仓库内现有消费方是 `Wall` / `Table` 的选中守卫：先 `fire`，熔断就中止。下面示例据此改写。

```ts
import { fuse } from "@site0/tijs";

// 1. 业务侧：往默认保险丝挂一个「是否允许切换」的异步判定
const factory = fuse.useFuse();
const api = factory.getOrCreate("select:wall");
api.add("dirty-check", async () => {
  // 例如：表单有未保存修改时返回 true，熔断本次选中切换
  return await askUserConfirm();
});

// 2. 执行侧：选中变更前先问一句该不该熔断
const fired = await factory.fire("select:wall");
if (fired) {
  return; // 已熔断，中止本次操作
}
// 未熔断，继续执行选中切换……
```

默认 key 为 `"_dft_fuse_key"`，不传 key 即使用它：

```ts
const factory = fuse.useFuse();
await factory.fire();   // 命中默认保险丝
```

## 注意事项

- **`fire` 是短路的**：Detonator 按注册顺序顺序 `await`，第一个返回真值的立即结束，
  后续 Detonator 不再执行；返回 `false/undefined/void` 视为「未引爆」，继续下一个。
- **key 即隔离粒度**：不同 key 对应互不干扰的保险丝；`Wall`/`Table` 把组件 `props.fuse`
  （字符串）当作 key，不传则共用默认保险丝。
- **熔断语义是「任一说停就停」**：与多数熔断框架「累计失败才断」不同，这里没有计数、
  没有窗口期、没有自动恢复，`fire` 每次都实时问一遍所有 Detonator。
- **当前仓库内没有 Detonator 注册方**：`Wall`、`Table` 只调用 `fire()`，全仓库没有任何代码
  调用 `FuseApi.add()` 注册判定函数——`add/remove/clear/keys` 已实现并随 `FuseApi` 类型暴露，
  但当前版本未接线，预留为扩展点。
- **当前无单元测试覆盖**：`src/test/core/` 下没有 fuse 相关用例；上述行为均直接核对
  `fuse-api.ts` / `fuse-factory.ts` 源码得出。

## 延伸阅读

- **源码入口**
  - `src/core/fuse/index.ts` —— `fuse` 命名空间出口（转出口 `fuse-factory`、`fuse-types`）。
  - `src/core/fuse/fuse-factory.ts` —— `useFuse()`、全局 `Map<key, FuseApi>` 状态。
  - `src/core/fuse/fuse-api.ts` —— `createFuseApi()`：`fire/add/remove/clear/keys` 实现。
  - `src/core/fuse/fuse-types.ts` —— `FuseApi` / `FuseFactory` 类型推导。
- **相关文档**
  - 现有消费方（选中守卫）：`src/lib/view/wall/use-wall.ts`、`src/lib/view/table/use-table.ts`。
