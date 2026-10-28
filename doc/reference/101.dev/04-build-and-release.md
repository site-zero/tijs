---
title: 构建与发布
keywords: [构建, build, vite, vue-tsc, tsc, dist, 产物, external, 发布]
status: draft
---

# 构建与发布

发包前的命令都登记在 `package.json` 的 `scripts` 里，不要自己另造脚本：

| 命令 | 实际执行 | 作用 |
| --- | --- | --- |
| `yarn build` | `vue-tsc && vite build && tsc --emitDeclarationOnly` | 类型检查 + 打包产物 + 生成类型声明 |
| `yarn test` | `vitest --silent=false` | 跑 core 工具层单测 |
| `yarn preview` | `vite preview` | 本地预览 `dist/` 构建结果 |

## yarn build 的三步

三步用 `&&` 串联，前一步失败就中断，不会带着类型错误出包。

**1. `vue-tsc`** —— 对 `.ts` 与 `.vue` 做全量类型检查。这是唯一能检查模板类型的步骤，
新增组件后这一步报错要先修类型再打包。

**2. `vite build`** —— 按 `vite.config.ts` 的库模式打包：

```ts
build: {
  outDir: "dist",
  sourcemap: true,
  lib: {
    entry: "index.d.ts",        // 根入口：re-export ./src，等价于从 src/index.ts 出发
    name: "Ti",
    fileName: (format) => `tijs.${format}.js`,
  },
  rollupOptions: {
    external: ["vue"],          // Vue 不打进产物
  },
}
```

产物落在 `dist/`，按 format 命名（如 `tijs.es.js`、`tijs.umd.js`），带 sourcemap。
**`vue` 是 external**：组件以 peer 方式消费宿主应用的 Vue，产物里不打包 Vue 运行时；
样式由 `dist/style.css` 与包内 sass 子路径另行引入。

**3. `tsc --emitDeclarationOnly`** —— 按 `tsconfig.json`（`declaration: true`、
`outDir: ./dist`、`rootDir: "."`）只吐 `.d.ts`，不产 JS。根 `index.d.ts` 只有一行
`export * from './src'`，是 npm 包的类型入口。

## package.json 的产物字段

```json
{
  "main": "./dist/tijs.umd.cjs",
  "module": "./dist/tijs.js",
  "files": ["index.d.ts", "dist", "assets"],
  "exports": {
    ".": {
      "__import": "./dist/tijs.es.js",
      "import": "./index.d.ts",
      "require": "./dist/tijs.umd.js",
      "types": "./index.d.ts"
    },
    "./style.css": "./dist/style.css",
    "./sass/_all.scss": "./src/assets/style/_all.scss",
    "./sass/app.scss": "./src/assets/style/app.scss"
  }
}
```

`files` 决定 publish 时带上哪些目录：类型入口 `index.d.ts`、构建产物 `dist/`、
静态资源 `assets/`。消费方按 `exports` 拿 ES 包、UMD 包与类型声明。

## 注意事项

- **不要手写 `dist/` 里的东西**；改完源码重跑 `yarn build`。
- 新增 npm 子路径导出时，先确认目标文件在 `files` 范围内，否则发包后别人装不到。
- `exports` 里 `"./style.scss": "./srsc/style.scss"` 的目录拼写疑似笔误（仓库中不存在
  `srsc/`）；在核对修正前，不要在业务代码里依赖这个子路径。
- `main` 指向 `dist/tijs.umd.cjs`，而 `exports.require` 指向 `dist/tijs.umd.js`，
  两者文件名不一致；发版前请实测一次安装解析，确认以哪份产物为准。

## 延伸阅读

- **源码入口**：`package.json`（`scripts` / `main` / `exports` / `files`）、`vite.config.ts`、`tsconfig.json`、根 `index.d.ts`
- **相关文档**：[测试约定](03-testing.md)（发版前应先跑 `yarn test`）、[仓库源码布局](01-source-layout.md)
