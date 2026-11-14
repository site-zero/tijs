# 编写 TiJS 控件（write-tijs-com）

> 任务：新增或修改 `src/lib/` 下的 Vue 控件，统一文件布局、各文件的编写方式，以及
> TypeScript 代码的命名和注释分割规则。改动前先回读真实源码，以源码为准。

# 概述

控件可以很简单，甚至一个 `.vue` 文件就可以放下所有逻辑。

控件也可以很复杂，逻辑甚至超过上万行。

我们的规范就是为了让控件无论复杂还是简单，其内部逻辑代码都能找到最合适的安放位置。
原则不是“每个文件都必须存在”，而是**按逻辑复杂度逐步拆分到最合适的层级**，让读者
凭目录结构就能快速预判代码的位置。

# 控件目录文件的组织

```bash
/COM DIR/
# 如果控件内部逻辑非常复杂，把逻辑一块块放在 support/ 目录下
# 让控件每部分的逻辑更清晰、更容易读懂
├── support/
│   ├── xxx-xxx-xxx.ts      # 控件内部交互逻辑、数据转换或辅助函数
│   └── index.ts            # support 成员的统一导出
├── my-com-index.ts         # 「必」TiComInfo、控件导出、配置示例、i18n
├── my-com-types.ts         # 「必」控件公开类型定义
├── MyCom.vue               # 「必」控件的 Vue 文件
├── my-com-api.ts           # 「选」控件逻辑较多时，从 Vue 文件中提取到这里
├── my-com.scss             # 「选」控件私有样式
├── i18n/                   # 「选」界面文案较多，index 文件放不下时拆到这里
│   ├── en-us.json          # 英文语言包
│   └── zh-cn.json          # 中文语言包
└── example/                # 「选」使用示例较多、较复杂时拆到这里
    ├── index.ts            # 示例统一导出
    ├── example-name-1.ts   # 控件使用示例 1
    └── example-name-2.ts   # 控件使用示例 2
```

因此控件的逻辑从简单到复杂，可以放逻辑的位置层层递进：

1. **简单**：`MyCom.vue` 文件就够了。
   > 示例：`src/lib/input/num/TiInputNum.vue`。主要逻辑、少量内部状态和事件处理直接放在
   > Vue 文件中；目录仍保留 `types / index` 用于类型和注册。
2. **普通**：`MyCom.vue` 文件 + `my-com-api.ts` 文件。
   > 示例：`src/lib/input/datetime/TiInputDatetime.vue` +
   > `src/lib/input/datetime/use-input-datetime-api.ts`。日期解析、格式化和变更通知从
   > Vue 文件中拆出，Vue 只做模板与子控件接线。
3. **复杂**：`MyCom.vue` 文件 + `my-com-api.ts` 文件 + `support/`。
   > 示例：`src/lib/input/combo/TiInputCombo.vue` +
   > `src/lib/input/combo/use-input-combo-api.ts` +
   > `src/lib/input/combo/support/`。组合输入、聚焦、失焦、选项提交等独立交互逻辑拆成
   > `support/*.ts`，由 `support/index.ts` 统一导出。

现有代码中也存在 `use-input-combo-api.ts`、`input-combo-types.ts` 等历史命名；修改旧控件时
与相邻文件保持一致，新控件优先使用本文件给出的 `my-com-*` 结构。已经存在的可选结构
若没有真实内容，不要保留空壳。

# 快速创建控件骨架（init-vue）

新控件不要从零手写文件，使用脚手架工具 `init-vue`（已加入系统 PATH，直接调用即可）
按需要的模块生成文件骨架：

```bash
# 在指定目录下生成 types / vue / index 三个必需文件
init-vue --dir src/lib/input/my-com --name MyCom types,vue,index

# 逻辑较多时再补 api 和 scss
init-vue --dir src/lib/input/my-com --name MyCom api,scss
```

支持的模块与生成文件：

| 模块 | 生成文件 |
| --- | --- |
| `types` | `my-com-types.ts` |
| `vue` | `MyCom.vue` |
| `index` | `my-com-index.ts` |
| `api` | `use-my-com-api.ts` |
| `scss` | `my-com.scss` |
| `action` | `use-my-com-actions.ts` |
| `form` | `gui-my-com-form.ts` |
| `table` | `gui-my-com-table.ts` |
| `layout` | `gui-my-com-layout.ts` |
| `schema` | `gui-my-com-schema.ts` |
| `filter` | `use-my-com-filter.ts` |

说明：

- 模块名用半角逗号分隔，按「简单 → 普通 → 复杂」的层级只生成真正需要的模块。
- `--dir` 不指定时在当前目录生成；`--prefix` 可替换除 `index` / `vue` 外其他文件的
  文件名前缀，一般不传。
- 工具生成的 `index` 骨架已采用 `const COM_TYPE = "MyCom";` 直接声明字符串的新约定。
- 骨架只是起点：生成后按本文各节的规范补齐 `TiComInfo` 字段、示例和 i18n，
  删掉用不到的模块文件；API 模板可能保留历史分组，需按本文核对和调整标题及成员归属，
  再对照「完成前快速自检」逐项检查。

# 控件文件编写规范

> 每个部分都给出尽量简短的代码示意，让读者能直觉理解规则，不必再去翻完整源码。
> 示例中的 `MyCom` 表示控件实现名，`my-com` 表示目录及 kebab-case 文件名。

## `my-com-index.ts` 文件

这个文件只负责控件元信息、语言包、示例和统一导出，不放业务逻辑。

### 组件命名要求

- Vue 组件使用 `Ti` + PascalCase：`MyCom.vue`。
- 目录和 TS 文件使用 kebab-case：`my-com/`、`my-com-index.ts`。
- 注册信息使用 `MyComInfo: TiComInfo`。
- 组件类型字符串在控件内直接声明为局部常量，不再经过 `COM_TYPES` 注册表：
  `const COM_TYPE = "TiMyCom";`。历史代码仍写作 `COM_TYPES.MyCom`，迁移期修改旧控件时
  与相邻文件保持一致。
- `TiComInfo` 的 `icon` 与 `race` 字段给出控件图标和分类（如 `race: TiComRace.INPUT`）；
  `liveStyle` 等可选字段按实际需要提供。
- 新增控件时，在对应类的 `all-*.ts` 中加入 `TiComSet` 映射和
  `export * from "./my-com-index"`。新控件不再操作 `src/lib/lib-com-types.ts`；
  只有修改仍依赖 `COM_TYPES` 注册表的旧控件时，才需要同步维护它。

### i18n 键规范

- i18n key 使用 kebab-case，并以组件名作为前缀，例如 `my-com-com-name`。
- 文案直接引用时写成 `i18n:my-com-com-name`。
- 通常让 `en_uk` 复用 `en_us`，让 `zh_hk` 复用 `zh_cn`。
- 文案较少时直接内联为普通对象；文案较多或需要 JSON 维护时拆到 `i18n/`，通过
  `i18n/index.ts` 汇总。

### example 规范

- 少量示例优先写成内联 `PlainObject`，不要为了一个简单示例新建目录。
- 示例必须写成可渲染的 `comConf`，不要写伪配置。
- `defaultProps` 填写一个真实存在的示例名。
- 示例较多或对象较大时，放到 `example/*.ts`，由 `example/index.ts` 导出后在 index 中引用。

### 组件导出

types、Vue 控件和控件信息都从这个文件统一导出：

```ts
const en_us = { "com-name": "My Com" };
const zh_cn = { "com-name": "我的控件" };
const COM_TYPE = "TiMyCom";

const MyComInfo: TiComInfo = {
  name: COM_TYPE,
  text: "i18n:my-com-com-name",
  i18n: { en_us, en_uk: en_us, zh_cn, zh_hk: zh_cn },
  com: MyCom,
  install: (app: App) => app.component(COM_TYPE, MyCom),
  defaultProps: "simple",
  exampleProps: [
    {
      name: "simple",
      text: "i18n:my-com-example-simple",
      comConf: {},
    },
  ],
};

export * from "./my-com-types";
export { MyCom, MyComInfo };
```

引用外部 i18n 或 example 时，只增加对应 import 和字段，不在 index 中复制内容：

```ts
import example from "./example";
import i18n from "./i18n";

const MyComInfo: TiComInfo = {
  // ...
  i18n,
  exampleProps: [example.simple, example.advanced],
};
```

## `my-com-types.ts` 文件

这个文件是控件的公开类型契约，`XxxProps`、`XxxEmitter`、`XxxApi` 和事件载荷从这里导出。

```ts
export type MyComEmitter = {
  (eventName: "change", payload: MyComChanged): void;
};

export type MyComChanged = {
  value: string;
  oldValue?: string;
};

export type MyComProps = CommonProps &
  ReadonlyProps & {
    value?: string;
    /** 为空时显示的提示文本。 */
    placeholder?: string;
  };

export type MyComApi = ReturnType<typeof useMyComApi>;
```

遵守以下规则：

- **`emit`**：一个事件一行重载，写清事件名和载荷类型；载荷复杂时先定义命名类型。
- **`props`**：按「数据 → 行为 → 外观」的语义分组；跨控件共享的 Props 通过交叉类型组合，
  不在本文件重复定义。
- **公开类型**：放在 `my-com-types.ts` 并随 `export *` 导出，供控件、API、示例和业务代码使用。
- **私有类型**：内部状态、setup 参数和仅服务实现的类型，放在 API 文件顶部或
  `support/*.ts`；不要把纯内部类型混进公开类型文件。
- **默认值**：写在 `.vue` 的 `withDefaults` 或 API 内部逻辑中；类型注释里的 `@default`
  必须与实现一致。
- **默认值工厂**：数组或对象类型的默认值使用工厂函数（`() => []`），避免多实例共享引用。
- **类型窄化**：类型保持显式；只有载荷确实可为任意值时才使用 `any`。
- **注释**：公开类型遵循后面的 TS 通用写作规范；字段说明使用紧邻字段的 JSDoc，不用分割行
  替代字段注释。

## `MyCom.vue` 文件

Vue 文件负责视图、Props / 事件接线和少量简单状态；复杂逻辑一旦让 `<script setup>` 难以阅读，
就提取到 API 或 `support/`。

头部是 import 区，**import 语句本身不加注释**；注释分割线从 import 之后开始，按代码行的
逻辑分组使用**无标题分割线**，不写大类名：

```xml
<script setup lang="ts">
  import { I18n } from "@site0/tijs";
  import { useMyComApi } from "./use-my-com-api";
  import type { MyComEmitter, MyComProps } from "./my-com-types";
  //-----------------------------------------------------
  const emit = defineEmits<MyComEmitter>();
  const props = withDefaults(defineProps<MyComProps>(), {
    placeholder: "",
  });
  //-----------------------------------------------------
  const api = useMyComApi(props, { emit });
  //-----------------------------------------------------
</script>

<template>
  <div class="my-com" :class="api.TopClass">
    <input
      :value="props.value"
      @change="api.tryNotifyChange($event.target.value)" />
  </div>
</template>

<style lang="scss" scoped>
  @use "./my-com.scss";
</style>
```

编写规则：

- `<script setup>` 按「import → 基础定义（emit / props）→ API → 模板引用 / 计算属性 →
  事件函数 → 数据监听 → 生命周期」的顺序组织，相邻的紧密逻辑合并为一组，组与组之间用无标题分割线。
- **数据监听放在 Vue**：控件的 `watch / watchEffect` 在 `.vue` 中显式注册，尤其是
  Props 同步和外部状态变化的接线；不要藏在组件 API 或 `support/` 中。监听回调保持简短，
  复杂状态处理调用 API 暴露的动作，API 负责“如何处理”，Vue 负责“何时触发”。
  移动已有监听时保留监听源、触发条件和 `immediate / deep / flush` 等选项，不顺带改变行为。
- **不解构 api**：保持 `const api = useMyComApi(props, { emit })`，模板里直接引用
  `api.TopClass`、`api.tryNotifyChange(...)` 等成员；这样模板的每个动作都能看清来自哪个
  API，也方便全文搜索定位实现。
- 使用 `defineProps<MyComProps>()` 和 `defineEmits<MyComEmitter>()`，类型来自 types 文件。
- 模板引用使用 `$` 前缀，配合 `useTemplateRef<HTMLElement>("main")` 声明。
- 响应用户操作的事件函数使用 `onChange` 这类 `on{CamelCase}` 命名。
- 事件只在值或状态真正变化后触发；若控件提供回调接管某个行为，调用回调即可，不要重复
  触发同义事件。
- 模板保持薄：不放复杂三元表达式和长数据处理，复杂计算交给 API 或计算属性；复杂模板按
  结构使用 `<!-- 区块说明 -->` 做视觉分割，不使用 TS 的 `//`。
- 根元素使用 `my-com` 类，内部区域使用 `part-*`，状态使用 `is-* / has-*`。
- 简单样式可以直接写在 SFC；样式较长、或需要与复杂模板同屏维护时，移到 `my-com.scss`，
  并按样式职责使用 SCSS 的 `//` 分割行。

## `my-com-api.ts` 文件

当 Vue 文件中的数据转换、状态流转和事件处理开始变多时，提取一个 `useMyComApi`。
API 文件集中表达“控件如何工作”，Vue 只负责“控件如何接线”。

`useMyComApi` 内按以下顺序组织大组，只保留有实际内容的分组：

1. **数据模型**：控件内部声明的响应式数据。
2. **计算属性**：从 Props、数据模型等派生的计算属性。
3. **事件响应**：挂载到 DOM 或组件事件的 `onXxx` 处理函数。
4. **数据校验**：检查数据正确性的函数。
5. **数据改动**：改变内部数据模型的方法。
6. **远程操作**：需要远程查询、更新等操作的 `async` 函数。
7. **暴露接口**：`return` 返回的对象。

大组使用上下两条分割线夹住一行组名，组名直接使用上面的名称，不附加单个函数或属性的
名称。组内函数原则上各用一条无标题分割线隔开；第一个函数前的大组标题已经起分隔作用。
数据模型和计算属性中，逻辑意义相近的成员可以连续放置，不必逐个加分割线。

`return` 对象内部使用 `// 数据模型`、`// 计算属性` 等单行注释，按同样的职责和顺序
给实际暴露的成员分组；没有暴露成员的组不必写。函数需要特殊说明时，在函数前使用 JSDoc，
不要用带名称的分组标题替代。

```ts
export type MyComApiSetup = {
  emit: MyComEmitter;
  save: (value: string) => Promise<void>;
};

export function useMyComApi(props: MyComProps, setup: MyComApiSetup) {
  const { emit } = setup;

  //-----------------------------------------------------
  // 数据模型
  //-----------------------------------------------------
  const _current_value = ref(props.value ?? "");

  //-----------------------------------------------------
  // 计算属性
  //-----------------------------------------------------
  const DisplayValue = computed(() => _current_value.value.trim());
  const HasValue = computed(() => DisplayValue.value.length > 0);
  //-----------------------------------------------------
  const TopClass = computed(() => ({
    "has-value": HasValue.value,
  }));

  //-----------------------------------------------------
  // 事件响应
  //-----------------------------------------------------
  function onChange(value: string) {
    const oldValue = _current_value.value;
    if (value === oldValue) {
      return;
    }
    setValue(value);
    emit("change", { value, oldValue });
  }

  //-----------------------------------------------------
  // 数据校验
  //-----------------------------------------------------
  function isValid(): boolean {
    return HasValue.value;
  }

  //-----------------------------------------------------
  // 数据改动
  //-----------------------------------------------------
  function setValue(value: string) {
    _current_value.value = value;
  }

  //-----------------------------------------------------
  // 远程操作
  //-----------------------------------------------------
  async function saveValue() {
    await setup.save(_current_value.value);
  }

  //-----------------------------------------------------
  // 暴露接口
  //-----------------------------------------------------
  return {
    // 数据模型
    currentValue: _current_value,
    // 计算属性
    DisplayValue,
    HasValue,
    TopClass,
    // 事件响应
    onChange,
    // 数据校验
    isValid,
    // 数据改动
    setValue,
    // 远程操作
    saveValue,
  };
}
```

编写规则：

- setup 参数定义成局部类型，例如 `MyComApiSetup` / `MyComApiOptions`。
- 内部响应式状态使用 `_` 前缀和 snake_case，例如 `_current_value`。
- 对外展示的计算属性使用 PascalCase，例如 `DisplayValue`、`CurrentItem`。
- 数据模型和计算属性各是一个大组；意义相近的成员可连续放置，不同的小组之间使用
  无标题分割线，不另建「计算属性：某某」这类带名称的大组。
- **函数之间使用单行无标题分割线**：原则上一个函数一个区块，不为每个函数写
  “数据校验：某某”“事件响应：某某”等带名称的分组。函数需要特殊说明时，使用紧邻函数
  的 JSDoc。
- 暴露函数使用 camelCase；内部辅助函数使用 snake_case；只有本函数内部使用的私有函数使用
  `_` 前缀。
- 优先使用 `const`，确实需要重新赋值时才使用 `let`。
- 返回值只暴露 Vue 或其他模块真正使用的成员，不返回大量内部临时变量；返回对象内的单行
  分组注释与成员的实际职责一致。
- API 只做控件内部状态和数据处理，通过返回的动作供 Vue 接线，不在 API 内注册控件的
  `watch / watchEffect`。远程请求放在「远程操作」大组，特殊用途和边界用 JSDoc 说明。
- 优先复用 lodash、`core/` 与 `_features/`（如 `use-readonly`、`use-class-style`）中的
  现成能力，不在控件内重复实现判空、深比较、只读、显隐和字典逻辑。
- 多个独立关注点拆成多个 `use-*.ts` 或 `support/` 文件，不堆成一个超长 API。

## `support/` 目录

当 API 仍然过长，或某组逻辑可以独立理解时，按交互职责拆到 `support/`：

```text
support/
├── index.ts          # support 成员统一导出
└── xxx-xxx-xxx.ts    # 一组独立逻辑，如聚焦、失焦、选项提交
```

编写规则：

- `support/` 只服务当前控件；成员由 `index.ts` 汇总导出，外部只依赖 `support/index`，
  不深入目录内部引用具体文件。
- 纯数据转换、查找、校验的模块不引入 Vue；确实需要响应式状态的模块用 `use-*.ts` 命名。
- 私有常量、私有类型和私有 helper 放在使用它们的导出函数之前。
- 函数之间同样使用单行无标题分割线，特殊说明使用 JSDoc；控件的数据监听由 Vue 接线，
  不通过下沉到 `support/` 隐藏监听。

## `my-com.scss` 文件

样式文件围绕根类组织，优先使用全局变量和 mixin，不直接散落硬编码颜色。

```scss
@use "@site0/tijs/sass/_all.scss" as *;

//-----------------------------------------------------
// 容器
//-----------------------------------------------------
.my-com {
  color: var(--ti-color-text);
  background: var(--ti-color-card);

  &.has-value {
    border-color: var(--ti-color-primary);
  }
}

//-----------------------------------------------------
// 输入区块
//-----------------------------------------------------
.my-com > .part-input {
  @include flex-align-nowrap;
}
```

编写规则：

- 根类与控件类名一致；内部区块使用 `.part-*`；状态类与模板中的 `is-* / has-*` 一致。
- 使用 `--ti-color-*`、`--ti-measure-*`、`--ti-fontsz-*` 等变量维护主题和尺度。
- 简单选择器直接嵌套在根类下；避免影响无关控件的全局选择器。
- **样式块同样使用注释分割行**：样式超过一屏或包含多个职责区域（容器、区块、状态、
  动画等）时，用 `//---` 横线加标题分节，与 TS 文件的分割行风格保持一致。
- 样式很短（不足一屏、单一职责）时不强行分节；紧邻的变量或 mixin 可用
  `//-------------------- 标题` 这种单行短分割线（参见 `src/assets/style/_mixins.scss`）。
- SCSS 注释统一使用 `//`；不要用大段注释重复描述已经能从类名看出的结构。

# `ts` 文件通用写作规范

所有规范的目的都是让人类阅读更轻松：即使没有语法高亮，也能通过字符形态，直觉意识到符号
的含义和所属层级。

## 变量的命名

- **内部状态**：使用 `_` 前缀，尽量采用 snake_case。
  ```ts
  const _current_item = ref<Vars>();
  const _options_data = ref<Vars[]>([]);
  const _table_column_map = computed(() => buildTableColumnsMap(props));
  ```
- **模块常量**：使用 UPPER_SNAKE_CASE，例如 `COM_TYPE`、`TI_APP_TIPS`。
- **计算属性**：使用首字母大写的 camelCase，也就是 PascalCase；它表示对外展示的视图模型，
  不是普通局部变量。
  ```ts
  const TopClass = computed(() => CssUtils.mergeClassName(props.className));
  const DisplayText = computed(() => api.getDisplayText());
  const CurrentItem = computed(() => findCurrentItem());
  ```
- **普通局部变量**：使用 camelCase；布尔值使用 `is / has / can / show` 等前缀。
- **越局部的变量越简短**：循环、判断代码块中的变量，只要不造成混淆，名称应更简短，
  以 1～3 个字符为佳。小作用域优先使用 `v`、`it`、`row`、`col`、`i`；跨函数传递或参与复杂
  状态流转的数据不要使用含糊缩写。
  ```ts
  for (let row of rows) {
    let v = row.value;
    if (v) items.push(v);
  }
  ```
- **原始值与加工值分开命名**：例如 `rawData`、`newValue`、`oldValue`，避免同名覆盖造成歧义。
- **集合语义**：数组使用复数或集合名（`rows`、`options`）；Map 名称能辨认键和值
  （如 `_table_column_map`）。
- **模板引用**：DOM 或子组件引用使用 `$` 前缀，如 `$el`、`$input`、`$main`。
- **响应式包装**：不额外添加 `Ref` 后缀；`selection`、`isFocused` 即可，通过声明和 `.value`
  判断它是 `Ref` 还是 `ComputedRef`。

## 函数的命名

- **暴露函数**使用 camelCase；**内部函数**使用 snake_case；**私有专用函数**使用
  `_` 前缀的 snake_case。
  ```ts
  // 暴露给 Vue 或其他模块
  export function onClickTop(api: MyComApi) { /* ... */ }

  // 同模块内部函数
  export function try_update_by_props(api: MyComApi) { /* ... */ }

  // 只供当前函数或闭包使用的私有 helper
  function _normalize_value(value: any) { /* ... */ }
  ```
- **响应事件钩子函数**使用 `on{CamelCase}`，例如 `onChange`、`onClickSuffixIcon`、
  `onDateValueChange`。`support/` 中作为内部导出的历史函数可以保留 `on_input_change` 这类
  snake_case，但新代码不要在一层逻辑里混用两种事件命名。
- **尽量使用动名短语**：函数名直接说明“做什么、作用于什么”，例如
  `getInputValue`、`tryNotifyChange`、`loadOptionsData`、`buildTableColumnsMap`。
- **按职责选择前缀**：读取用 `get`，构建用 `build`，解析或转换用 `parse / normalize / to`，
  条件尝试用 `try`，远程请求用 `load / fetch / save`。
- **事件载荷和回调参数按角色命名**：使用 `payload`、`value`、`oldValue`、`rowIndex` 等；
  不使用没有语义的 `arg1 / arg2`。

## 文件内部组织

每个 TS 文件只承担一种主要职责，内部按固定顺序组织：

- types 文件：import → 简单载荷类型 → Emitter → Props → API 类型；
- 组件 API：import → 模块常量与私有类型 → 模块级私有 helper → `useMyComApi` 中的
  数据模型 → 计算属性 → 事件响应 → 数据校验 → 数据改动 → 远程操作 → 暴露接口；
- index 文件：import → 语言包 / 示例 → `COM_TYPE` → `TiComInfo` → export；
- support 文件：import → 私有常量与类型 → 私有 helper → 导出函数。

import 按「外部包 → Vue → 仓库内部（`core/` / `_features/` / `_type/`）→ 本控件」分组，
避免无意义混排；模块级私有 helper 放在使用它们的导出函数之前，不按字母顺序机械重排
有数据依赖的代码。组件 API 内部按照上面的职责顺序分组。

## 注释与分割行

注释说明「为什么」和「边界」，不逐行复述代码。除分割行外：

- 公开类型、复杂 Props、非显然函数使用紧邻的 JSDoc；
- 分支中的特殊处理用 `//` 说明原因（兼容约束、事件抑制条件、复杂状态流转等）；
- `@default` 必须与 `withDefaults` 或实际逻辑一致；
- `TODO` 必须写明具体待办或触发条件，能立即解决的问题不要留下 TODO；
- 不保留注释掉的旧代码、成排调试日志和无解释的魔法数。

除非几行代码特别简短且语义紧密，否则函数和属性级逻辑需要用注释做视觉分割。
组件 API 的七个大组使用上下分割线和组名，组内单个函数使用无标题分割线：

```ts
//-----------------------------------------------------
// 数据模型
//-----------------------------------------------------
const _focused = ref(false);
const _current_value = ref("");

//-----------------------------------------------------
// 计算属性
//-----------------------------------------------------
const DisplayText = computed(() => api.getDisplayText());
const Readonly = computed(() => useReadonly(props));

//-----------------------------------------------------
// 事件响应
//-----------------------------------------------------
function onChange(value: string) {
  tryNotifyChange(value);
}

//-----------------------------------------------------
function onFocus() {
  _focused.value = true;
}
```

组件 API 的大组名称、顺序及返回对象内部的分组方式，以前面 `my-com-api.ts` 一节为准。
`.vue` 文件统一使用无标题分割线；其他 TS 模块按职责分节，不必套用组件 API 的七个大组。

分割行使用密度：

- 同一组关系紧密的状态放在一个区块中，不要每两行就插入一条分割行。
- **计算属性按意义分组**：相近的连续放置，不同小组之间使用无标题分割线；组件 API
  不再为每个小组添加带名称的大组标题。
- **函数原则上每个都有一条无标题分割线**，不逐个添加带名称的分组；大组标题下的第一个
  函数前无需再重复分割线。此规则也适用于 `support/`。
- 简单、不足一屏且职责单一的控件不必强行拆分 API；已有组件 API 则按实际存在的职责分组，
  不保留空分组。
- 保持同一文件内分割线长度一致，不在文件末尾留单独标题或孤儿横线。
- 类型文件不要给每个字段加分割线；字段解释使用紧邻字段的 JSDoc，大组类型可用
  `Events / Behaviors / Aspect` 这类标题。
- 大组的分节注释说明“接下来这组代码的职责”；单个函数的特殊说明使用紧邻的 JSDoc，
  不用分组标题重复函数名称。函数名已能说明的行为不必再写注释。

## 格式化与整洁

新代码以仓库 `.prettierrc` 为格式基准：80 列、分号、双引号、ES5 范围尾逗号、
`vueIndentScriptAndStyle` 保持 Vue 的 script/style 内容缩进。已有源码存在单引号等历史
风格，局部修改时减少无关 diff，不顺手重排无关代码；新建文件则严格遵循当前配置。

- 删除无用 import、调试日志和死代码。
- 格式化交给编辑器或 Prettier 插件完成，手写代码时贴近配置即可。

## 版本号维护

每次修改源代码后，只要不是只改几个字的琐碎调整（如单纯改注释、改错别字），就要把
`package.json` 的 `version` 末位加 1；末位加到 99 后再次进位时，向中间位进 1、末位归零：

- `1.10.85` → `1.10.86` → … → `1.10.99` → `1.11.01` → `1.11.02`

版本号在同一批改动里只加一次，多处文件修改共享同一个新版本号。

# 完成前快速自检

1. 逻辑复杂度与文件层级匹配：`vue` 能读懂就不拆；拆出 API 后仍复杂，再按交互职责拆
   `support/`。
2. `index / types / vue` 三个必需文件齐全，可选目录都有真实内容，没有空壳文件。
3. Props、Emitter、默认值、事件载荷和 `TiComInfo` 与实际源码一致。
4. 共享 Props 和 `_features/` 的现成能力已复用，没有在控件内重复造轮子。
5. 示例能渲染，i18n key 存在且使用 kebab-case。
6. 组件已加入对应类的 `all-*.ts`；新控件未改动 `COM_TYPES` 注册表。
7. 内部状态、计算属性、暴露函数、内部函数和私有 helper 的命名符合本文约定。
8. 组件 API 已按七个职责大组和同序的返回对象分组；函数使用无标题分割线，特殊说明
   使用 JSDoc，没有注释掉的死代码和调试残留；控件的数据监听集中在 Vue 接线。
9. 非琐碎改动已把 `package.json` 的 `version` 末位加 1（99 后进位）。
10. 修改公开行为后同步运行 `yarn build`，并按 [编写 TiJS 文档](write-tijs-doc.skill.md)
   更新对应文档。

# 源码范本

- 简单控件：`src/lib/input/num/`——主要逻辑保留在 `TiInputNum.vue`。
- 普通控件：`src/lib/input/datetime/`——`TiInputDatetime.vue` 与 `use-input-datetime-api.ts` 分层。
- 复杂控件：`src/lib/input/combo/`——API、大量 `support/*.ts` 和 `support/index.ts` 聚合导出。
- 完整分层范本：`src/lib/input/text/`——types、API、support、example、SCSS 一应俱全，
  可对照本文中的目录结构。
- 元信息示例：`src/lib/input/num/ti-input-num-index.ts`，可对照本文中简化后的
  `my-com-index.ts` 结构。
