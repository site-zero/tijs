---
title: 源码文档对照
keywords: [SOURCEMAP, 源码对照, 路径映射]
status: draft
---

# 源码 ↔ 文档对照

> 按源码模块分组，登记每篇文档覆盖的源码入口；新增文档时同步登记。
> 本篇由各文档「延伸阅读 · 源码入口」汇总，不额外补充未被引用的文件。

## src/core 注册表与机制

| 源码路径 | 文档 |
| --- | --- |
| `src/core/ti-coms.ts` | [组件模型](10.concepts/01-component-model.md)、[国际化 i18n](10.concepts/04-i18n.md) |
| `src/core/_top/ti-com.ts` | [组件模型](10.concepts/01-component-model.md)、[事件绑定](10.concepts/03-event-binding.md) |
| `src/_type/core-types.ts` | [组件模型](10.concepts/01-component-model.md)、[共享 Props](10.concepts/02-common-props.md)、[事件绑定](10.concepts/03-event-binding.md) |
| `src/core/text/ti-i18n.ts` | [国际化 i18n](10.concepts/04-i18n.md) |
| `src/i18n/zh-cn.ts`、`src/i18n/en-us.ts` | [国际化 i18n](10.concepts/04-i18n.md) |

## src/lib/_features 特性与共享 Props（概念篇引用）

| 源码路径 | 文档 |
| --- | --- |
| `src/lib/_features/use-readonly.ts` | [共享 Props](10.concepts/02-common-props.md) |
| `src/lib/_features/use-placeholder.ts` | [共享 Props](10.concepts/02-common-props.md) |
| `src/lib/_features/use-visibility.ts` | [共享 Props](10.concepts/02-common-props.md) |
| `src/lib/_features/use-prefix-suffix.ts` | [共享 Props](10.concepts/02-common-props.md) |
| `src/lib/_features/use-icon-text.ts` | [共享 Props](10.concepts/02-common-props.md) |
| `src/lib/_features/use-tipable.ts` | [共享 Props](10.concepts/02-common-props.md) |
| `src/lib/_features/use-docking.ts` | [共享 Props](10.concepts/02-common-props.md) |
| `src/lib/_features/use-emit-adaptor.ts` | [事件绑定](10.concepts/03-event-binding.md) |
| `src/lib/_features/use-options.ts` | [字典模型](10.concepts/06-dict-model.md)、[use-value-input](40.features/value/use-value-input.md) |
| `src/lib/_features/use-dict.ts` | [字典模型](10.concepts/06-dict-model.md) |
| `src/lib/_features/use-value-input.ts` | [use-value-input](40.features/value/use-value-input.md) |
| `src/lib/_features/use-value-box.ts` | [use-value-input](40.features/value/use-value-input.md) |
| `src/_type/lib-type-row-indent.ts` | [共享 Props](10.concepts/02-common-props.md) |
| `src/lib/_tipbox/lib-tip-types.ts` | [共享 Props](10.concepts/02-common-props.md) |

## src/core 字典

| 源码路径 | 文档 |
| --- | --- |
| `src/core/dict/ti-dict.ts` | [字典模型](10.concepts/06-dict-model.md)、[Dicts 字典注册表](20.core-utils/30-dicts.md) |
| `src/core/dict/dict-types.ts` | [字典模型](10.concepts/06-dict-model.md) |
| `src/core/dict/dict-impl.ts` | [字典模型](10.concepts/06-dict-model.md) |
| `src/core/dict/dict-abstract.ts` | [字典模型](10.concepts/06-dict-model.md) |
| `src/core/dict/dict-options.ts` | [字典模型](10.concepts/06-dict-model.md) |
| `src/core/dict/dyn-dict-factory.ts` | [字典模型](10.concepts/06-dict-model.md) |

## 样式体系

| 源码路径 | 文档 |
| --- | --- |
| `src/assets/style/app.scss` | [样式体系](10.concepts/05-style-system.md) |
| `src/assets/style/_all.scss`、`_mixins.scss` | [样式体系](10.concepts/05-style-system.md) |
| `src/assets/style/color/light.scss`、`color/dark.scss` | [样式体系](10.concepts/05-style-system.md) |
| `src/assets/style/measure/comfy.scss`、`measure/tight.scss` | [样式体系](10.concepts/05-style-system.md) |
| `src/assets/style/feature/` | [样式体系](10.concepts/05-style-system.md) |
| `src/core/web/web-css-utils.ts` | [样式体系](10.concepts/05-style-system.md) |


## src/core 工具命名空间

| 源码路径 | 文档 |
| --- | --- |
| `src/core/text/ti-str.ts`、`src/test/core/text.str.test.ts` | [Str 字符串工具](20.core-utils/10-str.md) |
| `src/_type/core-types.ts`、`src/core/text/ti-i18n.ts` | [I18n 国际化](20.core-utils/100-i18n.md) |
| `src/core/time/datetime.ts`、`src/core/time/index.ts`、`src/core/time/time-info.ts` | [DateTime 日期时间](20.core-utils/110-datetime.md) |
| `src/core/tmpl/ele/`、`src/core/tmpl/segment/`、`src/core/tmpl/ti-tmpl.ts` | [Tmpl 模板引擎](20.core-utils/120-tmpl.md) |
| `src/core/util/explain/`、`src/core/util/index.ts`、`src/core/util/util-collection.ts` | [Util 通用工具集](20.core-utils/130-util.md) |
| `src/core/web/index.ts`、`src/core/web/web-css-utils.ts`、`src/core/web/web-dom-html.ts` | [Web 浏览器 DOM 工具](20.core-utils/140-web.md) |
| `src/core/web/behaviors/be-blink-it.ts`、`src/core/web/behaviors/be-clipboard.ts`、`src/core/web/behaviors/be-edit-it.ts` | [Be 元素行为扩展](20.core-utils/150-be.md) |
| `src/core/_top/any-range.ts`、`src/core/_top/index.ts`、`src/core/_top/ti-bus.ts` | [_top 顶级工具](20.core-utils/160-top.md) |
| `src/core/alg/alg-base26.ts`、`src/core/alg/alg-fingerprint.ts`、`src/core/alg/alg-obj-mod.ts` | [Alg 算法工具](20.core-utils/20-alg.md) |
| `src/core/dict/dict-types.ts`、`src/core/dict/ti-dict.ts`、`src/test/core/dict.dynamic.test.ts` | [Dicts 字典注册表](20.core-utils/30-dicts.md) |
| `src/core/fuse/fuse-api.ts`、`src/core/fuse/fuse-factory.ts`、`src/core/fuse/fuse-types.ts` | [fuse 异步保险丝](20.core-utils/40-fuse.md) |
| `src/_type/core-types.ts`、`src/core/g2d/g2d-coord.ts`、`src/core/g2d/ti-g2d.ts` | [G2D 二维几何](20.core-utils/50-g2d.md) |
| `src/core/match/by_array.ts`、`src/core/match/by_blank.ts`、`src/core/match/by_map.ts` | [Match 条件匹配](20.core-utils/60-match.md) |
| `src/core/net/ti-net.ts` | [Net 网络辅助](20.core-utils/70-net.md) |
| `src/core/num/num-math.ts`、`src/core/num/num-util.ts`、`src/core/num/ti-num.ts` | [Num 数值工具](20.core-utils/80-num.md) |
| `src/core/storage/ti-storage.ts` | [TiStore 本地存储](20.core-utils/90-ti-store.md) |

## src/lib/_features · value/

| 源码路径 | 文档 |
| --- | --- |
| `src/lib/_features/val-pipes/dft-val-pipes.ts` | [dft-val-pipes 默认值管道集](40.features/value/dft-val-pipes.md) |
| `src/lib/_features/use-boolean-input.ts`、`src/lib/input/check/TiCheck.vue`、`src/lib/input/toggle/TiToggle.vue` | [use-boolean-input 布尔输入逻辑](40.features/value/use-boolean-input.md) |
| `src/lib/_features/use-data-logic-type.ts`、`src/lib/view/list/use-list.ts`、`src/lib/view/table/use-table.ts` | [use-data-logic-type 行逻辑类型](40.features/value/use-data-logic-type.md) |
| `src/lib/_features/use-display-text.ts`、`src/lib/input/box3/use-ti-input-box3-api.ts`、`src/lib/input/combo/use-input-combo-api.ts` | [use-display-text 显示文本取值](40.features/value/use-display-text.md) |
| `src/lib/_features/use-format-value.ts`、`src/lib/_features/use-value-box.ts` | [use-format-value 值格式化](40.features/value/use-format-value.md) |
| `src/lib/_features/use-format-value.ts`、`src/lib/_features/use-value-box.ts`、`src/lib/_features/use-value-input.ts` | [use-value-box 值显示框聚合](40.features/value/use-value-box.md) |
| `src/lib/_features/use-options.ts`、`src/lib/_features/use-value-box.ts`、`src/lib/_features/use-value-input.ts` | [use-value-input 输入值规整](40.features/value/use-value-input.md) |
| `src/lib/_features/use-value-pipe.ts`、`src/lib/_features/val-pipes/dft-val-pipes.ts` | [use-value-pipe 值处理管道](40.features/value/use-value-pipe.md) |
| `src/lib/_features/use-value-translator.ts`、`src/lib/tile/tags/use-tags.ts` | [use-value-translator 值翻译器](40.features/value/use-value-translator.md) |

## src/lib/_features · options/

| 源码路径 | 文档 |
| --- | --- |
| `src/lib/_features/use-dict.ts` | [use-dict 字典实例构建器](40.features/options/use-dict.md) |
| `src/lib/_features/use-option-item.ts`、`src/lib/input/box3/_fea/use-box-options-data.ts`、`src/lib/input/combo/use-input-combo-api.ts` | [use-option-item 选项项抽取与查找](40.features/options/use-option-item.md) |
| `src/lib/_features/use-options-filter.ts`、`src/lib/input/box3/_fea/use-box-options-data.ts`、`src/lib/input/combo/use-input-combo-api.ts` | [use-options-filter 选项列表过滤拼装](40.features/options/use-options-filter.md) |
| `src/lib/_features/use-options-reloading.ts`、`src/lib/input/combo/use-input-combo-api.ts` | [use-options-reloading 选项异步重载](40.features/options/use-options-reloading.md) |
| `src/lib/_features/use-options.ts` | [use-options 选项字典构建](40.features/options/use-options.md) |

## src/lib/_features · shared/

| 源码路径 | 文档 |
| --- | --- |
| `src/core/web/web-css-utils.ts`、`src/lib/_features/use-class-style.ts`、`src/lib/_features/use-icon-text.ts` | [use-class-style 类名与样式合并](40.features/shared/use-class-style.md) |
| `src/lib/_features/use-docking.ts`、`src/lib/input/date/TiInputDate.vue`、`src/lib/input/datetime/TiInputDatetime.vue` | [use-docking 弹层停靠定位](40.features/shared/use-docking.md) |
| `src/_type/core-types.ts`、`src/lib/_features/use-emit-adaptor.ts`、`src/lib/shelf/block/TiBlock.vue` | [use-emit-adaptor 子事件适配转发](40.features/shared/use-emit-adaptor.md) |
| `src/lib/_features/use-icon-text.ts`、`src/lib/_features/use-prefix-suffix.ts`、`src/lib/view/roadblock/use-roadblock.ts` | [use-icon-text 图标文字单元](40.features/shared/use-icon-text.md) |
| `src/lib/_features/use-keep.ts`、`src/lib/shelf/layout/tabs/TiLayoutTabs.vue`、`src/lib/view/table/use-table-keep.ts` | [use-keep 状态持久化存取](40.features/shared/use-keep.md) |
| `src/lib/_features/use-placeholder.ts`、`src/lib/input/text/ti-input-text-api.ts`、`src/lib/tile/tags/TiTags.vue` | [use-placeholder 占位文本](40.features/shared/use-placeholder.md) |
| `src/lib/_features/use-icon-text.ts`、`src/lib/_features/use-prefix-suffix.ts`、`src/lib/_features/use-value-box.ts` | [use-prefix-suffix 前后缀单元](40.features/shared/use-prefix-suffix.md) |
| `src/lib/_features/use-boolean-input.ts`、`src/lib/_features/use-readonly.ts`、`src/lib/input/text/ti-input-text-api.ts` | [use-readonly 只读状态判定](40.features/shared/use-readonly.md) |
| `src/lib/_features/use-tipable.ts`、`src/lib/_tipbox/lib-tip-types.ts`、`src/lib/input/check/TiCheck.vue` | [use-tipable 悬浮提示挂载](40.features/shared/use-tipable.md) |
| `src/_type/core-types.ts`、`src/lib/_features/use-visibility.ts`、`src/lib/action/actionbar/build-action-bar-items.ts` | [use-visibility 显隐与禁用判定](40.features/shared/use-visibility.md) |

## src/lib/_features · interaction/

| 源码路径 | 文档 |
| --- | --- |
| `src/lib/_features/use-app-bus.ts`、`src/lib/_modal/TiAppModal.vue` | [use-app-bus 应用级消息总线](40.features/interaction/use-app-bus.md) |
| `src/lib/_features/use-app-model-binding.ts`、`src/lib/_modal/TiAppModal.vue` | [use-app-model-binding 应用模型绑定](40.features/interaction/use-app-model-binding.md) |
| `src/lib/_features/use-defer-list.ts`、`src/lib/input/box3/use-ti-input-box3-api.ts`、`src/lib/input/combo/use-input-combo-api.ts` | [use-defer-list 延迟处理队列](40.features/interaction/use-defer-list.md) |
| `src/lib/_features/drag/dragging.ts`、`src/lib/_features/use-dragging.ts`、`src/lib/shelf/layout/grid/use-grid-resizing.ts` | [use-dragging 指针拖拽](40.features/interaction/use-dragging.md) |
| `src/lib/_features/use-dropping.ts`、`src/lib/tile/image/TiImage.vue`、`src/lib/tile/upload/_support/use-uploader.ts` | [use-dropping 文件拖放](40.features/interaction/use-dropping.md) |
| `src/_type/lib-type-grid-layout.ts`、`src/lib/_features/use-grid-layout.ts`、`src/lib/shelf/grid-fields/TiGridFields.vue` | [use-grid-layout 响应式网格布局](40.features/interaction/use-grid-layout.md) |
| `src/lib/_features/use-large-scrolling.ts`、`src/lib/view/table/TiTable.vue` | [use-large-scrolling 大列表渲染裁剪](40.features/interaction/use-large-scrolling.md) |
| `src/_type/lib-type-row-indent.ts`、`src/lib/_features/use-row-indent.ts`、`src/lib/view/list/TiList.vue` | [use-row-indent 行缩进与展开图标](40.features/interaction/use-row-indent.md) |
| `src/lib/_features/use-selectable.ts`、`src/lib/input/switcher/use-switcher.ts`、`src/lib/view/list/use-list.ts` | [use-selectable 列表选区](40.features/interaction/use-selectable.md) |
| `src/lib/_features/use-std-list-item.ts`、`src/lib/input/box3/_fea/use-box-options-data.ts`、`src/lib/input/checklist/use-checklist.ts` | [use-std-list-item 列表项标准化](40.features/interaction/use-std-list-item.md) |
| `src/lib/_features/use-tree-data.ts`、`src/lib/view/tree-table/TiTreeTable.vue`、`src/lib/view/tree/TiTree.vue` | [use-tree-data 树型数据组织](40.features/interaction/use-tree-data.md) |
| `src/lib/_features/use-viewport.ts`、`src/lib/edit/rich/prose/TiEditRichProse.vue`、`src/lib/input/num-unit/TiInputNumUnit.vue` | [use-viewport 容器尺寸监听](40.features/interaction/use-viewport.md) |

## src/lib/_features · field/

| 源码路径 | 文档 |
| --- | --- |
| `src/lib/_features/field/index.ts`、`src/lib/_features/field/init-ti-std-fields.ts`、`src/lib/_features/field/use-obj-columns.ts` | [field 字段集与标准字段](40.features/field/field-overview.md) |
| `src/lib/_features/field/use-field-change.ts`、`src/lib/_features/field/use-form-field-change.ts` | [use-field-change 字段值变更处理](40.features/field/use-field-change.md) |
| `src/lib/_features/field/use-field-com.ts` | [use-field-com 字段控件选择](40.features/field/use-field-com.md) |
| `src/lib/_features/field/use-field-serializer.ts` | [use-field-serializer 字段值序列化](40.features/field/use-field-serializer.md) |
| `src/lib/_features/field/use-field-tranformer.ts` | [use-field-tranformer 字段值反序列化](40.features/field/use-field-tranformer.md) |
| `src/lib/_features/field/use-field-change.ts`、`src/lib/_features/field/use-form-field-change.ts` | [use-form-field-change 表单字段变更处理](40.features/field/use-form-field-change.md) |

## src/lib/_features · range/

| 源码路径 | 文档 |
| --- | --- |
| `src/lib/_features/range/index.ts`、`src/lib/_features/range/open-range-editor.ts`、`src/lib/_features/range/range-msg-key.ts` | [range 区间编辑对话框与消息键](40.features/range/range-overview.md) |
| `src/lib/_features/range/use-input-range-api.ts` | [use-input-range-api 区间输入 API](40.features/range/use-input-range-api.md) |

## src/lib/_features · validate/

| 源码路径 | 文档 |
| --- | --- |
| `src/lib/_features/validate/use-data-validate.ts` | [use-data-validate 整行数据校验](40.features/validate/use-data-validate.md) |
| `src/lib/_features/validate/use-field-validate.ts` | [use-field-validate 校验规则编译](40.features/validate/use-field-validate.md) |
| `src/lib/_features/validate/use-validate-results.ts` | [use-validate-results 校验结果按行存储](40.features/validate/use-validate-results.md) |
| `src/lib/_features/validate/build-validation.ts`、`src/lib/_features/validate/data-validate-types.ts`、`src/lib/_features/validate/index.ts` | [validate 字段编译与类型](40.features/validate/validate-overview.md) |

## src/lib 组件 · action/

| 源码路径 | 文档 |
| --- | --- |
| `src/lib/action/actionbar/ItemAsAction.vue`、`src/lib/action/actionbar/TiActionBar.vue`、`src/lib/action/actionbar/build-action-bar-items.ts` | [TiActionBar 动作条](30.components/action/ti-action-bar.md) |
| `src/lib/action/button/TiButton.vue`、`src/lib/action/button/ti-button-index.ts`、`src/lib/action/button/ti-button-types.ts` | [TiButton 按钮](30.components/action/ti-button.md) |
| `src/lib/action/drop-tag/TiDropTag.vue`、`src/lib/action/drop-tag/ti-drop-tag-index.ts`、`src/lib/action/drop-tag/ti-drop-tag-types.ts` | [TiDropTag 下拉标签](30.components/action/ti-drop-tag.md) |
| `src/lib/action/pager/TiPager.vue`、`src/lib/action/pager/ti-pager-index.ts`、`src/lib/action/pager/ti-pager-types.ts` | [TiPager 翻页器](30.components/action/ti-pager.md) |
| `src/lib/action/sidebar/TiSidebar.vue`、`src/lib/action/sidebar/TiSidebarItem.vue`、`src/lib/action/sidebar/_support/use-sidebar-item.ts` | [TiSidebar 侧边导航](30.components/action/ti-sidebar.md) |
| `src/lib/action/tabs/TiTabs.vue`、`src/lib/action/tabs/ti-tabs-index.ts`、`src/lib/action/tabs/ti-tabs-types.ts` | [TiTabs 标签组](30.components/action/ti-tabs.md) |

## src/lib 组件 · edit/

| 源码路径 | 文档 |
| --- | --- |
| `src/lib/edit/batch-form/TiBatchForm.vue`、`src/lib/edit/batch-form/name/`、`src/lib/edit/batch-form/ti-batch-form-index.ts` | [TiBatchForm 批量表单](30.components/edit/ti-batch-form.md) |
| `src/lib/edit/code/TiCodeEditor.vue`、`src/lib/edit/code/ti-code-editor-index.ts`、`src/lib/edit/code/ti-code-editor-types.ts` | [TiCodeEditor 代码编辑](30.components/edit/ti-code-editor.md) |
| `src/lib/edit/pair/TiEditPairs.vue`、`src/lib/edit/pair/edit-pairs-types.ts`、`src/lib/edit/pair/gui-edit-pairs-form.ts` | [TiEditPairs 名值对编辑](30.components/edit/ti-edit-pairs.md) |
| `src/lib/edit/edit-records/TiEditRecords.vue`、`src/lib/edit/edit-records/edit-records-types.ts`、`src/lib/edit/edit-records/gui-edit-records-table.ts` | [TiEditRecords 记录对象编辑](30.components/edit/ti-edit-records.md) |
| `src/lib/edit/rich/prose/TiEditRichProse.vue`、`src/lib/edit/rich/prose/api/`、`src/lib/edit/rich/prose/init-prose-editor.ts` | [TiEditRich 富文本编辑](30.components/edit/ti-edit-rich.md) |
| `src/lib/edit/sorter/TiSorter.vue`、`src/lib/edit/sorter/ti-sorter-index.ts`、`src/lib/edit/sorter/ti-sorter-types.ts` | [TiSorter 排序器](30.components/edit/ti-sorter.md) |

## src/lib 组件 · input/

| 源码路径 | 文档 |
| --- | --- |
| `src/lib/input/checklist/TiCheckList.vue`、`src/lib/input/checklist/ti-check-list-index.ts`、`src/lib/input/checklist/ti-check-list-types.ts` | [TiCheckList 多选列表](30.components/input/ti-check-list.md) |
| `src/lib/_features/use-boolean-input.ts`、`src/lib/input/check/TiCheck.vue`、`src/lib/input/check/ti-check-index.ts` | [TiCheck 勾选框](30.components/input/ti-check.md) |
| `src/lib/input/droplist/TiDroplist.vue`、`src/lib/input/droplist/ti-droplist-index.ts`、`src/lib/input/droplist/ti-droplist-types.ts` | [TiDroplist 下拉列表](30.components/input/ti-droplist.md) |
| `src/lib/input/code/TiInputCode.vue`、`src/lib/input/code/ti-input-code-index.ts`、`src/lib/input/code/ti-input-code-types.ts` | [TiInputCode 编号输入](30.components/input/ti-input-code.md) |
| `src/lib/input/color/TiInputColor.vue`、`src/lib/input/color/ti-input-color-index.ts`、`src/lib/input/color/ti-input-color-types.ts` | [TiInputColor 颜色框](30.components/input/ti-input-color.md) |
| `src/lib/input/combo/TiInputCombo.vue`、`src/lib/input/combo/input-combo-types.ts`、`src/lib/input/combo/support/` | [TiInputCombo 复合输入框](30.components/input/ti-input-combo.md) |
| `src/lib/_features/range/use-input-range-api.ts`、`src/lib/input/date-range/TiInputDateRange.vue`、`src/lib/input/date-range/daterange-types.ts` | [TiInputDateRange 日期范围](30.components/input/ti-input-date-range.md) |
| `src/lib/input/date/TiInputDate.vue`、`src/lib/input/date/ti-input-date-index.ts`、`src/lib/input/datetime/ti-input-datetime-types.ts` | [TiInputDate 日期选择](30.components/input/ti-input-date.md) |
| `src/lib/input/datetime/TiInputDatetime.vue`、`src/lib/input/datetime/ti-input-datetime-index.ts`、`src/lib/input/datetime/ti-input-datetime-types.ts` | [TiInputDatetime 日期时间框](30.components/input/ti-input-datetime.md) |
| `src/lib/input/group/TiInputGroup.vue`、`src/lib/input/group/ti-input-group-api.ts`、`src/lib/input/group/ti-input-group-index.ts` | [TiInputGroup 输入控件组](30.components/input/ti-input-group.md) |
| `src/lib/input/icon/TiInputIcon.vue`、`src/lib/input/icon/ti-input-icon-index.ts`、`src/lib/input/icon/ti-input-icon-types.ts` | [TiInputIcon 选择图标](30.components/input/ti-input-icon.md) |
| `src/lib/input/lnglat/TiInputLngLat.vue`、`src/lib/input/lnglat/ti-input-lnglat-index.ts`、`src/lib/input/lnglat/ti-input-lnglat-types.ts` | [TiInputLngLat 经纬度](30.components/input/ti-input-lnglat.md) |
| `src/lib/input/multi-lines/TiInputMultiLines.vue`、`src/lib/input/multi-lines/ti-input-multi-lines-index.ts`、`src/lib/input/multi-lines/ti-input-multi-lines-types.ts` | [TiInputMultiLines 多行标签输入](30.components/input/ti-input-multi-lines.md) |
| `src/lib/_features/range/use-input-range-api.ts`、`src/lib/input/num-range/TiInputNumRange.vue`、`src/lib/input/num-range/inrange-types.ts` | [TiInputNumRange 数字区间](30.components/input/ti-input-num-range.md) |
| `src/lib/input/num-unit/TiInputNumUnit.vue`、`src/lib/input/num-unit/ti-input-num-unit-index.ts`、`src/lib/input/num-unit/ti-input-num-unit-types.ts` | [TiInputNumUnit 带单位数字](30.components/input/ti-input-num-unit.md) |
| `src/lib/input/num/TiInputNum.vue`、`src/lib/input/num/ti-input-num-index.ts`、`src/lib/input/num/ti-input-num-types.ts` | [TiInputNum 数字输入框](30.components/input/ti-input-num.md) |
| `src/lib/input/passwd/TiInputPassword.vue`、`src/lib/input/passwd/ti-input-password-index.ts`、`src/lib/input/passwd/ti-input-password-types.ts` | [TiInputPassword 密码输入框](30.components/input/ti-input-password.md) |
| `src/lib/input/picker/TiInputPicker.vue`、`src/lib/input/picker/ti-input-picker-index.ts`、`src/lib/input/picker/ti-input-picker-types.ts` | [TiInputPicker 挑选输入框](30.components/input/ti-input-picker.md) |
| `src/lib/input/text/TiInputText.vue`、`src/lib/input/text/ti-input-text-api.ts`、`src/lib/input/text/ti-input-text-index.ts` | [TiInputText 文本框](30.components/input/ti-input-text.md) |
| `src/lib/input/time/TiInputTime.vue`、`src/lib/input/time/ti-input-time-index.ts`、`src/lib/input/time/ti-input-time-types.ts` | [TiInputTime 时间框](30.components/input/ti-input-time.md) |
| `src/lib/input/box3/TiInputBox3.vue`、`src/lib/input/box3/_fea/`、`src/lib/input/box3/ti-input-box3-index.ts` | [TiInput 输入框](30.components/input/ti-input.md) |
| `src/lib/input/multi-droplist/TiMultiDroplist.vue`、`src/lib/input/multi-droplist/ti-multi-droplist-index.ts`、`src/lib/input/multi-droplist/ti-multi-droplist-types.ts` | [TiMultiDroplist 多选下拉框](30.components/input/ti-multi-droplist.md) |
| `src/lib/input/radiolist/TiRadioList.vue`、`src/lib/input/radiolist/ti-radio-list-index.ts`、`src/lib/input/radiolist/ti-radio-list-types.ts` | [TiRadioList 单选列表](30.components/input/ti-radio-list.md) |
| `src/lib/input/score/TiScore.vue`、`src/lib/input/score/ti-score-index.ts`、`src/lib/input/score/ti-score-types.ts` | [TiScore 评分条](30.components/input/ti-score.md) |
| `src/lib/input/switcher/TiSwitcher.vue`、`src/lib/input/switcher/ti-switcher-index.ts`、`src/lib/input/switcher/ti-switcher-types.ts` | [TiSwitcher 开关组](30.components/input/ti-switcher.md) |
| `src/lib/_features/use-boolean-input.ts`、`src/lib/input/toggle/TiToggle.vue`、`src/lib/input/toggle/ti-toggle-index.ts` | [TiToggle 拨动开关](30.components/input/ti-toggle.md) |
| `src/lib/input/transfer/TiTransfer.vue`、`src/lib/input/transfer/ti-transfer-index.ts`、`src/lib/input/transfer/ti-transfer-types.ts` | [TiTransfer 穿梭框](30.components/input/ti-transfer.md) |

## src/lib 组件 · shelf/

| 源码路径 | 文档 |
| --- | --- |
| `src/lib/shelf/block/TiBlock.vue`、`src/lib/shelf/block/ti-block-index.ts`、`src/lib/shelf/block/ti-block-types.ts` | [TiBlock 布局块](30.components/shelf/ti-block.md) |
| `src/lib/shelf/calendar/TiCalendar.vue`、`src/lib/shelf/calendar/ti-calendar-index.ts`、`src/lib/shelf/calendar/ti-calendar-types.ts` | [TiCalendar 日历](30.components/shelf/ti-calendar.md) |
| `src/lib/shelf/form/TiForm.vue`、`src/lib/shelf/form/ti-form-index.ts`、`src/lib/shelf/form/ti-form-types.ts` | [TiForm 表单](30.components/shelf/ti-form.md) |
| `src/lib/_features/field/use-field-change.ts`、`src/lib/shelf/grid-fields/GFItField.vue`、`src/lib/shelf/grid-fields/TiGridFields.vue` | [TiGridFields 栅格字段组](30.components/shelf/ti-grid-fields.md) |
| `src/lib/shelf/layout/grid/TiLayoutGrid.vue`、`src/lib/shelf/layout/grid/ti-layout-grid-index.ts`、`src/lib/shelf/layout/grid/ti-layout-grid-types.ts` | [TiLayoutGrid 栅格布局](30.components/shelf/ti-layout-grid.md) |
| `src/lib/shelf/layout/tabs/TiLayoutTabs.vue`、`src/lib/shelf/layout/tabs/ti-layout-tabs-index.ts`、`src/lib/shelf/layout/tabs/ti-layout-tabs-types.ts` | [TiLayoutTabs 标签布局](30.components/shelf/ti-layout-tabs.md) |
| `src/lib/shelf/form/TiTabsForm.vue`、`src/lib/shelf/form/ti-tabs-form-index.ts`、`src/lib/shelf/form/ti-tabs-form-types.ts` | [TiTabsForm 标签表单](30.components/shelf/ti-tabs-form.md) |
| `src/lib/shelf/time-slots/TiTimeSlots.vue`、`src/lib/shelf/time-slots/ti-time-slots-index.ts`、`src/lib/shelf/time-slots/ti-time-slots-types.ts` | [TiTimeSlots 日时间槽](30.components/shelf/ti-time-slots.md) |
| `src/lib/shelf/weeks/TiWeeks.vue`、`src/lib/shelf/weeks/ti-weeks-index.ts`、`src/lib/shelf/weeks/ti-weeks-types.ts` | [TiWeeks 周视图](30.components/shelf/ti-weeks.md) |

## src/lib 组件 · tile/

| 源码路径 | 文档 |
| --- | --- |
| `src/lib/_features/use-std-list-item.ts`、`src/lib/tile/crumb/TiCrumb.vue`、`src/lib/tile/crumb/ti-crumb-index.ts` | [TiCrumb 面包屑导航条](30.components/tile/ti-crumb.md) |
| `src/lib/tile/html-frame/TiHtmlFrame.vue`、`src/lib/tile/html-frame/ti-html-frame-index.ts`、`src/lib/tile/html-frame/ti-html-frame-types.ts` | [TiHtmlFrame HTML框架](30.components/tile/ti-html-frame.md) |
| `src/lib/tile/html-snippet/TiHtmlSnippet.vue`、`src/lib/tile/html-snippet/html-snippet-index.ts`、`src/lib/tile/html-snippet/html-snippet-types.ts` | [TiHtmlSnippet HTML片段](30.components/tile/ti-html-snippet.md) |
| `src/lib/tile/icon/TiIcon.vue`、`src/lib/tile/icon/ti-icon-index.ts`、`src/lib/tile/icon/ti-icon-types.ts` | [TiIcon 图标](30.components/tile/ti-icon.md) |
| `src/lib/_features/use-dropping.ts`、`src/lib/tile/image/TiImage.vue`、`src/lib/tile/image/ti-image-index.ts` | [TiImage 图像](30.components/tile/ti-image.md) |
| `src/lib/tile/label-tags/TiLabelTags.vue`、`src/lib/tile/label-tags/ti-label-tags-index.ts`、`src/lib/tile/label-tags/ti-label-tags-types.ts` | [TiLabelTags 选项标签](30.components/tile/ti-label-tags.md) |
| `src/lib/tile/label/TiLabel.vue`、`src/lib/tile/label/ti-label-index.ts`、`src/lib/tile/label/ti-label-types.ts` | [TiLabel 标签](30.components/tile/ti-label.md) |
| `src/lib/tile/progress-bar/TiProgressBar.vue`、`src/lib/tile/progress-bar/ti-progress-bar-index.ts`、`src/lib/tile/progress-bar/ti-progress-bar-types.ts` | [TiProgressBar 进度条](30.components/tile/ti-progress-bar.md) |
| `src/lib/tile/tags/TiTags.vue`、`src/lib/tile/tags/ti-tags-index.ts`、`src/lib/tile/tags/ti-tags-types.ts` | [TiTags 标签组](30.components/tile/ti-tags.md) |
| `src/lib/tile/text-snippet/TiTextSnippet.vue`、`src/lib/tile/text-snippet/text-snippet-index.ts`、`src/lib/tile/text-snippet/text-snippet-types.ts` | [TiTextSnippet 文字片段](30.components/tile/ti-text-snippet.md) |
| `src/lib/tile/thumb/TiThumb.vue`、`src/lib/tile/thumb/ti-thumb-index.ts`、`src/lib/tile/thumb/ti-thumb-types.ts` | [TiThumb 缩略图](30.components/tile/ti-thumb.md) |
| `src/lib/tile/upload/_support/use-uploader.ts`、`src/lib/tile/upload/bar/TiUploadBar.vue`、`src/lib/tile/upload/bar/ti-upload-bar-index.ts` | [TiUploadBar 上传条](30.components/tile/ti-upload-bar.md) |
| `src/lib/tile/upload/_support/use-uploader.ts`、`src/lib/tile/upload/tile/TiUploadTile.vue`、`src/lib/tile/upload/tile/ti-upload-tile-index.ts` | [TiUploadTile 上传贴片](30.components/tile/ti-upload-tile.md) |

## src/lib 组件 · view/

| 源码路径 | 文档 |
| --- | --- |
| `src/lib/view/falls/TiFalls.vue`、`src/lib/view/falls/ti-falls-index.ts`、`src/lib/view/falls/ti-falls-types.ts` | [TiFalls 瀑布贴](30.components/view/ti-falls.md) |
| `src/lib/view/html-page/TiHtmlPage.vue`、`src/lib/view/html-page/html-page-index.ts`、`src/lib/view/html-page/html-page-types.ts` | [TiHtmlPage HTML页面](30.components/view/ti-html-page.md) |
| `src/lib/view/lbs-map/TiLbsMap.vue`、`src/lib/view/lbs-map/draw/`、`src/lib/view/lbs-map/gis/` | [TiLbsMap 地图](30.components/view/ti-lbs-map.md) |
| `src/lib/view/list/TiList.vue`、`src/lib/view/list/ti-list-index.ts`、`src/lib/view/list/ti-list-types.ts` | [TiList 列表](30.components/view/ti-list.md) |
| `src/lib/view/loading/TiLoading.vue`、`src/lib/view/loading/ti-loading-index.ts` | [TiLoading 加载标牌](30.components/view/ti-loading.md) |
| `src/lib/view/process/TiProcess.vue`、`src/lib/view/process/ti-process-index.ts`、`src/lib/view/process/ti-process-types.ts` | [TiProcess 处理过程](30.components/view/ti-process.md) |
| `src/lib/view/roadblock/TiRoadblock.vue`、`src/lib/view/roadblock/ti-roadblock-index.ts`、`src/lib/view/roadblock/ti-roadblock-types.ts` | [TiRoadblock 路障牌](30.components/view/ti-roadblock.md) |
| `src/lib/_features/field/`、`src/lib/view/table/TableCell.vue`、`src/lib/view/table/TableRow.vue` | [TiTable 表格](30.components/view/ti-table.md) |
| `src/lib/view/tree-table/TiTreeTable.vue`、`src/lib/view/tree-table/ti-tree-table-index.ts`、`src/lib/view/tree-table/ti-tree-table-types.ts` | [TiTreeTable 树状表格](30.components/view/ti-tree-table.md) |
| `src/lib/view/tree/TiTree.vue`、`src/lib/view/tree/ti-tree-index.ts`、`src/lib/view/tree/ti-tree-types.ts` | [TiTree 树](30.components/view/ti-tree.md) |
| `src/lib/view/wall/TiWall.vue`、`src/lib/view/wall/ti-wall-index.ts`、`src/lib/view/wall/ti-wall-types.ts` | [TiWall 墙贴](30.components/view/ti-wall.md) |

## 入门引导与开发规范

| 源码路径 | 文档 |
| --- | --- |
| `src/core/ti-coms.ts`、`src/core/ti-exports.ts`、`src/lib/_features/field/init-ti-std-fields.ts` | [快速上手](00.start-here/01-getting-started.md) |
| `src/index.ts`、`src/lib/action/button/`、`src/lib/index.ts` | [仓库源码布局](101.dev/01-source-layout.md) |
| `src/lib/action/button/ti-button-index.ts`、`src/lib/input/all-input.ts`、`src/lib/input/text/ti-input-text-index.ts` | [新增一个组件](101.dev/02-add-component.md) |
| `src/test/core/num.test.ts`、`src/test/setup.ts` | [Vitest 测试约定](101.dev/03-testing.md) |
| — | [构建与发布](101.dev/04-build-and-release.md) |
| `src/lib/lib-com-types.ts` | [文档与弃用规则](101.dev/05-doc-and-deprecation.md) |
