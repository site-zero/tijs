---
title: use-keep 状态持久化存取
keywords: [hook, useKeep, use-keep, keep, keepAt, keepMode, session, local, 持久化, TiStore, 状态保存]
status: draft
---

# `use-keep` 状态持久化存取

## 解决什么问题

标签页当前激活项、网格列宽、表格列显隐、地图缩放级别这类「用户上次怎么用」的状态，需要
在刷新或再次打开后恢复。直接读写 `localStorage / sessionStorage` 要处理键名、JSON 序列化、
类型转换，每个组件重复一遍。

`useKeep` 按一个键名把这套存取固定下来：字符串/布尔/数字直接存，对象用 JSON5 序列化，
并提供按类型读出的方法。它被 `TiTabs`、`TiLayoutTabs`、`TiTabsForm`（记住激活标签）、
布局网格（记住显示列与列宽）、表格（记住列配置）、`TiComboFilter`、LBS 地图等使用。

## 输入 Props

`KeepInfo = KeepProps | string`；`KeepProps`（在 `use-keep.ts` 内声明）：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `keepAt` | `string` | 状态持久化的键名 |
| `keepMode` | `"session" \| "local"` | 持久化方式，`useKeep` 内缺省 `session` |

也可直接传字符串，两种简写形式：

- `"键名"` —— 用 `useKeep` 缺省模式 `session`；
- `"session:键名"` / `"local:键名"` —— 正则 `/^((session\|local):\s*)?(.+)/` 解析出
  模式与键名。

## 返回值 API

```ts
const keep = useKeep(props.keepTab);
```

返回 `KeepFeature`（`ReturnType<typeof useKeep>`）：

- **`storeKey: string | undefined`** —— 实际使用的键名；未配置 `keepAt` 时为 `undefined`。
- **`enabled: boolean`** —— `keepAt` 非空即为 `true`，表示是否真正接入持久化。
- **`mode: KeepMode`** —— 实际生效的模式（`"session"` / `"local"`）。
- **`save(data: any)`** —— 写入：字符串/布尔/数字原样 `keep.set`；其他对象用
  `JSON5.stringify` 后存储。
- **`load(dft?: string): string | undefined`** —— 读出原始字符串，未配置键时返回 `dft`。
- **`loadObj(dft?: Vars): Vars | null`** —— 读出后 `JSON5.parse` 为对象，无值返回
  `dft ?? null`。
- **`loadArray(dft?: any[]): any[] | null`** —— 同上，读出为数组。
- **`loadNumber(dft?: number): number`** —— 读出并 `parseFloat`，`NaN` 时返回 `dft ?? 0`。
- **`remove()`** —— 移除该键。

底层通过 `TiStore.session` / `TiStore.local` 存取；文件另导出工具函数
**`makeKeepProps(info, dftKeepMode = "local")`**，把字符串或对象规格归一成 `KeepProps`。

## 配合使用

- **与 `computed`**：消费方普遍用 `computed(() => useKeep(props.keepXxx))` 包一层，跟随
  Props 变化重建存取器。
- **`save` 与 `load*` 配对**：存对象用 `save(obj)`、取用 `loadObj()`；存数字用
  `save(n)`、取用 `loadNumber(dft)`，避免手动 JSON 转换。

典型调用片段：

```ts
import { computed } from 'vue';
import { useKeep } from '../_features';

// 记住标签页激活项，缺省 session
const Keep = computed(() => useKeep(props.keepTab));

// 初始化时读取上次状态
const activeTab = Keep.value.load('first');

// 切换时保存新状态
function onTabChange(name: string) {
  Keep.value.save(name);
}
```

## 注意事项

- **未配置 `keepAt` 时 `enabled` 为 `false`**：`save / load` 全部空转，可安全调用而不必
  先判空。
- **`useKeep` 缺省 `keepMode = "session"`**，而 `makeKeepProps` 缺省为 `"local"`；二者
  缺省不同，按调用方为准。
- **对象走 JSON5**：`loadObj / loadArray` 用 `JSON5.parse`，存储格式与 `JSON5.stringify`
  对应，不要用纯 `JSON` 交叉读写。
- **字符串简写带前缀才生效**：`"local:key"` 中的冒号是模式分隔符，键名本身不要带
  `session:` / `local:` 前缀。

## 延伸阅读

- **源码入口**
  - `src/lib/_features/use-keep.ts` —— 本 hook 与 `makeKeepProps`。
  - `src/lib/shelf/layout/tabs/TiLayoutTabs.vue`、`src/lib/view/table/use-table-keep.ts` —— 典型消费方。
- **相关文档**
  - `keepAt / keepMode` 在共享 Props 体系中的位置：[共享 Props](../../10.concepts/02-common-props.md)。
