---
title: 组件手册
keywords: [组件, components, 组件分类, action, edit, input, shelf, tile, view, 控件索引]
status: draft
---

# 组件手册

本手册覆盖 `src/lib/` 下注册的可用组件，**一个组件一篇**。共享 Props、事件规则、字典规则
统一引用 [`../10.concepts/`](../10.concepts/README.md)，组件篇不重复展开。

## 为什么要分成六类

组件库的控件如果平铺在一起，使用者很难判断“某类需求该找哪个控件”，组件自身也缺少统一
的设计归位。TiJS 按两个彼此独立的维度划分组件，对应注册表中的 `TiComRace`：

- **产出什么数据**：是简单单一的值（一个文本、一个数字、一个选项），还是复杂数据
  （富文本、记录集合、成对结构、代码片段）。
- **在页面上扮演什么角色**：是发起命令的动作、承载输入的表单控件、组织子控件的容器、
  小面积的信息小片，还是占大面积的复杂视图。

两个维度交叉后，落为下面六个常驻分类。分类不是行政目录，而是设计约束：同一类控件在交互
形态、Props 归属、插槽与事件上保持相似口径，阅读和扩展时可以套用同一套理解方式。

| 分类 | 目录 | `TiComRace` | 划分依据（源码枚举注释） | 注册数 | 已建文档 |
| --- | --- | --- | --- | --- | --- |
| 动作 | `action/` | `ACTION` | 按钮、导航条等执行用户命令的控件 | 6 | 6 |
| 输入 | `input/` | `INPUT` | 产出比较简单、单一的数据类型 | 27 | 27 |
| 编辑 | `edit/` | `EDIT` | 产出比较复杂的数据 | 7 | 6 |
| 搁架 | `shelf/` | `SHELF` | 组合更多子控件，用作界面布局 | 9 | 9 |
| 小片 | `tile/` | `TILE` | 小面积信息展示控件 | 13 | 13 |
| 视图 | `view/` | `VIEW` | 处理比较复杂的数据，页面上占位面积较大 | 13 | 11 |

> 注册表共 76 个键：72 个可用组件已建文档；`edit` 与 `view` 中 3 个弃用组件（见文末
> 「弃用组件」）不建文档；另有 1 个 `INNER` 内部子控件不单独成篇。
> `PLAY`（多媒体播放器）目前没有对外收录的注册组件；后续新增时再在本手册补充分类小节。

## action · 动作类

动作类控件的共同特征是**不收集数据，只发起命令或在多个页面 / 区块之间切换**。点击、
切换、翻页、打开面板这类操作都归到这里；它关心的是“触发了什么命令、携带什么载荷”，
而不是把用户录入的值存回模型。

控件索引：

- [TiActionBar 动作条](action/ti-action-bar.md) —— 成排命令容器，组合按钮、分隔线与下拉分组。
- [TiButton 按钮](action/ti-button.md) —— 执行命令的动作按钮，支持图标、状态色与点击载荷。
- [TiTabs 标签组](action/ti-tabs.md) —— 水平页签切换，支持溢出折叠。
- [TiSidebar 侧边导航](action/ti-sidebar.md) —— 带图标、标题与子级的竖向导航菜单。
- [TiPager 翻页器](action/ti-pager.md) —— 当前页、总页数、页大小与总条数的翻页控件。
- [TiDropTag 下拉标签](action/ti-drop-tag.md) —— 紧凑芯片形态的小型选择标签。

## input · 输入类

输入类是数量最大的一组，共同特征是**产出一个简单、单一的值**：文本、数字、布尔、颜色、
日期、图标、经纬度、单选或多选选项等。每个控件对应一种值类型或一种录入姿势，只读、占位、
选项、前后缀等横切能力由共享 Props 提供。

控件索引：

- [TiInput 输入框](input/ti-input.md) —— 基础输入框（内部代号 box3）。
- [TiInputText 文本框](input/ti-input-text.md) —— 单行 / 多行纯文本输入。
- [TiInputMultiLines 多行标签输入](input/ti-input-multi-lines.md) —— 标签集合式多行录入。
- [TiInputPassword 密码输入框](input/ti-input-password.md) —— 圆点遮蔽、眼睛切换明文。
- [TiInputNum 数字输入框](input/ti-input-num.md) —— 数值录入与展示格式化。
- [TiInputNumRange 数字区间](input/ti-input-num-range.md) —— 数值范围录入。
- [TiInputNumUnit 带单位数字](input/ti-input-num-unit.md) —— 数字加单位组合框。
- [TiInputCode 编号输入](input/ti-input-code.md) —— 编码加描述的输入框。
- [TiCheck 勾选框](input/ti-check.md) —— 单复选开关。
- [TiCheckList 多选列表](input/ti-check-list.md) —— 竖排复选列表。
- [TiRadioList 单选列表](input/ti-radio-list.md) —— 竖排单选列表。
- [TiSwitcher 开关组](input/ti-switcher.md) —— 横排选项按钮组。
- [TiToggle 拨动开关](input/ti-toggle.md) —— 轨道滑块拨动开关。
- [TiDroplist 下拉列表](input/ti-droplist.md) —— 只读下拉单选。
- [TiMultiDroplist 多选下拉框](input/ti-multi-droplist.md) —— 标签形式的多选下拉。
- [TiInputCombo 复合输入框](input/ti-input-combo.md) —— 可输入触发选项的组合框。
- [TiInputPicker 挑选输入框](input/ti-input-picker.md) —— 弹出面板选择（scaffold 占位）。
- [TiTransfer 穿梭框](input/ti-transfer.md) —— 左右两栏候选与已选穿梭。
- [TiInputDate 日期选择](input/ti-input-date.md) —— 日历日期选择。
- [TiInputDateRange 日期范围](input/ti-input-date-range.md) —— 日期区间选择。
- [TiInputDatetime 日期时间框](input/ti-input-datetime.md) —— 日期加时刻选择。
- [TiInputTime 时间框](input/ti-input-time.md) —— 时刻分数字框录入。
- [TiInputColor 颜色框](input/ti-input-color.md) —— 颜色选择（scaffold 占位）。
- [TiInputIcon 选择图标](input/ti-input-icon.md) —— 图标选择（scaffold 占位）。
- [TiInputLngLat 经纬度](input/ti-input-lnglat.md) —— 经度、纬度双数字框。
- [TiScore 评分条](input/ti-score.md) —— 星级评分。
- [TiInputGroup 输入控件组](input/ti-input-group.md) —— 多个相关字段压在一行 / 网格里。

## edit · 编辑类

编辑类与输入类的分界是**产出数据的复杂度**：输入类只回写一个标量值，编辑类面对的是
结构化、多段、需要专门交互界面的数据——成对键值、记录集合、富文本、代码、批量表单。
这类控件通常自带弹出面板、多段编辑区或独立工具栏。

控件索引：

- [TiCodeEditor 代码编辑器](edit/ti-code-editor.md) —— 基于 Ace 的代码编辑器。
- [TiEditPairs 键值对编辑](edit/ti-edit-pairs.md) —— 对象转可编辑键值对表格。
- [TiEditRich 富文本编辑器](edit/ti-edit-rich.md) —— 所见即所得富文本。
- [TiEditRecords 记录集合编辑](edit/ti-edit-records.md) —— 对象数组记录表格编辑。
- [TiSorter 排序器](edit/ti-sorter.md) —— 排序条件标签组配置。
- [TiBatchForm 批量表单](edit/ti-batch-form.md) —— 字段勾选式批量修改表单。
- `TiFilterBar` —— **待删除，不写使用教程**。

## shelf · 搁架类

搁架类是**组织子控件的容器与布局件**：表单、栅格字段、区块、网格布局、标签页布局，以及
日历、周视图、时间段这类按时间组织内容的专用容器。它本身不承载单一录入值，职责是决定
“子控件摆在哪里、按什么规则排列”。

> 注：`TiGridFields` 在源码注册表中的 `race` 实际为 `INNER`（内部栅格引擎，被 `TiForm` /
> `TiTabsForm` 包装），并非对外的 `SHELF`；本手册按使用场景归入搁架类说明，以源码注册表为准。

控件索引：

- [TiForm 表单](shelf/ti-form.md) —— 单条记录录入表单容器。
- [TiTabsForm 标签表单](shelf/ti-tabs-form.md) —— 顶层字段自动成标签页的分页签表单。
- [TiGridFields 栅格字段布局](shelf/ti-grid-fields.md) —— CSS Grid 字段栅格底层引擎。
- [TiBlock 布局块](shelf/ti-block.md) —— 标题栏加动作栏加内容区的最小容器。
- [TiLayoutGrid 栅格布局](shelf/ti-layout-grid.md) —— schema 加 blocks、可拖拽调宽的整页栅格骨架。
- [TiLayoutTabs 标签布局](shelf/ti-layout-tabs.md) —— blocks 互斥切页签的布局容器。
- [TiCalendar 日历](shelf/ti-calendar.md) —— 受控月视图日期选择。
- [TiWeeks 周视图](shelf/ti-weeks.md) —— 周视图排程（scaffold 占位）。
- [TiTimeSlots 时间段视图](shelf/ti-time-slots.md) —— 日时间槽（scaffold 占位）。

## tile · 小片类

小片类是**小面积、以展示为主**的信息单元：图标、图片、缩略图、标签、标签组、进度条、
面包屑、片段内容、上传状态条等。它通常被表单、列表、表格、卡片反复引用，体积小、状态
简单，不承担复杂交互。

控件索引：

- [TiIcon 图标](tile/ti-icon.md) —— 字体 / Emoji / 图片统一图标。
- [TiImage 图像](tile/ti-image.md) —— 图片展示与加载态。
- [TiThumb 缩略图](tile/ti-thumb.md) —— 预览加标题加标记的卡片组合件。
- [TiLabel 标签](tile/ti-label.md) —— 文本标签只读展示。
- [TiLabelTags 选项标签](tile/ti-label-tags.md) —— 多值字典翻译标签展示。
- [TiTags 标签组](tile/ti-tags.md) —— 标签组展示与轻交互。
- [TiCrumb 面包屑导航](tile/ti-crumb.md) —— 层级路径导航条。
- [TiProgressBar 进度条](tile/ti-progress-bar.md) —— 纯展示进度条。
- [TiTextSnippet 文本片段](tile/ti-text-snippet.md) —— 一行可模板替换的文字。
- [TiHtmlSnippet HTML 片段](tile/ti-html-snippet.md) —— 当前文档内 v-html 片段。
- [TiHtmlFrame HTML 框架](tile/ti-html-frame.md) —— iframe 沙箱样式隔离展示。
- [TiUploadBar 上传状态条](tile/ti-upload-bar.md) —— 横向上传位外壳。
- [TiUploadTile 上传卡片](tile/ti-upload-tile.md) —— 卡片式大缩略图上传位。

## view · 视图类

视图类处理**复杂数据，在页面上占据大面积**：表格、列表、树、树表、地图、瀑布流、流程
进度、阻塞遮罩、加载状态、独立 HTML 页面等。它往往需要自己的工具栏、分页、行状态、
空态与加载态，是页面上的主体区域。

控件索引：

- [TiTable 数据表格](view/ti-table.md) —— 多列数据表，支持选区与虚拟滚动。
- [TiTreeTable 树形表格](view/ti-tree-table.md) —— 树状数据表格。
- [TiTree 树形结构](view/ti-tree.md) —— 扁平数据建树的树形列表。
- [TiList 列表](view/ti-list.md) —— 通用纵向选项列表。
- [TiFalls 瀑布流](view/ti-falls.md) —— 不等高多列瀑布容器（占位骨架）。
- [TiWall 墙式多列布局](view/ti-wall.md) —— 自适应网格卡片墙。
- [TiLbsMap 地图](view/ti-lbs-map.md) —— Leaflet 位置地图。
- [TiProcess 步骤流程](view/ti-process.md) —— 标题、进度、状态列表与日志面板。
- [TiRoadblock 阻塞遮罩](view/ti-roadblock.md) —— 图标加文字加链接的占位牌。
- [TiLoading 加载状态](view/ti-loading.md) —— 加载标牌薄封装。
- [TiHtmlPage HTML 页面容器](view/ti-html-page.md) —— 字符串模板动态渲染。
- `TiFilter` —— **待删除，不写使用教程**。
- `TiComboFilter` —— **待删除，不写使用教程**。

## 弃用组件（不写使用教程）

`TiFilter`、`TiComboFilter`、`TiFilterBar` 在 `src/lib/lib-com-types.ts` 中已标注
待删除，新代码不要使用；本手册不为它们编写使用教程。

## 延伸阅读

- 组件注册表机制：[`../10.concepts/01-component-model.md`](../10.concepts/01-component-model.md)
- 组件素材抽取约定：`doc/skill/write-tijs-doc.skill.md` 第 5 节
