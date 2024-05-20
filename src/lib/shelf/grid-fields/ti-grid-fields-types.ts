import {
  CommonProps,
  CssGridLayout,
  CssTextAlign,
  FieldValueChange,
  IconInput,
  InvokePartial,
  TextContentType,
  ValueChange,
  Vars,
  VisibilityProps,
} from '../../../core';
import {
  FieldComProps,
  ReadonlyProps,
  VisibilityFeature,
} from '../../../lib/_features';
import { AbstractField, getFieldUniqKey } from '../../_top';

export type GridFieldsDomReadyInfo = {
  el: HTMLElement;
  main: HTMLElement;
};

export type GridFieldsFeature = {
  strictItems: GridFieldsStrictItem[];
  fieldItems: GridFieldsStrictField[];
  // 动态类选择器
  className?: Vars;
  style?: Vars;
  // 标题 & 提示
  title: string | null;
  titleType: TextContentType;
  tip: string | null;
  tipType: TextContentType;
  tipIcon: IconInput;
};

export type GridFieldsEmitter = {
  (evetName: 'name-change', payload: ValueChange<string>): void;
  (evetName: 'value-change', payload: FieldValueChange): void;
  (evetName: 'dom-ready', payload: GridFieldsDomReadyInfo): void;
};

export type AspectSize = 't' | 's' | 'm' | 'b' | 'h';

export type GridFieldsProps = Omit<
  GridFieldsInput,
  | 'rowSpan'
  | 'colSpan'
  | 'transformer'
  | 'transArgs'
  | 'transPartial'
  | 'serializer'
  | 'serialArgs'
  | 'serialPartial'
  | 'changeEventName'
  | 'maxTrackCount'
> & {
  // 动态 explain 时的变量
  vars?: Vars;
  // 输入的数据
  data?: Vars;

  /**
   *
   * @param fieldItems
   * @returns
   */
  whenGrid?: (grid: GridFieldsFeature) => void;
};

/*
栅格字段组，是一个支持无穷嵌套的字段组合，依靠 CSS Grid 布局。
每一层嵌套支持下面三种类型:

1. `field` : 普通字段：特征是声明了 `name` 属性
2. `group` : 字段组合: 特征是声明了 `fields` 属性
3. `label` : 文本标签: 不符合上面两种特征的就是文本标签

因此一个 `TiGridFields` 可以看作一个 `group`
*/
export type GridFieldsItemRace = 'field' | 'group' | 'label';
export type GridFieldsInput = CommonProps &
  Partial<AbstractField> &
  FieldComProps &
  VisibilityProps &
  GridFieldsItemLayoutProps &
  ReadonlyProps & {
    //------------------------------------
    // 显示
    //------------------------------------
    title?: string;
    titleType?: TextContentType; // 默认 text
    titleIcon?: IconInput;
    titleStyle?: Vars;
    titleAlign?: CssTextAlign;
    tip?: string;
    tipType?: TextContentType; // 默认 text
    tipBy?: FieldComProps;
    tipStyle?: Vars;
    tipAlign?: CssTextAlign;

    // 仅仅当 tipMode = 'xxx-prefix|suffix-icon' 时生效
    // 默认为 'zmdi-help-outline'
    tipIcon?: IconInput;

    // 仅仅当 `race=field` 时有效
    fieldTitleBy?: FieldComProps;

    // 普通字段的布局模式
    // 仅仅当 `race=field` 时有效
    fieldLayoutMode?: GridFieldLayoutMode;
    fieldTitleStyle?: Vars;
    fieldValueStyle?: Vars;
    fieldTipStyle?: Vars;
    //------------------------------------
    // 约束
    //------------------------------------
    /**
     * 字段唯一键，如果未定义，则会根据 name 来生成
     *
     * @see getFieldUniqKey
     */
    uniqKey?: string;
    // 字段是否必选，是一个 `TiMatch` 匹配 `FormContext`
    required?: any;

    // 修改前是否检查相同，默认为true
    checkEquals?: boolean;
    // 读取字段值后，经过一个定制转换，再传递给字段
    // data[name] ===(transformer) ==> FieldCom
    transformer?: string | Function;
    transArgs?: any[];
    transPartial?: InvokePartial;
    // 字段值修改后，经过一个定制转换，再向外抛出消息
    // FieldCom.change ===(serializer) ==> emit('change')
    serializer?: string | Function;
    serialArgs?: any[];
    serialPartial?: InvokePartial;

    //------------------------------------
    // 布局样式
    //------------------------------------
    // 单元格项目的自定义样式，当这个属性被作用到 group 时， group.layout 更加优先
    style?: Vars;
    // 限制一个字段名称最大宽度
    maxFieldNameWidth?: number | string;

    rowSpan?: number; // 指定格子的行跨度，比 style.gridRowEnd 优先
    colSpan?: number; // 指定格子的列跨度，比 style.gridColumnEnd 优先
    //------------------------------------
    // 字段组专有属性
    //------------------------------------
    fields?: GridFieldsInput[];

    // 这个属性从顶层一直可以继承下去
    groupAspect?: GroupAspect;

    bodyPartStyle?: Vars;
    bodyPartDense?: boolean;
    bodyPartFontSize?: AspectSize;
    // 默认为 'm'
    bodyPartGap?: AspectSize;

    defaultFieldTitleBy?: FieldComProps;
    defaultFieldTipBy?: FieldComProps;

    defaultComType?: string;
    defaultComConf?: Vars;
  };

/*
  下面定义了几种组的显示模式：

  1. <legend> 默认
        
      +--[ Group Title ]------------+
      |                             |
      |                             |
  
  2. <bottom-line>
        
       Group Title
      ===============================
      |                             |
      |                             |
  
  3. <bar>
    
      ++----------------------------+
      || Group Title ]              |
      ++----------------------------+
      |                             |
      |                             |
  
  
  */
export type GroupAspect = 'legend' | 'bottom-line' | 'bar';

/**
 * 一个普通字段的 DOM 有下面的结构:
 * ```
 * `div.grid-field as-group`     <-- 最外层包裹元素
 *  |-- `div.field-part as-name` <-- 字段名
 *  |-- `div.field-part as-value`<-- 字段值（控件）
 *  |-- `div.field-part as-tip` <-- 提示信息
 * ```
 * 有下面这些模式：
 *
 * ```
 * h-wrap   : 左右布局，提示在底部，与值等宽
 * h-bottom : 左右布局，提示在底部单独一整行
 * v-wrap   : 上下布局，提示在底部
 * h-title-icon-prefix : 左右布局，提示作为图标，作为名称前缀
 * h-title-icon-suffix : 左右布局，提示作为图标，作为名称后缀
 * h-value-icon-prefix : 左右布局，提示作为图标，作为值前缀
 * h-value-icon-suffix : 左右布局，提示作为图标，作为值后缀
 * v-title-icon-prefix : 上下布局，提示作为图标，作为名称前缀
 * v-title-icon-suffix : 上下布局，提示作为图标，作为名称后缀
 * v-value-icon-prefix : 上下布局，提示作为图标，作为值前缀
 * v-value-icon-suffix : 上下布局，提示作为图标，作为值后缀
 * ```
 */
export type GridFieldLayoutMode =
  | 'h-wrap'
  | 'h-bottom'
  | 'v-wrap'
  | 'h-title-icon-prefix'
  | 'h-title-icon-suffix'
  | 'h-value-icon-prefix'
  | 'h-value-icon-suffix'
  | 'v-title-icon-prefix'
  | 'v-title-icon-suffix'
  | 'v-value-icon-prefix'
  | 'v-value-icon-suffix';

/**
 * 根据当前的视口宽度，得到轨道数量
 */
export type GridLayoutTrackGetter = (width: number) => number;

/**
 * 描述了一个条件: [3, 500] 相当于尺寸大于500，就是 3
 *
 * 如果就是一个数字，则表示固定的结果
 */
export type GridLayoutHintItem = number | [number, number];

/**
 * 可以支持三种形式的值来描述一个维度的轨道布局
 *
 * ### String
 *
 * 如果传入的是字符串，则必须可以被 JSON 解析为 GridHintItem[]
 * 否则会发生不可预知的错误
 *
 * ### Number
 *
 * 指定了轨道数量
 *
 * ### `AutoGridHintItem[]`
 *
 * 根据本维度尺寸自动计算
 *
 */
export type GridLayoutHint = string | number | GridLayoutHintItem[];

export type GridFieldsItemLayoutProps = {
  // 指明一个字段组是怎么布局的
  // > 仅当 `group` 有效
  layout?: CssGridLayout;
  // 指定 layout 过于麻烦，并且不能自适应，那么可以通过这个属性进行定制
  // 它可以根据当前的视口宽度自动决定轨道数量
  // > 仅当 `group` 有效
  // > 如果已经指定了 `layout.gridTemplateColumns` 则会无视
  layoutHint?: GridLayoutHint;
  // 默认的，根据 layoutHint 计算出来的轨道数，每个轨道都是 1fr ，
  // 这里可以允许你根据轨道下标(0 base)指定每个轨道具体的宽度
  // > 仅当 `group` 有效
  // > 如果已经指定了 `layout.gridTemplateColumns` 则会无视
  layoutGridTracks?: string[] | ((trackIndex: number) => string);
};

export type GridFieldsStrictAbstractItem = FieldComProps &
  ReadonlyProps &
  VisibilityFeature & {
    data: Vars;
    uniqKey: string;
    index: number;
    race: GridFieldsItemRace;
    title: null | string;
    titleIcon?: IconInput;
    titleType: TextContentType; // 默认 text
    titleStyle?: Vars;
    titleAlign?: CssTextAlign;
    tip: null | string;
    tipType: TextContentType; // 默认 text
    tipBy?: FieldComProps;
    tipStyle?: Vars;
    tipAlign?: CssTextAlign;
    className?: Vars;
    style?: Vars;

    // 父块传递下来的，本项目最大可以跨越的轨道数
    maxTrackCount?: number;
    rowSpan?: number; // 指定格子的行跨度，比 style.gridRowEnd 优先
    colSpan?: number; // 指定格子的列跨度，比 style.gridColumnEnd 优先
  };
export type GridFieldsStrictGroup = GridFieldsStrictAbstractItem &
  GridFieldsItemLayoutProps & {
    race: 'group';
    fields: GridFieldsStrictItem[];
    groupAspect?: GroupAspect;

    // 用来传递给下属字段
    maxFieldNameWidth?: number | string;
    fieldLayoutMode?: GridFieldLayoutMode;

    bodyPartStyle?: Vars;
    bodyPartDense?: boolean;
    bodyPartFontSize?: AspectSize;
    bodyPartGap?: AspectSize;

    defaultFieldTitleBy?: FieldComProps;
    defaultFieldTipBy?: FieldComProps;

    defaultComType?: string;
    defaultComConf?: Vars;
  };
export type GridFieldsStrictField = GridFieldsStrictAbstractItem &
  AbstractField & {
    race: 'field';

    checkEquals: boolean;
    maxFieldNameWidth?: number | string;
    fieldLayoutMode: GridFieldLayoutMode;

    fieldTitleBy?: FieldComProps;
    fieldTitleStyle?: Vars;
    fieldValueStyle?: Vars;

    fieldTipStyle?: Vars;
    tipIcon: IconInput;
  };
export type GridFieldsStrictLabel = GridFieldsStrictAbstractItem & {
  race: 'label';
};

export type GridFieldsStrictItem =
  | GridFieldsStrictGroup
  | GridFieldsStrictField
  | GridFieldsStrictLabel;
