# Tijs 控件库的控件编写规范

## 1. 概述

Tijs 是一个基于 Vue 3 的控件库，专为构建现代化 Web 应用而设计。本规范旨在统一控件的开发模式、命名约定和代码结构，确保控件库的一致性、可维护性和扩展性。

## 2. 控件分类

Tijs 控件库将控件分为以下几大类别，每种类型有特定的职责和使用场景：

| 分类 | 英文名称 | 描述 | 示例控件 |
|-----|---------|------|---------|
| 动作 | ACTION | 执行用户命令的控件 | TiButton、TiActionBar、TiPager ... |
| 输入 | INPUT | 接收用户输入的控件 | TiInput、TiCheck、TiDroplist ... |
| 编辑 | EDIT | 处理复杂数据编辑的控件 | TiCodeEditor、TiRichTinyMCEditor ... |
| 搁架 | SHELF | 组合子控件并进行布局的控件 | TiForm、TiLayoutGrid ... |
| 瓦片 | TILE | 小面积信息展示的控件 | TiIcon、TiLabel、TiProgressBar ... |
| 视图 | VIEW | 处理复杂数据展示的控件 | TiTable、TiTree、TiList ... |

**控件分类的应用：**
- 在 `lib-com-types.ts` 中按照分类组织控件类型
- 在 `index.ts` 中通过 `race` 属性指定控件分类
- 分类信息用于控件库的浏览、搜索和筛选功能

## 3. 控件文件结构

一个完整的 Tijs 控件通常包含以下文件（根据控件复杂度选择性创建）：

```bash
/{控件名称}/             # 控件的源码目录（使用 kebab-case）
|-- {控件名称}.vue       # 控件主体文件（Vue SFC）
|-- {控件名称}-types.ts  # 类型定义文件
|-- {控件名称}.scss      # 样式定义文件
|-- use-{控件名称}.ts    # 逻辑 hooks 文件
|-- {控件名称}-index.ts  # 控件导出与注册文件
```

**说明：**
- 简单控件（如 TiIcon）可能只需要 `.vue`、`-types.ts` 和 `-index.ts` 文件
- 中等复杂度控件（如 TiButton）通常需要以上所有文件
- 复杂控件（如 TiTable）会拆分为多个子组件和 hooks 文件，形成更复杂的目录结构
- 对于特别复杂的控件，可以拆分为多个 hooks 文件，如 `use-{控件名称}-api.ts`、`use-{控件名称}-actions.ts` 等

## 4. 命名规范

### 4.1 组件命名

- **组件名称**：使用 CamelCase，以 Ti 为前缀（如 TiButton、TiTable）
- **文件名**：使用 kebab-case（如 ti-button.vue、ti-table-types.ts）
- **类型接口**：使用 CamelCase，并添加 Props 后缀（如 ButtonProps、TableProps）
- **内部类型**：使用 CamelCase（如 TableRowData、TableCellEventPayload）

### 4.2 控件类型注册

所有控件类型名称在 `lib-com-types.ts` 文件中统一管理，使用大驼峰命名：

```typescript
// lib-com-types.ts
export const COM_TYPES = {
  //------------------- ACTION
  ActionBar: "TiActionBar",
  Button: "TiButton",
  // 其他控件...
};
```

## 5. 控件实现规范

### 5.1 Vue SFC 文件

Vue 单文件组件是控件的主体，包含 template、script 和 style 三部分：

```vue
<script lang="ts" setup>
// 引入必要的依赖
import { computed, ref } from 'vue';
import { 相关依赖 } from '../../'; // 从 lib 目录引入共享依赖
import { 控件名称Props } from './控件名称-types'; // 从当前目录引入类型定义
// 如需使用 hooks
// import { use控件名称 } from './use-控件名称'; // 从当前目录引入 hooks

// 定义组件选项
defineOptions({
  name: 'Ti控件名称', // 可选，但推荐添加
  inheritAttrs: true, // 通常设为 true
});

// 定义组件的事件
const emit = defineEmits<控件名称Emitter>();

// 定义组件的属性，并提供默认值
const props = withDefaults(defineProps<控件名称Props>(), {
  // 默认值配置
});

// 组件逻辑实现
// ...
</script>
<template>
  <!-- 组件模板 -->
</template>
<style lang="scss" scoped>
// 如果有外部 SCSS 文件
@use './控件名称.scss';
</style>
```

### 5.2 类型定义文件

所有控件的类型定义都应放在独立的 `types.ts` 文件中：

```typescript
// 引入必要的基础类型
import { CommonProps, Vars, 其他必要类型 } from '../../../_type';

// 定义组件的属性接口
export type 控件名称Props = CommonProps & {
  // 自定义属性
};

// 定义组件的事件接口（如有）
export type 控件名称Emitter = {
  (event: '事件名称', payload: 事件数据类型): void;
  // 其他事件...
};

// 定义内部使用的类型（如有）
export type 内部类型名称 = {
  // 类型定义
};
```

### 5.3 样式文件

使用 SCSS 编写样式，并遵循以下规范：

```scss
// 引入基础样式变量
// 有些控件可能会直接在 style 标签内编写样式，不单独创建 scss 文件
@use '@site0/tijs/sass/_all.scss' as *;

// 控件主样式
.ti-控件名称 {
  // 样式定义
  // 推荐使用 CSS 变量进行主题化
  // 例如: color: var(--ti-color-primary);
}
```

**常用 CSS 变量：**
- `--ti-color-primary`: 主色调
- `--ti-color-success`: 成功色
- `--ti-color-warning`: 警告色
- `--ti-color-danger`: 危险色
- `--ti-fontsz-m`: 中等字体大小
- `--ti-gap-m`: 中等间距
- `--ti-box-pad-m`: 中等内边距
- `--ti-measure-r-m`: 中等圆角

### 5.4 Hooks 文件

对于复杂的控件，可以将逻辑拆分为多个 hooks 文件，遵循以下规范：

```typescript
import { computed, ref } from 'vue';
import { 相关依赖 } from '../..';
import { 控件名称Props, 控件名称Emitter } from './控件名称-types';

// 定义 hooks 的返回类型
export type 控件名称Feature = ReturnType<typeof use控件名称>;

// hooks 实现
export function use控件名称(props: 控件名称Props, emit: 控件名称Emitter) {
  // 内部状态和计算属性
  
  // 方法实现
  
  // 返回公共 API
  return {
    // 暴露的状态和方法
  };
}
```

### 5.5 导出与注册文件

每个控件都应有一个 `index.ts` 文件，用于导出控件及其信息：

```typescript
import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import Ti控件名称 from './Ti控件名称.vue';
import { 控件名称Props } from './控件名称-types';

// 定义国际化文本
en_us = {
  'com-name': '控件英文名称',
  // 其他国际化文本
};

zh_cn = {
  'com-name': '控件中文名称',
  // 其他国际化文本
};

// 获取控件类型
const COM_TYPE = COM_TYPES.控件名称;

// 定义控件信息
const Ti控件名称Info: TiComInfo = {
  icon: 'fas-对应的图标', // 使用 Font Awesome 图标
  race: TiComRace.对应分类, // 如 ACTION、INPUT、VIEW 等
  name: COM_TYPE,
  text: 'i18n:com-name', // 国际化文本键，通常使用通用键
  i18n: {
    en_us: en_us,
    en_uk: en_us, // 英文（英国）通常使用英文（美国）的翻译
    zh_cn: zh_cn,
    zh_hk: zh_cn, // 中文（香港）通常使用中文（大陆）的翻译
  },
  com: Ti控件名称,
  install: (app: App) => {
    app.component(COM_TYPE, Ti控件名称);
  },
  defaultProps: '默认示例名称', // 可选
  exampleProps: [
    // 示例配置，可选
  ],
};

// 导出控件、类型和信息
export * from './控件名称-types';
export { Ti控件名称, Ti控件名称Info };
```

## 6. 核心编码规范

### 6.1 使用 Composition API

所有控件都应使用 Vue 3 的 Composition API 进行开发，遵循以下模式：

```typescript
// 定义 props
const props = withDefaults(defineProps<PropsType>(), {});

// 定义 emits
const emit = defineEmits<EmitterType>();

// 定义响应式状态
const state = ref(initialValue);

// 定义计算属性
const computedValue = computed(() => {
  return /* 基于 props 或 state 的计算逻辑 */;
});

// 定义方法
function method() {
  // 方法实现
}
```

### 6.2 类型安全

所有控件都应使用 TypeScript 进行类型定义，确保类型安全：

- 为所有 props 定义类型接口，并扩展 `CommonProps`
- 为所有事件定义事件类型接口（使用函数重载语法）
- 为所有返回值、参数等添加类型注解
- 避免使用 `any` 类型（除非有充分理由）

**CommonProps 包含以下通用属性：**
```typescript
export type CommonProps = {
  /**
   * 大多数控件都可以接受一个属性，用来特殊指定自己的特殊类选择器
   */
  className?: any;

  style?: Vars;
};
```

### 6.3 CSS 样式规范

- 使用 CSS 变量进行主题定制
- 遵循 BEM 或类似的命名约定
- 使用 flex 或 grid 进行布局
- 确保响应式设计

### 6.4 国际化支持

所有面向用户的文本都应支持国际化：

```typescript
// 在 index.ts 中定义国际化文本
const en_us = { 'com-name': 'Button' };
const zh_cn = { 'com-name': '按钮' };

// 在组件中使用国际化文本
const buttonText = computed(() => {
  if (props.autoI18n) {
    return I18n.text(props.text);
  }
  return props.text;
});
```

## 7. 组件通信规范

### 7.1 Props / Emits

使用 Vue 标准的 Props/Emits 机制进行父子组件通信：

```typescript
// 父组件向子组件传递数据
<ChildComponent :prop-name="value" />

// 子组件向父组件发送事件
emit('event-name', payload);
```

**事件命名规范：**
- 使用 kebab-case（如 `row-change`、`cell-select`）
- 对于常见交互，使用标准事件名（如 `click`、`change`）
- 对于特定场景，使用更具体的事件名（如 `cell-change`、`row-select`）

### 7.2 依赖注入

对于深层嵌套的组件，可以使用 Vue 的依赖注入机制：

```typescript
// 父组件提供数据
provide('key', value);

// 子组件注入数据
const value = inject('key');
```

## 8. 文档与示例

每个控件都应提供完整的文档和使用示例，包括：

- 控件的用途和使用场景
- 所有 props、events 的详细说明
- 样式定制选项
- 常见使用示例

在 `index.ts` 文件中，通过 `exampleProps` 提供示例配置：

```typescript
exampleProps: [
  {
    name: 'simple-example',
    text: 'i18n:example-simple',
    comConf: {
      // 示例配置
    },
  },
  // 更多示例...
],
```

## 9. 总结

遵循以上规范可以确保 Tijs 控件库的所有控件具有统一的结构和行为，提高代码的可维护性和可扩展性。在开发新控件时，请务必参考此规范，并保持与现有控件的一致性。

## 10. 最佳实践

- **单一职责原则**：每个控件只负责一个明确的功能
- **可组合性**：设计时考虑控件如何与其他控件组合使用
- **可定制性**：通过 props 和 CSS 变量提供足够的定制选项
- **性能优化**：避免不必要的渲染和计算，使用 `computed` 和 `watch` 进行优化
- **错误处理**：提供合理的默认值和错误处理机制
- **可访问性**：确保控件符合 Web 可访问性标准

通过遵循这些规范和最佳实践，我们可以构建出高质量、一致且易于使用的 Vue 控件库。