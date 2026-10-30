---
title: Feature Hook 手册
keywords: [feature, hook, composable, use-, 特性]
status: draft
---

# Feature Hook 手册

`src/lib/_features/` 下可复用的 composable 特性，**每个 hook 单独一篇**，按主题分子目录。
共享 Props 与 hook 的对应关系见 [`../10.concepts/02-common-props.md`](../10.concepts/02-common-props.md)；
Hook 写作模板见 `docs/skill/write-tijs-doc.skill.md` 第 4.4 节。

## value · 值输入与处理

围绕「逻辑值 ↔ 显示文本」双向同步的一组 hook，是输入盒子的核心编排层。

- [use-value-input 输入值规整](value/use-value-input.md)：输入值规整管线、字典校验与值到显示文本翻译。
- [use-value-box 值显示框聚合](value/use-value-box.md)：编排逻辑值与显示文本双向同步的盒子聚合层。
- [use-value-pipe 值处理管道](value/use-value-pipe.md)：按命名处理器声明顺序同步加工值。
- [use-value-translator 值翻译器](value/use-value-translator.md)：按名字查表把内部值翻译成可读文本。
- [use-format-value 值格式化](value/use-format-value.md)：缺省 / 模板 / 函数三种形态生成格式化器。
- [use-display-text 显示文本取值](value/use-display-text.md)：按 `text/value` 优先级从选项挑首个非空字段。
- [use-boolean-input 布尔输入逻辑](value/use-boolean-input.md)：假 / 真值对与 `isTrue` 判定，服务开关与勾选。
- [use-data-logic-type 行逻辑类型](value/use-data-logic-type.md)：函数或条件数组判定一行的逻辑性质。
- [dft-val-pipes 默认值管道集](value/dft-val-pipes.md)：模块概述，内置 `$TRIM/$F2/$DT` 等默认值处理器集合。

## options · 选项与字典

把外部数据源规整成标准选项项、拼装面板列表、处理异步重载的一组 hook。

- [use-options 选项字典构建](options/use-options.md)：三形态 `OptionsProps` 构建选项字典地基。
- [use-option-item 选项项抽取与查找](options/use-option-item.md)：统一图标 / 文字 / 提示 / 值抽取与定位。
- [use-options-filter 选项列表过滤拼装](options/use-options-filter.md)：清除项、固定项与过滤器拼装最终列表。
- [use-options-reloading 选项异步重载](options/use-options-reloading.md)：hint 触发的异步候选重载状态机。
- [use-dict 字典实例构建器](options/use-dict.md)：直接返回 TiDict 实例的精简构建器。

## shared · 共享样式与文本

跨组件复用的横切小单元，对应概念篇共享 Props 的实现 hook。

- [use-class-style 类名与样式合并](shared/use-class-style.md)：合并外部 `className/style` 与条件状态类。
- [use-icon-text 图标文字单元](shared/use-icon-text.md)：图标加文字格的显隐、悬浮切换与点击回调。
- [use-prefix-suffix 前后缀单元](shared/use-prefix-suffix.md)：左右对称两格与前后缀容器状态类。
- [use-placeholder 占位文本](shared/use-placeholder.md)：规范化占位文本并缺省走 i18n 文案。
- [use-tipable 悬浮提示挂载](shared/use-tipable.md)：注册 / 替换 / 注销提示并输出 `data-tip` 标识。
- [use-docking 弹层停靠定位](shared/use-docking.md)：按目标元素视口象限计算浮层位置。
- [use-readonly 只读状态判定](shared/use-readonly.md)：Match 解析只读表达式得到 `isReadonly`。
- [use-visibility 显隐与禁用判定](shared/use-visibility.md)：`visible/hidden/disabled/enabled` 配对求值。
- [use-keep 状态持久化存取](shared/use-keep.md)：按 `keepAt/keepMode` 经 TiStore 存取用户状态。
- [use-emit-adaptor 子事件适配转发](shared/use-emit-adaptor.md)：按 `events` 规则拦截、改名、转发子事件。

## interaction · 通用交互与布局

选区、拖拽、放置、网格、视口、虚拟滚动、树数据等视图层通用交互 hook。

- [use-selectable 列表选区](interaction/use-selectable.md)：受控 / 非受控单选、多选、区间与全选状态机。
- [use-dragging 指针拖拽](interaction/use-dragging.md)：pointer 事件骨架，阈值激活与卸载摘监听。
- [use-dropping 文件拖放](interaction/use-dropping.md)：HTML5 DnD 监听挂载与文件回调。
- [use-grid-layout 响应式网格布局](interaction/use-grid-layout.md)：视口宽度算列数与列宽并输出样式。
- [use-viewport 容器尺寸监听](interaction/use-viewport.md)：ResizeObserver 防抖输出响应式宽高与 resize。
- [use-large-scrolling 大列表渲染裁剪](interaction/use-large-scrolling.md)：视口加缓冲区判定行是否渲染。
- [use-defer-list 延迟处理队列](interaction/use-defer-list.md)：挂起失焦清理、点选项时取消的延迟队列。
- [use-tree-data 树型数据组织](interaction/use-tree-data.md)：扁平 / 树根输入归一化与读写遍历扁平化。
- [use-row-indent 行缩进与展开图标](interaction/use-row-indent.md)：按行 ID 查缩进、状态与指示图标。
- [use-std-list-item 列表项标准化](interaction/use-std-list-item.md)：任意行对象转标准选项项。
- [use-app-bus 应用级消息总线](interaction/use-app-bus.md)：全局总线与窗口 resize 转发。
- [use-app-model-binding 应用模型绑定](interaction/use-app-model-binding.md)：绑定描述转 Props 与 `v-on` 表。

## field · 字段模型

表单字段与表格列共用的字段定义、变更流水线、控件选择与序列化 hook。

- [field 字段集与标准字段](field/field-overview.md)：模块概述，字段定义模型、标准字段 / 列初始化与助手函数。
- [use-field-change 字段值变更处理](field/use-field-change.md)：规整、校验、联动、通知的变更流水线。
- [use-field-com 字段控件选择](field/use-field-com.md)：按只读 / 激活状态选择字段控件与 comConf。
- [use-field-serializer 字段值序列化](field/use-field-serializer.md)：控件值写入模型前的转换。
- [use-field-tranformer 字段值反序列化](field/use-field-tranformer.md)：模型原始值读取到控件形态。
- [use-form-field-change 表单字段变更处理](field/use-form-field-change.md)：FieldRefer 解析、递归字段组与错误 HTML。

## range · 区间输入

数值区间、日期区间共用的解析与回写 API，以及区间编辑对话框与消息键。

- [use-input-range-api 区间输入 API](range/use-input-range-api.md)：任意区间形态解析、展示与编辑回写。
- [range 区间对话框与消息键](range/range-overview.md)：模块概述，区间编辑器打开与消息键常量。

## validate · 校验

整行数据校验、字段规则编译、按行校验结果存储，以及内部类型与构建辅助。

- [use-data-validate 整行数据校验](validate/use-data-validate.md)：`validateChange/validateData` 逐字段校验。
- [use-field-validate 校验规则编译](validate/use-field-validate.md)：字段 `validation` 规则编译为校验函数。
- [use-validate-results 校验结果按行存储](validate/use-validate-results.md)：按行 id 存取各行校验结果。
- [validate 字段编译与类型](validate/validate-overview.md)：模块概述，内部校验字段构建、类型与全局规则注册表。
