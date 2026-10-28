---
title: Net 网络辅助
keywords: [Net, 动态导入, ES Module, import, loadESModule, importESModule, QQBrowser, 网络, polyfill]
status: draft
---

# `Net` 网络辅助

## 职责

`Net` 是 `src/core/net/ti-net.ts` 导出的无 UI 依赖网络小工具命名空间。当前版本它只做一件事：
**在浏览器里动态加载远程 ES Module，并绕过部分旧浏览器（如 QQBrowser）不支持原生
`import()`、或动态脚本丢 cookie 的问题**。

它不是通用 HTTP 客户端（没有封装 `fetch`/`axios`），只解决「按 URL 拉一个 `.mjs` 模块并拿到
其导出命名空间」这一个场景，供组件库做按需远程加载时使用。

## 导出清单

### 动态 ES Module 加载

- **`Net.loadESModule(url)`** —— 加载入口。优先用原生 `import(url)`；检测到 UA 含
  `QQBrowser` 时改走 `importESModule` polyfill，避免丢 cookie 导致会话失效。
- **`Net.importESModule(url)`** —— polyfill 实现：把 URL 转绝对地址，生成一段
  `import * as m from "<absURL>"; window.<随机名> = m;` 的 Blob 脚本，以
  `<script type="module" crossOrigin="use-credentials">` 注入 `<head>`，加载完成后把模块
  命名空间 resolve 出来并清理临时脚本与 `URL.createObjectURL`。

## 典型用法

```ts
import { Net } from "@site0/tijs";

// 按 URL 动态加载远程 ES Module，拿到其全部导出
const mod = await Net.loadESModule("https://cdn.example.com/foo.mjs");
// mod 即远程模块的命名空间对象，等价于原生 import() 的返回

// 强制走 polyfill（如已知目标环境是 QQBrowser）
const mod2 = await Net.importESModule("https://cdn.example.com/bar.mjs");
```

> 本命名空间当前无单元测试覆盖；上述示例按源码行为描述，未对真实 CDN 地址做运行验证。

## 注意事项

- **依赖浏览器环境**：`importESModule` 内部直接操作 `document`、`window`，只能在浏览器里用，
  SSR 环境不可用。
- **QQBrowser 分支靠 UA 字符串判断**：`UA.indexOf("QQBrowser") > 0`，其他旧浏览器的兼容
  属于源码中 `TODO` 备注的待办，当前未实现。
- **加载失败会 reject**：脚本 `onerror` 时抛出 `Error("Failed to import: <url>")`；原生
  `import()` 失败时原样向上抛错，调用方需自行 `catch`。
- **导出面刻意保持小**：当前 `ti-net.ts` 只导出上述两个函数，没有提供请求缓存、并发去重、
  超时控制等能力；远程重复加载会重复执行模块脚本。

## 延伸阅读

- **源码入口**
  - `src/core/net/ti-net.ts` —— `Net` 全部实现（`loadESModule` / `importESModule`）。
- **相关文档**
  - 组件注册与动态渲染机制：[组件模型](../10.concepts/01-component-model.md)。
