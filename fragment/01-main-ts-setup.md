# main.ts 五步接入引导

## 何时用

新业务工程接入 `@site0/tijs`，或排查「组件没注册上」「语言包没生效」类问题。

## 片段

```ts
// main.ts —— 顺序不能乱
import { createApp } from 'vue';
import App from './App.vue';
import {
  installTiCoreI18n,
  init_ti_std_fields,
  init_ti_std_columns,
  installTiComponents,
  updateInstalledComponentsLangs,
} from '@site0/tijs';

installTiCoreI18n('zh-cn');        // 1. 并入核心语言包
init_ti_std_fields();              // 2. 注册内置标准字段
init_ti_std_columns();             // 2. 注册内置标准表格列
const app = createApp(App);        // 3. 建应用
installTiComponents(app);          // 4. 批量注册全部组件
updateInstalledComponentsLangs('zh-cn'); // 5. 注册完成后统一切语言
```

```scss
// 入口样式两行
@use "@site0/tijs/sass/_all.scss" as *;
@use "@site0/tijs/sass/app.scss";
```

## 要点与坑

- 自定义组件用 `tiPutComponents({ 名称: 组件信息 })` 追加，**必须在第 4 步之前**调用。
- `updateInstalledComponentsLangs(...)` **必须在第 4 步之后**，否则组件语言包不生效。
- `vue` 是外部依赖，不会被打进产物；业务工程自己装。
- 机制详解见 `doc/reference/10.concepts/01-component-model.md` 与
  `doc/reference/00.start-here/01-getting-started.md`。
