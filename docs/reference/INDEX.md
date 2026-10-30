---
title: 参考手册总索引
keywords: [INDEX, 索引, 文档目录, 篇目清单]
status: draft
---

# 参考手册总索引

> 按分区汇总全部已建成篇目；新增篇目时在对应分组追加一行。
> 格式：`- 标题链接：一句话说明这篇写什么。`，标题写成 Markdown 链接指向对应篇目。

## 00.start-here 入门

- [入门](00.start-here/README.md)：第一次接入 `@site0/tijs` 的阅读导引与篇目顺序。
- [快速上手](00.start-here/01-getting-started.md)：安装、`main.ts` 五步引导、两行样式引入与第一个组件示例。

## 10.concepts 概念机制

- [核心概念机制](10.concepts/README.md)：立项初衷、目标场景，以及六篇机制的阅读顺序。
- [组件模型](10.concepts/01-component-model.md)：每个组件如何被 `TiComInfo` 描述、统一注册，并按类型名查询。
- [共享 Props](10.concepts/02-common-props.md)：跨组件重复出现的只读、占位、前后缀、提示等属性及其对应 hook。
- [事件绑定](10.concepts/03-event-binding.md)：标准 `emit`、事件适配器，以及配置面板的事件回写模型。
- [国际化 i18n](10.concepts/04-i18n.md)：核心包与组件语言包分层并入、`i18n:` 前缀和运行时切换。
- [样式体系](10.concepts/05-style-system.md)：CSS 变量、亮暗主题、宽松紧凑尺度与通用 SCSS mixin。
- [字典模型](10.concepts/06-dict-model.md)：静态/动态字典、选项数据源，以及选项型控件如何消费字典。

## 20.core-utils 工具

- [Str 字符串工具](20.core-utils/10-str.md)：空白判断、值转换、分段、命名风格转换与尺寸文本等字符串处理。
- [Alg 算法工具](20.core-utils/20-alg.md)：base26、指纹、对象改动、签名、雪花号等通用算法。
- [Dicts 字典注册表](20.core-utils/30-dicts.md)：静态字典与动态字典的全局注册表和工厂。
- [fuse 异步保险丝](20.core-utils/40-fuse.md)：发布订阅式异步熔断 / 保险丝机制。
- [G2D 二维几何](20.core-utils/50-g2d.md)：轻量二维坐标与几何计算。
- [Match 条件匹配](20.core-utils/60-match.md)：把条件声明编译成对数据的匹配判断。
- [Net 网络辅助](20.core-utils/70-net.md)：无 UI 依赖的网络小工具。
- [Num 数值工具](20.core-utils/80-num.md)：数值数学、取整、范围、步长等数值处理。
- [TiStore 本地存储](20.core-utils/90-ti-store.md)：localStorage / sessionStorage 的封装。
- [I18n 国际化](20.core-utils/100-i18n.md)：维护文案语言表与取值的核心 i18n 工具。
- [DateTime 日期时间](20.core-utils/110-datetime.md)：任意输入到日期时间的解析、格式化与比较。
- [Tmpl 模板引擎](20.core-utils/120-tmpl.md)：带占位符的轻量模板字符串渲染。
- [Util 通用工具集](20.core-utils/130-util.md)：组件与模型层复用最广的通用辅助函数集合。
- [Web 浏览器 DOM 工具](20.core-utils/140-web.md)：CSS 工具、DOM 操作、HTML 与事件辅助。
- [Be 元素行为扩展](20.core-utils/150-be.md)：作用于宿主元素的一次性交互行为集合。
- [_top 顶级工具](20.core-utils/160-top.md)：消息总线、环境变量、图标解析等最底层工具。

## 30.components 组件

### action · 动作类

- [TiActionBar 动作条](30.components/action/ti-action-bar.md)：成排命令容器，组合按钮、分隔线与下拉分组。
- [TiButton 按钮](30.components/action/ti-button.md)：执行一次用户命令，支持图标、状态色与点击载荷。
- [TiDropTag 下拉标签](30.components/action/ti-drop-tag.md)：紧凑芯片形态的小型选择标签，点击展开选项。
- [TiPager 翻页器](30.components/action/ti-pager.md)：当前页、总页数、页大小与总条数的翻页控件。
- [TiSidebar 侧边导航](30.components/action/ti-sidebar.md)：带图标、标题与子级的竖向导航菜单。
- [TiTabs 标签组](30.components/action/ti-tabs.md)：一排可点击的水平页签，支持溢出折叠。

### edit · 编辑类

- [TiBatchForm 批量表单](30.components/edit/ti-batch-form.md)：字段标题前加勾选框，批量选择要修改的字段。
- [TiCodeEditor 代码编辑](30.components/edit/ti-code-editor.md)：基于 Ace 封装的页面内代码编辑器。
- [TiEditPairs 名值对编辑](30.components/edit/ti-edit-pairs.md)：把普通对象变成可编辑的键值对表格。
- [TiEditRecords 记录对象编辑](30.components/edit/ti-edit-records.md)：对象数组渲染成可增删改的记录表格。
- [TiEditRich 富文本编辑](30.components/edit/ti-edit-rich.md)：所见即所得富文本编辑器。
- [TiSorter 排序器](30.components/edit/ti-sorter.md)：把排序条件渲染成可操作的条件标签组。

### input · 输入类

- [TiInput 输入框](30.components/input/ti-input.md)：内部代号 box3 的基础输入框，文本输入底座。
- [TiInputText 文本框](30.components/input/ti-input-text.md)：按 `valueType` 切换单行 / 多行纯文本形态。
- [TiInputMultiLines 多行标签输入](30.components/input/ti-input-multi-lines.md)：把一组字符串当作标签集合管理。
- [TiInputPassword 密码输入框](30.components/input/ti-input-password.md)：圆点遮蔽，眼睛图标切换明文。
- [TiInputNum 数字输入框](30.components/input/ti-input-num.md)：只接受数字，展示层做精度与格式化。
- [TiInputNumRange 数字区间](30.components/input/ti-input-num-range.md)：表达一个数值范围而非单个数字。
- [TiInputNumUnit 带单位数字](30.components/input/ti-input-num-unit.md)：数字框加单位后缀的组合框。
- [TiInputCode 编号输入](30.components/input/ti-input-code.md)：编码加描述的输入框，继承 box3 能力。
- [TiCheck 勾选框](30.components/input/ti-check.md)：可勾选小方块，可带文字、图标与悬浮提示。
- [TiCheckList 多选列表](30.components/input/ti-check-list.md)：竖排候选项，每行勾选框多选。
- [TiRadioList 单选列表](30.components/input/ti-radio-list.md)：竖排候选项，每行圆形单选标记。
- [TiSwitcher 开关组](30.components/input/ti-switcher.md)：横排可点小按钮的选项组，可带图标。
- [TiToggle 拨动开关](30.components/input/ti-toggle.md)：轨道滑块左右拨动表示开 / 关。
- [TiDroplist 下拉列表](30.components/input/ti-droplist.md)：只读下拉单选，复用 box3 外观与前后缀。
- [TiMultiDroplist 多选下拉框](30.components/input/ti-multi-droplist.md)：已选值以标签铺在输入区。
- [TiInputCombo 复合输入框](30.components/input/ti-input-combo.md)：带前后缀图标、可输入触发选项的组合框。
- [TiInputPicker 挑选输入框](30.components/input/ti-input-picker.md)：弹出面板选择（scaffold 占位）。
- [TiTransfer 穿梭框](30.components/input/ti-transfer.md)：左右两栏候选与已选，中间移动选择。
- [TiInputDate 日期选择](30.components/input/ti-input-date.md)：日历后缀图标的日期选择框。
- [TiInputDateRange 日期范围](30.components/input/ti-input-date-range.md)：区间描述文字，弹出日期区间选择。
- [TiInputDatetime 日期时间框](30.components/input/ti-input-datetime.md)：在日期基础上叠加时刻选择。
- [TiInputTime 时间框](30.components/input/ti-input-time.md)：把时刻拆成并列数字框录入。
- [TiInputColor 颜色框](30.components/input/ti-input-color.md)：颜色选择（scaffold 占位）。
- [TiInputIcon 选择图标](30.components/input/ti-input-icon.md)：图标选择（scaffold 占位）。
- [TiInputLngLat 经纬度](30.components/input/ti-input-lnglat.md)：上下两个数字框分别录入经度、纬度。
- [TiScore 评分条](30.components/input/ti-score.md)：一排星星，点击换算分值。
- [TiInputGroup 输入控件组](30.components/input/ti-input-group.md)：把相关字段压在一行或一个网格里。

### shelf · 搁架类

- [TiForm 表单](30.components/shelf/ti-form.md)：标题、字段、提示组成的单条记录录入容器。
- [TiTabsForm 标签表单](30.components/shelf/ti-tabs-form.md)：顶层 `fields` 每项自动成为一个标签页。
- [TiGridFields 栅格字段组](30.components/shelf/ti-grid-fields.md)：CSS Grid 字段栅格底层引擎，可无限嵌套。
- [TiBlock 布局块](30.components/shelf/ti-block.md)：标题栏加动作栏加内容区的最小布局容器。
- [TiLayoutGrid 栅格布局](30.components/shelf/ti-layout-grid.md)：schema 加 blocks 拼装、可拖拽调宽的整页骨架。
- [TiLayoutTabs 标签布局](30.components/shelf/ti-layout-tabs.md)：blocks 互斥切换的标签页布局容器。
- [TiCalendar 日历](30.components/shelf/ti-calendar.md)：受控月视图日期网格，输出 date / str / ms。
- [TiWeeks 周视图](30.components/shelf/ti-weeks.md)：按周排程的占位骨架（scaffold）。
- [TiTimeSlots 日时间槽](30.components/shelf/ti-time-slots.md)：按一天时段排班的占位骨架（scaffold）。

### tile · 小片类

- [TiCrumb 面包屑导航条](30.components/tile/ti-crumb.md)：层级路径导航，项可带图标、点项发 change。
- [TiHtmlFrame HTML框架](30.components/tile/ti-html-frame.md)：HTML 字符串写入沙箱 iframe 做样式隔离。
- [TiHtmlSnippet HTML片段](30.components/tile/ti-html-snippet.md)：当前文档内 v-html 插入片段并委托事件。
- [TiIcon 图标](30.components/tile/ti-icon.md)：统一渲染字体、Emoji、图片三种图标。
- [TiImage 图像](30.components/tile/ti-image.md)：图片展示与加载态，可选拖本地文件预览。
- [TiLabelTags 选项标签](30.components/tile/ti-label-tags.md)：多值经字典翻译后交给 TiTags 并排展示。
- [TiLabel 标签](30.components/tile/ti-label.md)：只读展示单个值，支持状态色、前后缀与点击复制。
- [TiProgressBar 进度条](30.components/tile/ti-progress-bar.md)：range 归一化的水平 / 垂直纯展示进度条。
- [TiTags 标签组](30.components/tile/ti-tags.md)：标签项或对象标签，可移除、排序、带动作条。
- [TiTextSnippet 文字片段](30.components/tile/ti-text-snippet.md)：一行带前后图标、可模板替换的文字。
- [TiThumb 缩略图](30.components/tile/ti-thumb.md)：预览加标题加标记与进度的卡片组合件。
- [TiUploadBar 上传条](30.components/tile/ti-upload-bar.md)：横向上传位外壳，选 / 拖 / 停 / 清只发事件。
- [TiUploadTile 上传贴片](30.components/tile/ti-upload-tile.md)：卡片式大缩略图上传位。

### view · 视图类

- [TiFalls 瀑布贴](30.components/view/ti-falls.md)：不等高多列瀑布流容器（当前占位骨架）。
- [TiHtmlPage HTML页面](30.components/view/ti-html-page.md)：编译字符串模板动态渲染（可用已注册组件）。
- [TiLbsMap 地图](30.components/view/ti-lbs-map.md)：Leaflet 地图，坐标系、瓦片、标记与单点选址。
- [TiList 列表](30.components/view/ti-list.md)：纵向选项列表，单选 / 多选 / 行缩进树底。
- [TiLoading 加载标牌](30.components/view/ti-loading.md)：预设加载默认值的 TiRoadblock 薄封装。
- [TiProcess 处理过程](30.components/view/ti-process.md)：标题、进度条、中止按钮、状态列表与日志。
- [TiRoadblock 路障牌](30.components/view/ti-roadblock.md)：图标加文字加链接的通用占位牌。
- [TiTable 表格](30.components/view/ti-table.md)：多列数据表，列定义、选区、激活编辑与虚拟滚动。
- [TiTree 树](30.components/view/ti-tree.md)：扁平 `id/pid` 建树后扁平化成 TiList。
- [TiTreeTable 树状表格](30.components/view/ti-tree-table.md)：扁平数据建树后扁平化成 TiTable。
- [TiWall 墙贴](30.components/view/ti-wall.md)：自适应网格卡片墙，默认 TiThumb。

## 40.features 特性

### value · 值输入与处理

- [use-value-input 输入值规整](40.features/value/use-value-input.md)：输入值规整管线、字典校验与值到显示文本翻译。
- [use-value-box 值显示框聚合](40.features/value/use-value-box.md)：编排逻辑值与显示文本双向同步的盒子聚合层。
- [use-value-pipe 值处理管道](40.features/value/use-value-pipe.md)：按命名处理器声明顺序同步加工值。
- [use-value-translator 值翻译器](40.features/value/use-value-translator.md)：按名字查表把内部值翻译成可读文本。
- [use-format-value 值格式化](40.features/value/use-format-value.md)：缺省 / 模板 / 函数三种形态生成格式化器。
- [use-display-text 显示文本取值](40.features/value/use-display-text.md)：按 `text/value` 优先级从选项挑首个非空字段。
- [use-boolean-input 布尔输入逻辑](40.features/value/use-boolean-input.md)：假 / 真值对与 `isTrue` 判定，服务开关与勾选。
- [use-data-logic-type 行逻辑类型](40.features/value/use-data-logic-type.md)：函数或条件数组判定一行的逻辑性质。
- [dft-val-pipes 默认值管道集](40.features/value/dft-val-pipes.md)：内置 `$TRIM/$F2/$DT` 等默认值处理器集合。

### options · 选项与字典

- [use-options 选项字典构建](40.features/options/use-options.md)：三形态 `OptionsProps` 构建选项字典地基。
- [use-option-item 选项项抽取与查找](40.features/options/use-option-item.md)：统一图标 / 文字 / 提示 / 值抽取与定位。
- [use-options-filter 选项列表过滤拼装](40.features/options/use-options-filter.md)：清除项、固定项与过滤器拼装最终列表。
- [use-options-reloading 选项异步重载](40.features/options/use-options-reloading.md)：hint 触发的异步候选重载状态机。
- [use-dict 字典实例构建器](40.features/options/use-dict.md)：直接返回 TiDict 实例的精简构建器。

### shared · 共享样式与文本

- [use-class-style 类名与样式合并](40.features/shared/use-class-style.md)：合并外部 `className/style` 与条件状态类。
- [use-icon-text 图标文字单元](40.features/shared/use-icon-text.md)：图标加文字格的显隐、悬浮切换与点击回调。
- [use-prefix-suffix 前后缀单元](40.features/shared/use-prefix-suffix.md)：左右对称两格与前后缀容器状态类。
- [use-placeholder 占位文本](40.features/shared/use-placeholder.md)：规范化占位文本并缺省走 i18n 文案。
- [use-tipable 悬浮提示挂载](40.features/shared/use-tipable.md)：注册 / 替换 / 注销提示并输出 `data-tip` 标识。
- [use-docking 弹层停靠定位](40.features/shared/use-docking.md)：按目标元素视口象限计算浮层位置。
- [use-readonly 只读状态判定](40.features/shared/use-readonly.md)：Match 解析只读表达式得到 `isReadonly`。
- [use-visibility 显隐与禁用判定](40.features/shared/use-visibility.md)：`visible/hidden/disabled/enabled` 配对求值。
- [use-keep 状态持久化存取](40.features/shared/use-keep.md)：按 `keepAt/keepMode` 经 TiStore 存取用户状态。
- [use-emit-adaptor 子事件适配转发](40.features/shared/use-emit-adaptor.md)：按 `events` 规则拦截、改名、转发子事件。

### interaction · 通用交互与布局

- [use-selectable 列表选区](40.features/interaction/use-selectable.md)：受控 / 非受控单选、多选、区间与全选状态机。
- [use-dragging 指针拖拽](40.features/interaction/use-dragging.md)：pointer 事件骨架，阈值激活与卸载摘监听。
- [use-dropping 文件拖放](40.features/interaction/use-dropping.md)：HTML5 DnD 监听挂载与文件回调。
- [use-grid-layout 响应式网格布局](40.features/interaction/use-grid-layout.md)：视口宽度算列数与列宽并输出样式。
- [use-viewport 容器尺寸监听](40.features/interaction/use-viewport.md)：ResizeObserver 防抖输出响应式宽高与 resize。
- [use-large-scrolling 大列表渲染裁剪](40.features/interaction/use-large-scrolling.md)：视口加缓冲区判定行是否渲染。
- [use-defer-list 延迟处理队列](40.features/interaction/use-defer-list.md)：挂起失焦清理、点选项时取消的延迟队列。
- [use-tree-data 树型数据组织](40.features/interaction/use-tree-data.md)：扁平 / 树根输入归一化与读写遍历扁平化。
- [use-row-indent 行缩进与展开图标](40.features/interaction/use-row-indent.md)：按行 ID 查缩进、状态与指示图标。
- [use-std-list-item 列表项标准化](40.features/interaction/use-std-list-item.md)：任意行对象转标准选项项。
- [use-app-bus 应用级消息总线](40.features/interaction/use-app-bus.md)：全局总线与窗口 resize 转发。
- [use-app-model-binding 应用模型绑定](40.features/interaction/use-app-model-binding.md)：绑定描述转 Props 与 `v-on` 表。

### field · 字段模型

- [field 字段集与标准字段](40.features/field/field-overview.md)：字段定义模型、标准字段 / 列初始化与助手函数。
- [use-field-change 字段值变更处理](40.features/field/use-field-change.md)：规整、校验、联动、通知的变更流水线。
- [use-field-com 字段控件选择](40.features/field/use-field-com.md)：按只读 / 激活状态选择字段控件与 comConf。
- [use-field-serializer 字段值序列化](40.features/field/use-field-serializer.md)：控件值写入模型前的转换。
- [use-field-tranformer 字段值反序列化](40.features/field/use-field-tranformer.md)：模型原始值读取到控件形态。
- [use-form-field-change 表单字段变更处理](40.features/field/use-form-field-change.md)：FieldRefer 解析、递归字段组与错误 HTML。

### range · 区间输入

- [use-input-range-api 区间输入 API](40.features/range/use-input-range-api.md)：任意区间形态解析、展示与编辑回写。
- [range 区间对话框与消息键](40.features/range/range-overview.md)：区间编辑器打开与消息键常量。

### validate · 校验

- [use-data-validate 整行数据校验](40.features/validate/use-data-validate.md)：`validateChange/validateData` 逐字段校验。
- [use-field-validate 校验规则编译](40.features/validate/use-field-validate.md)：字段 `validation` 规则编译为校验函数。
- [use-validate-results 校验结果按行存储](40.features/validate/use-validate-results.md)：按行 id 存取各行校验结果。
- [validate 字段编译与类型](40.features/validate/validate-overview.md)：内部校验字段构建、类型与全局规则注册表。

## 101.dev 开发规范

- [开发者参考手册](101.dev/README.md)：源码布局、新增组件、测试、构建与文档规范导览。
- [仓库源码布局](101.dev/01-source-layout.md)：注册表、types、Vue、api、example 等目录固定组成。
- [新增一个组件](101.dev/02-add-component.md)：从分类到注册、类型、视图与示例的完整步骤。
- [Vitest 测试约定](101.dev/03-testing.md)：测试目录、用例写法与当前覆盖范围。
- [构建与发布](101.dev/04-build-and-release.md)：`vue-tsc`、`vite build`、声明文件生成与预览命令。
- [文档与弃用规则](101.dev/05-doc-and-deprecation.md)：文档源码同步口径与弃用组件处理流程。
