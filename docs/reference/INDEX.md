---
title: 参考手册总索引
keywords: [INDEX, 索引, 文档目录, 篇目清单]
status: done
---

# 参考手册总索引

> 按分区汇总全部已建成篇目；新增篇目时在对应分组追加一行。
> 格式：`- \`路径\` — 标题 — 模块：源码模块 — 关键词：关键词`（与 wn-doc 索引口径一致，供 Agent 检索）；
> 一句话说明保留在各分区 `README.md` 的篇目列表里，本索引不重复。

## 00.start-here 入门

- `00.start-here/README.md` — 入门 — 模块：src/index.ts — 关键词：入门, 快速开始, getting started, 安装, 第一个组件, TiJS, 新手指南
- `00.start-here/01-getting-started.md` — 快速上手 — 模块：src/core/ti-exports.ts — 关键词：快速上手, getting started, 安装, install, main.ts, 引导, TiLabel, 第一个组件

## 10.concepts 概念机制

- `10.concepts/README.md` — 核心概念机制 — 模块：src/core/ti-coms.ts — 关键词：概念, 机制, 组件模型, 共享属性, 事件, 国际化, 样式, 字典
- `10.concepts/01-component-model.md` — 组件模型 — 模块：src/core/ti-coms.ts — 关键词：组件模型, TiComInfo, TiComRace, 注册表, install, 组件注册, TiCom, race
- `10.concepts/02-common-props.md` — 共享 Props — 模块：src/_type/core-types.ts — 关键词：共享属性, CommonProps, readonly, placeholder, prefix, suffix, icon, tipable
- `10.concepts/03-event-binding.md` — 事件绑定 — 模块：src/lib/_features/use-emit-adaptor.ts — 关键词：事件, emit, emits, EmitAdaptor, exampleModel, 事件适配, change, value
- `10.concepts/04-i18n.md` — 国际化 i18n — 模块：src/i18n/zh-cn.ts — 关键词：国际化, i18n, 语言包, lang, toLangKey, i18n前缀, updateInstalledComponentsLangs, installTiCoreI18n
- `10.concepts/05-style-system.md` — 样式体系 — 模块：src/assets/style/app.scss — 关键词：样式, SCSS, CSS变量, 主题, light, dark, comfy, tight
- `10.concepts/06-dict-model.md` — 字典模型 — 模块：src/core/dict/ti-dict.ts — 关键词：字典, Dict, Dicts, 选项, options, 静态字典, 动态字典, DictItem

## 20.core-utils 工具

- `20.core-utils/10-str.md` — Str 字符串工具 — 模块：src/core/text/ti-str.ts — 关键词：Str, 字符串, 工具, isBlank, toJsValue, partitions, toCase, join
- `20.core-utils/20-alg.md` — Alg 算法工具 — 模块：src/core/alg/ti-alg.ts — 关键词：Alg, 算法, base26, 指纹, md5, sha1, sha256, 雪花ID
- `20.core-utils/30-dicts.md` — Dicts 字典注册表 — 模块：src/core/dict/ti-dict.ts — 关键词：Dicts, 字典, Dict, 注册表, 工厂, createDict, getDict, 动态字典
- `20.core-utils/40-fuse.md` — fuse 异步保险丝 — 模块：src/core/fuse/index.ts — 关键词：fuse, 保险丝, 熔断, Detonator, useFuse, FuseApi, fire, 取消操作
- `20.core-utils/50-g2d.md` — G2D 二维几何 — 模块：src/core/g2d/ti-g2d.ts — 关键词：G2D, 几何, 2D, 距离, distance, Point2D, 坐标, getDistance
- `20.core-utils/60-match.md` — Match 条件匹配 — 模块：src/core/match/ti-match.ts — 关键词：Match, TiMatch, 匹配, 条件, by_str, by_regex, 范围, exists
- `20.core-utils/70-net.md` — Net 网络辅助 — 模块：src/core/net/ti-net.ts — 关键词：Net, 动态导入, ES Module, import, loadESModule, importESModule, QQBrowser, 网络
- `20.core-utils/80-num.md` — Num 数值工具 — 模块：src/core/num/ti-num.ts — 关键词：Num, 数值, 数学, gcd, lcm, 区间, scrollIndex, precise
- `20.core-utils/90-ti-store.md` — TiStore 本地存储 — 模块：src/core/storage/ti-storage.ts — 关键词：TiStore, TiStorage, localStorage, sessionStorage, 本地存储, 会话存储, 缓存, getObject
- `20.core-utils/100-i18n.md` — I18n 国际化 — 模块：src/core/text/ti-i18n.ts — 关键词：I18n, 国际化, i18n, 语言包, toLangKey, putAll, text, getf
- `20.core-utils/110-datetime.md` — DateTime 日期时间 — 模块：src/core/time/datetime.ts — 关键词：DateTime, 日期, 时间, 解析, 格式化, 时区, parse, format
- `20.core-utils/120-tmpl.md` — Tmpl 模板引擎 — 模块：src/core/tmpl/ti-tmpl.ts — 关键词：Tmpl, 模板, 模板引擎, parse, exec, loop, if, else
- `20.core-utils/130-util.md` — Util 通用工具集 — 模块：src/core/util/index.ts — 关键词：Util, 工具, 集合, 冲突, conflict, diff, getter, invoking
- `20.core-utils/140-web.md` — Web 浏览器 DOM 工具 — 模块：src/core/web/index.ts — 关键词：Web, CssUtils, Dom, EventUtils, CSS, DOM, className, style
- `20.core-utils/150-be.md` — Be 元素行为扩展 — 模块：src/core/web/behaviors/index.ts — 关键词：Be, BlinkIt, EditIt, OpenUrl, chooseFiles, Clipboard, clipboard, 闪烁
- `20.core-utils/160-top.md` — _top 顶级工具 — 模块：src/core/_top/index.ts — 关键词：_top, createBus, TiBus, getEnv, Icons, getRandomStr, Rects, Bank

## 30.components 组件

### action · 动作类

- `30.components/action/ti-action-bar.md` — TiActionBar 动作条 — 模块：src/lib/action/actionbar — 关键词：动作条, 工具栏, 菜单, action bar, toolbar, TiActionBar, 命令组, 下拉菜单
- `30.components/action/ti-button.md` — TiButton 按钮 — 模块：src/lib/action/button — 关键词：按钮, button, TiButton, click, action, 命令按钮, 动作控件
- `30.components/action/ti-drop-tag.md` — TiDropTag 下拉标签 — 模块：src/lib/action/drop-tag — 关键词：下拉标签, 标签, drop tag, dropdown, TiDropTag, 选择器, 芯片, chip
- `30.components/action/ti-pager.md` — TiPager 翻页器 — 模块：src/lib/action/pager — 关键词：翻页, 分页, pager, pagination, TiPager, 页码, 跳转, 指示器
- `30.components/action/ti-sidebar.md` — TiSidebar 侧边导航 — 模块：src/lib/action/sidebar — 关键词：侧边栏, 导航, 菜单, sidebar, nav, menu, TiSidebar, 树形菜单
- `30.components/action/ti-tabs.md` — TiTabs 标签组 — 模块：src/lib/action/tabs — 关键词：标签页, 页签, tabs, tab, TiTabs, 切换, 选项卡, tab bar

### edit · 编辑类

- `30.components/edit/ti-batch-form.md` — TiBatchForm 批量表单 — 模块：src/lib/edit/batch-form — 关键词：批量表单, batch form, TiBatchForm, 批量修改, 字段勾选, 部分更新, EDIT
- `30.components/edit/ti-code-editor.md` — TiCodeEditor 代码编辑 — 模块：src/lib/edit/code — 关键词：代码编辑, code editor, TiCodeEditor, ace, 代码高亮, JSON 编辑, markdown 编辑, EDIT
- `30.components/edit/ti-edit-pairs.md` — TiEditPairs 名值对编辑 — 模块：src/lib/edit/pair — 关键词：名值对编辑, EditPairs, TiEditPairs, 对象表单, JSON 编辑, 分组表单, tabs 表单, EDIT
- `30.components/edit/ti-edit-records.md` — TiEditRecords 记录对象编辑 — 模块：src/lib/edit/edit-records — 关键词：记录编辑, EditRecords, TiEditRecords, 表格编辑, 行编辑, 增删行, 批量记录, EDIT
- `30.components/edit/ti-edit-rich.md` — TiEditRich 富文本编辑 — 模块：src/lib/edit/rich/prose/ti-edit-rich-prose-index.ts — 关键词：富文本, rich editor, TiEditRich, TiEditRichProse, prosemirror, 文档编辑, WYSIWYG, EDIT
- `30.components/edit/ti-sorter.md` — TiSorter 排序器 — 模块：src/lib/edit/sorter — 关键词：排序, sorter, TiSorter, 排序条件, 排序字段, ASC, DESC, 标签

### input · 输入类

- `30.components/input/ti-input.md` — TiInput 输入框 — 模块：src/lib/input/box3 — 关键词：输入框, input, TiInput, box3, 文本输入, 自动补全, 提示列表, 字典
- `30.components/input/ti-input-text.md` — TiInputText 文本框 — 模块：src/lib/input/text — 关键词：文本框, textarea, TiInputText, 多行文本, 列表值, 文本输入
- `30.components/input/ti-input-multi-lines.md` — TiInputMultiLines 多行标签输入 — 模块：src/lib/input/multi-lines — 关键词：多行输入, 标签输入, 多选标签, multi-lines, TiInputMultiLines, 数组录入, chips
- `30.components/input/ti-input-password.md` — TiInputPassword 密码输入框 — 模块：src/lib/input/passwd — 关键词：密码, password, TiInputPassword, 密码强度, 遮蔽输入, 显示隐藏密码
- `30.components/input/ti-input-num.md` — TiInputNum 数字输入框 — 模块：src/lib/input/num — 关键词：数字输入, number, TiInputNum, 金额格式化, 千分位, 数字分段, 精度
- `30.components/input/ti-input-num-range.md` — TiInputNumRange 数字区间 — 模块：src/lib/input/num-range — 关键词：数字区间, 范围, range, TiInputNumRange, 大小区间, 比较对象, 区间选择
- `30.components/input/ti-input-num-unit.md` — TiInputNumUnit 带单位数字 — 模块：src/lib/input/num-unit — 关键词：数字单位, 金额, 重量, 体积, TiInputNumUnit, 单位选择, 货币单位
- `30.components/input/ti-input-code.md` — TiInputCode 编号输入 — 模块：src/lib/input/code — 关键词：编号, code, TiInputCode, 记录主键, 编码输入, 描述区, 字典编号
- `30.components/input/ti-check.md` — TiCheck 勾选框 — 模块：src/lib/input/check — 关键词：勾选框, 复选框, checkbox, TiCheck, 布尔开关, 勾选, 自定义真假值
- `30.components/input/ti-check-list.md` — TiCheckList 多选列表 — 模块：src/lib/input/checklist — 关键词：多选列表, 勾选列表, check list, TiCheckList, 多选, 选项组, 复选列表
- `30.components/input/ti-radio-list.md` — TiRadioList 单选列表 — 模块：src/lib/input/radiolist — 关键词：单选列表, 单选框, radio, TiRadioList, 单选, 选项组, 纵向单选
- `30.components/input/ti-switcher.md` — TiSwitcher 开关组 — 模块：src/lib/input/switcher — 关键词：开关组, 分段选择, switcher, TiSwitcher, 按钮组, 标签组, 单选多选按钮
- `30.components/input/ti-toggle.md` — TiToggle 拨动开关 — 模块：src/lib/input/toggle — 关键词：拨动开关, 开关, toggle, TiToggle, switch, 滑动开关, 布尔开关
- `30.components/input/ti-droplist.md` — TiDroplist 下拉列表 — 模块：src/lib/input/droplist — 关键词：下拉列表, 下拉选择, dropdown, droplist, TiDroplist, 单选下拉, 候选取值
- `30.components/input/ti-multi-droplist.md` — TiMultiDroplist 多选下拉框 — 模块：src/lib/input/multi-droplist — 关键词：多选, 下拉框, multi-droplist, TiMultiDroplist, 标签多选, 选项过滤, INPUT
- `30.components/input/ti-input-combo.md` — TiInputCombo 复合输入框 — 模块：src/lib/input/combo — 关键词：复合输入, 自动补全, combo, TiInputCombo, 下拉建议, 模糊匹配, INPUT
- `30.components/input/ti-input-picker.md` — TiInputPicker 挑选输入框 — 模块：src/lib/input/picker — 关键词：挑选, 弹窗选择, picker, TiInputPicker, 模态选择, scaffold, INPUT
- `30.components/input/ti-transfer.md` — TiTransfer 穿梭框 — 模块：src/lib/input/transfer — 关键词：穿梭框, transfer, TiTransfer, 双栏选择, 候选列表, 已选列表, INPUT
- `30.components/input/ti-input-date.md` — TiInputDate 日期选择 — 模块：src/lib/input/date — 关键词：日期, 日历, date, TiInputDate, 日期选择, 日历浮层, INPUT
- `30.components/input/ti-input-date-range.md` — TiInputDateRange 日期范围 — 模块：src/lib/input/date-range — 关键词：日期范围, 区间, date-range, TiInputDateRange, 起止日期, 比较条件, INPUT
- `30.components/input/ti-input-datetime.md` — TiInputDatetime 日期时间框 — 模块：src/lib/input/datetime — 关键词：日期时间, datetime, TiInputDatetime, 日期时间选择, 日历加时间, INPUT
- `30.components/input/ti-input-time.md` — TiInputTime 时间框 — 模块：src/lib/input/time — 关键词：时间, 时间框, time, TiInputTime, 时分秒, 一天内时间, INPUT
- `30.components/input/ti-input-color.md` — TiInputColor 颜色框 — 模块：src/lib/input/color — 关键词：颜色, 颜色选择, color, TiInputColor, 取色器, scaffold, INPUT
- `30.components/input/ti-input-icon.md` — TiInputIcon 选择图标 — 模块：src/lib/input/icon — 关键词：图标, 选择图标, icon, TiInputIcon, 图标挑选, scaffold, INPUT
- `30.components/input/ti-input-lnglat.md` — TiInputLngLat 经纬度 — 模块：src/lib/input/lnglat — 关键词：经纬度, 坐标, lnglat, TiInputLngLat, 地图选点, 地图编辑器, INPUT
- `30.components/input/ti-score.md` — TiScore 评分条 — 模块：src/lib/input/score — 关键词：评分, 星级, score, TiScore, 星级评分, 半星, INPUT
- `30.components/input/ti-input-group.md` — TiInputGroup 输入控件组 — 模块：src/lib/input/group — 关键词：输入组, 字段组, input-group, TiInputGroup, 多字段录入, 组合输入, INPUT

### shelf · 搁架类

- `30.components/shelf/ti-form.md` — TiForm 表单 — 模块：src/lib/shelf/form — 关键词：表单, form, TiForm, 字段录入, 记录编辑, SHELF
- `30.components/shelf/ti-tabs-form.md` — TiTabsForm 标签表单 — 模块：src/lib/shelf/form — 关键词：标签表单, tabs form, TiTabsForm, 分页签表单, 多页录入, SHELF
- `30.components/shelf/ti-grid-fields.md` — TiGridFields 栅格字段组 — 模块：src/lib/shelf/grid-fields — 关键词：栅格字段组, grid fields, TiGridFields, 表单, 字段布局, 嵌套字段, SHELF
- `30.components/shelf/ti-block.md` — TiBlock 布局块 — 模块：src/lib/shelf/block — 关键词：布局块, block, TiBlock, 面板容器, 标题栏, 动作栏, SHELF
- `30.components/shelf/ti-layout-grid.md` — TiLayoutGrid 栅格布局 — 模块：src/lib/shelf/layout — 关键词：栅格布局, layout grid, TiLayoutGrid, 区块布局, 可拖拽, schema, SHELF
- `30.components/shelf/ti-layout-tabs.md` — TiLayoutTabs 标签布局 — 模块：src/lib/shelf/layout — 关键词：标签布局, layout tabs, TiLayoutTabs, 页签容器, 多视图切换, SHELF
- `30.components/shelf/ti-calendar.md` — TiCalendar 日历 — 模块：src/lib/shelf/calendar — 关键词：日历, calendar, TiCalendar, 日期选择, 月视图, 日期格, SHELF
- `30.components/shelf/ti-weeks.md` — TiWeeks 周视图 — 模块：src/lib/shelf/weeks — 关键词：周视图, weeks, TiWeeks, 周排程, 日历周, SHELF, scaffold
- `30.components/shelf/ti-time-slots.md` — TiTimeSlots 日时间槽 — 模块：src/lib/shelf/time-slots — 关键词：日时间槽, time slots, TiTimeSlots, 时间格, 排班, SHELF, scaffold

### tile · 小片类

- `30.components/tile/ti-crumb.md` — TiCrumb 面包屑导航条 — 模块：src/lib/tile/crumb — 关键词：面包屑, crumb, breadcrumb, TiCrumb, 导航, 路径导航, TILE
- `30.components/tile/ti-html-frame.md` — TiHtmlFrame HTML框架 — 模块：src/lib/tile/html-frame — 关键词：html, iframe, frame, TiHtmlFrame, HTML渲染, 富文本, 内嵌网页, TILE
- `30.components/tile/ti-html-snippet.md` — TiHtmlSnippet HTML片段 — 模块：src/lib/tile/html-snippet — 关键词：html, snippet, HTML片段, v-html, TiHtmlSnippet, 富文本, 事件委托, TILE
- `30.components/tile/ti-icon.md` — TiIcon 图标 — 模块：src/lib/tile/icon — 关键词：图标, icon, TiIcon, font-icon, svg, emoji, 图片图标, TILE
- `30.components/tile/ti-image.md` — TiImage 图像 — 模块：src/lib/tile/image — 关键词：图像, 图片, image, img, TiImage, svg, 拖拽文件, object-fit
- `30.components/tile/ti-label-tags.md` — TiLabelTags 选项标签 — 模块：src/lib/tile/label-tags — 关键词：标签组, label-tags, tags, TiLabelTags, 多值展示, 字典翻译, 标签云, TILE
- `30.components/tile/ti-label.md` — TiLabel 标签 — 模块：src/lib/tile/label — 关键词：标签, label, TiLabel, 展示, 前缀图标, 后缀图标, 复制, 超链接
- `30.components/tile/ti-progress-bar.md` — TiProgressBar 进度条 — 模块：src/lib/tile/progress-bar — 关键词：进度条, progress, progress-bar, TiProgressBar, 百分比, 水平, 垂直, TILE
- `30.components/tile/ti-tags.md` — TiTags 标签组 — 模块：src/lib/tile/tags — 关键词：标签组, tags, TiTags, tag, 标签, 可编辑, 可排序, 过滤条件
- `30.components/tile/ti-text-snippet.md` — TiTextSnippet 文字片段 — 模块：src/lib/tile/text-snippet — 关键词：文字, 文本, snippet, text, TiTextSnippet, 前缀图标, 动态文本, TILE
- `30.components/tile/ti-thumb.md` — TiThumb 缩略图 — 模块：src/lib/tile/thumb — 关键词：缩略图, thumb, thumbnail, TiThumb, 图片预览, 指示标记, 进度条, TILE
- `30.components/tile/ti-upload-bar.md` — TiUploadBar 上传条 — 模块：src/lib/tile/upload — 关键词：上传, upload, upload-bar, TiUploadBar, 文件上传, 进度, 拖拽, TILE
- `30.components/tile/ti-upload-tile.md` — TiUploadTile 上传贴片 — 模块：src/lib/tile/upload — 关键词：上传, upload, upload-tile, TiUploadTile, 文件卡片, 缩略图上传, 拖拽, TILE

### view · 视图类

- `30.components/view/ti-falls.md` — TiFalls 瀑布贴 — 模块：src/lib/view/falls — 关键词：瀑布贴, falls, TiFalls, waterfall, 瀑布流, 视图
- `30.components/view/ti-html-page.md` — TiHtmlPage HTML页面 — 模块：src/lib/view/html-page — 关键词：html, htmlpage, TiHtmlPage, 页面, 模板渲染, 动态组件, 视图
- `30.components/view/ti-lbs-map.md` — TiLbsMap 地图 — 模块：src/lib/view/lbs-map — 关键词：地图, lbs, TiLbsMap, 经纬度, leaflet, 定位, 标记点, 视图
- `30.components/view/ti-list.md` — TiList 列表 — 模块：src/lib/view/list — 关键词：列表, list, TiList, 选项列表, 单选, 多选, 树形列表, 视图
- `30.components/view/ti-loading.md` — TiLoading 加载标牌 — 模块：src/lib/view/loading — 关键词：加载, loading, TiLoading, 等待, spinner, 加载中, 视图
- `30.components/view/ti-process.md` — TiProcess 处理过程 — 模块：src/lib/view/process — 关键词：处理过程, process, TiProcess, 进度, progress, 进度条, 日志, 可中止
- `30.components/view/ti-roadblock.md` — TiRoadblock 路障牌 — 模块：src/lib/view/roadblock — 关键词：路障, roadblock, TiRoadblock, 占位, 空态, 提示牌, 遮盖, 加载
- `30.components/view/ti-table.md` — TiTable 表格 — 模块：src/lib/view/table — 关键词：表格, table, TiTable, 数据表, 列定义, 可编辑表格, 虚拟滚动, 视图
- `30.components/view/ti-tree.md` — TiTree 树 — 模块：src/lib/view/tree — 关键词：树, tree, TiTree, 树形列表, 层级, 折叠展开, 视图
- `30.components/view/ti-tree-table.md` — TiTreeTable 树状表格 — 模块：src/lib/view/tree-table — 关键词：树状表格, tree-table, TiTreeTable, 树形表格, 层级表格, 展开, 视图
- `30.components/view/ti-wall.md` — TiWall 墙贴 — 模块：src/lib/view/wall — 关键词：墙贴, wall, TiWall, 网格, 卡片墙, 缩略图墙, 视图

## 40.features 特性

### value · 值输入与处理

- `40.features/value/use-value-input.md` — use-value-input 输入值规整 — 模块：src/lib/_features/use-value-input.ts — 关键词：hook, useValueInput, use-value-input, 输入规整, tidyValue, translateValue, 字典校验, renderHint
- `40.features/value/use-value-box.md` — use-value-box 值显示框聚合 — 模块：src/lib/_features/use-value-box.ts — 关键词：hook, useValueBox, use-value-box, ValueBox, 输入框, 前后缀, 值翻译, doUpdateValue
- `40.features/value/use-value-pipe.md` — use-value-pipe 值处理管道 — 模块：src/lib/_features/use-value-pipe.ts — 关键词：hook, useValuePipe, use-value-pipe, 管道, pipe, 处理器, $TRIM, $CASE
- `40.features/value/use-value-translator.md` — use-value-translator 值翻译器 — 模块：src/lib/_features/use-value-translator.ts — 关键词：hook, useValueTranslator, use-value-translator, 翻译, translator, valueTranslators, 字典翻译, Match
- `40.features/value/use-format-value.md` — use-format-value 值格式化 — 模块：src/lib/_features/use-format-value.ts — 关键词：hook, useFormatValue, use-format-value, format, 格式化, 模板, Tmpl, valueKeyOfVars
- `40.features/value/use-display-text.md` — use-display-text 显示文本取值 — 模块：src/lib/_features/use-display-text.ts — 关键词：hook, useDisplayText, use-display-text, getDisplayText, useRawValue, displayText, 选项文本, PickDisplayText
- `40.features/value/use-boolean-input.md` — use-boolean-input 布尔输入逻辑 — 模块：src/lib/_features/use-boolean-input.ts — 关键词：hook, useBooleanInput, use-boolean-input, 布尔, toggle, check, switch, values
- `40.features/value/use-data-logic-type.md` — use-data-logic-type 行逻辑类型 — 模块：src/lib/_features/use-data-logic-type.ts — 关键词：hook, useDataLogicType, use-data-logic-type, LogicType, getRowType, Match, 行类型, table
- `40.features/value/dft-val-pipes.md` — dft-val-pipes 默认值管道集 — 模块：src/lib/_features/val-pipes/dft-val-pipes.ts — 关键词：getDefaultValPipes, dft-val-pipes, 默认管道, ValueProcesser, $TRIM, $F2, $DT, $DESENS

### options · 选项与字典

- `40.features/options/use-options.md` — use-options 选项字典构建 — 模块：src/lib/_features/use-options.ts — 关键词：hook, useOptions, use-options, OptionsProps, options, dict, 静态字典, 动态字典
- `40.features/options/use-option-item.md` — use-option-item 选项项抽取与查找 — 模块：src/lib/_features/use-option-item.ts — 关键词：hook, useOptionItem, use-option-item, OptionItem, toOptionItem, getText, getValue, lookupItem
- `40.features/options/use-options-filter.md` — use-options-filter 选项列表过滤拼装 — 模块：src/lib/_features/use-options-filter.ts — 关键词：hook, useOptionsFilter, use-options-filter, optionFilter, fixedOptions, showCleanOption, 清除选项, lookup
- `40.features/options/use-options-reloading.md` — use-options-reloading 选项异步重载 — 模块：src/lib/_features/use-options-reloading.ts — 关键词：hook, useOptionsReloading, use-options-reloading, reload, 异步加载, hint, pending, 竞态
- `40.features/options/use-dict.md` — use-dict 字典实例构建器 — 模块：src/lib/_features/use-dict.ts — 关键词：hook, useDict, use-dict, DictProps, dict, 字典, getText, getIcon

### shared · 共享样式与文本

- `40.features/shared/use-class-style.md` — use-class-style 类名与样式合并 — 模块：src/lib/_features/use-class-style.ts — 关键词：hook, useClassStyle, use-class-style, className, style, CssUtils, 类名合并, 内联样式
- `40.features/shared/use-icon-text.md` — use-icon-text 图标文字单元 — 模块：src/lib/_features/use-icon-text.ts — 关键词：hook, useIconText, use-icon-text, IconText, icon, text, hoverIcon, hoverText
- `40.features/shared/use-prefix-suffix.md` — use-prefix-suffix 前后缀单元 — 模块：src/lib/_features/use-prefix-suffix.ts — 关键词：hook, usePrefixSuffix, use-prefix-suffix, PrefixSuffix, prefix, suffix, 前缀, 后缀
- `40.features/shared/use-placeholder.md` — use-placeholder 占位文本 — 模块：src/lib/_features/use-placeholder.ts — 关键词：hook, usePlaceholder, use-placeholder, placeholder, 占位符, 占位文本, autoI18n, 空值提示
- `40.features/shared/use-tipable.md` — use-tipable 悬浮提示挂载 — 模块：src/lib/_features/use-tipable.ts — 关键词：hook, useTipable, use-tipable, Tipable, tip, 提示, tooltip, 悬浮提示
- `40.features/shared/use-docking.md` — use-docking 弹层停靠定位 — 模块：src/lib/_features/use-docking.ts — 关键词：hook, useDocking, use-docking, docking, 停靠, 弹层定位, genDockingStyle, 象限
- `40.features/shared/use-readonly.md` — use-readonly 只读状态判定 — 模块：src/lib/_features/use-readonly.ts — 关键词：hook, useReadonly, use-readonly, readonly, 只读, ReadonlyProps, Match, isReadonly
- `40.features/shared/use-visibility.md` — use-visibility 显隐与禁用判定 — 模块：src/lib/_features/use-visibility.ts — 关键词：hook, useVisibility, use-visibility, visibility, visible, hidden, disabled, enabled
- `40.features/shared/use-keep.md` — use-keep 状态持久化存取 — 模块：src/lib/_features/use-keep.ts — 关键词：hook, useKeep, use-keep, keep, keepAt, keepMode, session, local
- `40.features/shared/use-emit-adaptor.md` — use-emit-adaptor 子事件适配转发 — 模块：src/lib/_features/use-emit-adaptor.ts — 关键词：hook, useEmitAdaptor, use-emit-adaptor, EmitAdaptor, events, 事件适配, 容器组件, stopPropagation

### interaction · 通用交互与布局

- `40.features/interaction/use-selectable.md` — use-selectable 列表选区 — 模块：src/lib/_features/use-selectable.ts — 关键词：hook, useSelectable, use-selectable, 选择, 选区, currentId, checkedIds, 多选
- `40.features/interaction/use-dragging.md` — use-dragging 指针拖拽 — 模块：src/lib/_features/use-dragging.ts — 关键词：hook, useDragging, use-dragging, Dragging, 拖拽, pointer, 拖拽阈值, onMoving
- `40.features/interaction/use-dropping.md` — use-dropping 文件拖放 — 模块：src/lib/_features/use-dropping.ts — 关键词：hook, useDropping, use-dropping, drop, dragover, dragenter, 文件拖放, FileList
- `40.features/interaction/use-grid-layout.md` — use-grid-layout 响应式网格布局 — 模块：src/lib/_features/use-grid-layout.ts — 关键词：hook, useGridLayout, use-grid-layout, layoutHint, gridTemplateColumns, CSS Grid, 轨道宽度, 响应式
- `40.features/interaction/use-viewport.md` — use-viewport 容器尺寸监听 — 模块：src/lib/_features/use-viewport.ts — 关键词：hook, useViewport, use-viewport, ResizeObserver, 视口尺寸, width, height, resize
- `40.features/interaction/use-large-scrolling.md` — use-large-scrolling 大列表渲染裁剪 — 模块：src/lib/_features/use-large-scrolling.ts — 关键词：hook, useLargeScrolling, use-large-scrolling, 虚拟滚动, 大列表, 视口裁剪, cacheZone, lineMarkers
- `40.features/interaction/use-defer-list.md` — use-defer-list 延迟处理队列 — 模块：src/lib/_features/use-defer-list.ts — 关键词：hook, useDeferList, use-defer-list, defer, 延迟队列, blur, 防抖, change
- `40.features/interaction/use-tree-data.md` — use-tree-data 树型数据组织 — 模块：src/lib/_features/use-tree-data.ts — 关键词：hook, useTreeData, use-tree-data, 树, 树形数据, buildTree, flatten, walkDFS
- `40.features/interaction/use-row-indent.md` — use-row-indent 行缩进与展开图标 — 模块：src/lib/_features/use-row-indent.ts — 关键词：hook, useRowIndent, use-row-indent, RowIndentProps, rowIndents, rowStauts, rowIndicators, getRowIcon
- `40.features/interaction/use-std-list-item.md` — use-std-list-item 列表项标准化 — 模块：src/lib/_features/use-std-list-item.ts — 关键词：hook, useStdListItem, use-std-list-item, toStdItem, StdOptionItem, icon, text, tip
- `40.features/interaction/use-app-bus.md` — use-app-bus 应用级消息总线 — 模块：src/lib/_features/use-app-bus.ts — 关键词：hook, createAppBus, watchAppResize, use-app-bus, TiAppBus, 消息总线, BUS, APP_RESIZE
- `40.features/interaction/use-app-model-binding.md` — use-app-model-binding 应用模型绑定 — 模块：src/lib/_features/use-app-model-binding.ts — 关键词：hook, makeAppModelDataProps, makeAppModelEventListeners, getAppModelListenEvents, use-app-model-binding, AppModelBinding, 模型绑定, v-on

### field · 字段模型

- `40.features/field/field-overview.md` — field 字段集与标准字段 — 模块：src/lib/_features/field/use-obj-fields.ts — 关键词：field, useObjFields, useObjColumns, init_ti_std_fields, init_ti_std_columns, 标准字段, 标准列, FormField
- `40.features/field/use-field-change.md` — use-field-change 字段值变更处理 — 模块：src/lib/_features/field/use-field-change.ts — 关键词：hook, useFieldChange, use-field-change, 字段变更, changeMode, 字段联动, linkFields, 必选校验
- `40.features/field/use-field-com.md` — use-field-com 字段控件选择 — 模块：src/lib/_features/field/use-field-com.ts — 关键词：hook, useFieldCom, use-field-com, 字段控件, comType, comConf, readonlyComType, activatedComType
- `40.features/field/use-field-serializer.md` — use-field-serializer 字段值序列化 — 模块：src/lib/_features/field/use-field-serializer.ts — 关键词：hook, useFieldSerializer, use-field-serializer, prepareFieldValue, serializer, defaultAs, emptyAs, getFieldConvertor
- `40.features/field/use-field-tranformer.md` — use-field-tranformer 字段值反序列化 — 模块：src/lib/_features/field/use-field-tranformer.ts — 关键词：hook, useFieldTransformer, use-field-tranformer, getFieldValue, transformer, 字段读取, getFieldConvertor
- `40.features/field/use-form-field-change.md` — use-form-field-change 表单字段变更处理 — 模块：src/lib/_features/field/use-form-field-change.ts — 关键词：hook, useFormFieldChange, use-form-field-change, buildGridFields, FieldRefer, buildErrorMessageAsHtml, getWatchedFields, 表单校验

### range · 区间输入

- `40.features/range/use-input-range-api.md` — use-input-range-api 区间输入 API — 模块：src/lib/_features/range/use-input-range-api.ts — 关键词：hook, useInputRangeApi, use-input-range-api, 区间, range, RangeInfo, RangeValue, editRange
- `40.features/range/range-overview.md` — range 区间对话框与消息键 — 模块：src/lib/_features/range/open-range-editor.ts — 关键词：range, open_range_editor, get_range_info_msg_key, RangeInfo, RangeInfoMsgKey, 区间对话框, eq ne gtlt gte lte, RangeApiProps

### validate · 校验

- `40.features/validate/use-data-validate.md` — use-data-validate 整行数据校验 — 模块：src/lib/_features/validate/use-data-validate.ts — 关键词：hook, useDataValidate, use-data-validate, validateChange, validateData, ValidateOptions, okAs, minLen
- `40.features/validate/use-field-validate.md` — use-field-validate 校验规则编译 — 模块：src/lib/_features/validate/use-field-validate.ts — 关键词：buildFieldValidator, buildFieldValidatorGroup, addGlobalValidation, getGlobalValidation, removeGlobalValidation, FieldValidation, Match, 字典校验
- `40.features/validate/use-validate-results.md` — use-validate-results 校验结果按行存储 — 模块：src/lib/_features/validate/use-validate-results.ts — 关键词：hook, useValidateResults, use-validate-results, getVarifyResult, hasVarifyError, validateDelta, FieldValidateResult, 按行校验
- `40.features/validate/validate-overview.md` — validate 字段编译与类型 — 模块：src/lib/_features/validate/build-validation.ts — 关键词：validate, DataValidatableField, ValidatableFieldRefer, _build_validatable_field, has_validate_error, FieldValidateResult, 校验类型

## 101.dev 开发规范

- `101.dev/README.md` — 开发者参考手册 — 模块：src/index.ts — 关键词：开发规范, 源码布局, 新增组件, 测试, 构建发布, 文档同步, 弃用组件
- `101.dev/01-source-layout.md` — 仓库源码布局 — 模块：src/index.ts — 关键词：源码布局, 目录结构, src, core, lib, _type, i18n, test
- `101.dev/02-add-component.md` — 新增一个组件 — 模块：src/lib/lib-com-types.ts — 关键词：新增组件, 开发流程, TiComInfo, Props, Emitter, 注册表, exampleProps
- `101.dev/03-testing.md` — Vitest 测试约定 — 模块：src/test/setup.ts — 关键词：测试, vitest, test, core, setup.ts, 断言, yarn test
- `101.dev/04-build-and-release.md` — 构建与发布 — 模块：101.dev — 关键词：构建, build, vite, vue-tsc, tsc, dist, 产物, external
- `101.dev/05-doc-and-deprecation.md` — 文档与弃用规则 — 模块：src/lib/lib-com-types.ts — 关键词：文档同步, SOURCEMAP, INDEX, 弃用, deprecated, TiFilter, 文档规范
