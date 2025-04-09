import { ComputedRef, InjectionKey } from 'vue';
import {
  AbstractField,
  AspectSize,
  CommonProps,
  CssTextAlign,
  FieldChange,
  FieldComProps,
  FieldStatus,
  FieldStatusIcons,
  FieldStatusInfo,
  FieldValidation,
  FieldValueType,
  GridLayoutProps,
  IconInput,
  InvokePartial,
  SelectValueArm,
  TextContentType,
  ValueChange,
  Vars,
  VisibilityProps,
} from '../../../_type';
import { RoadblockProps } from '../../../lib';
import {
  FieldChangeEmitter,
  FieldChangeProps,
  ReadonlyProps,
  VisibilityFeature,
} from '../../../lib/_features';
//-----------------------------------------------
export type GridFieldsDomReadyInfo = {
  el: HTMLElement;
  main?: HTMLElement;
};
//-----------------------------------------------
export const FIELD_STATUS_KEY: InjectionKey<
  ComputedRef<Map<string, FieldStatusInfo>>
> = Symbol('FIELD_STATUS_KEY');
//-----------------------------------------------
export type TextArm = SelectValueArm<string, any>;
//-----------------------------------------------
export type GridFieldsFeature = {
  strictItems: GridFieldsStrictItem[];
  fieldItems: GridFieldsStrictField[];
  // 动态类选择器
  className?: Vars;
  style?: Vars;
  // 标题 & 提示
  title: string | null | TextArm | ((ctx: FieldDynamicContext) => string);
  titleType: TextContentType;
  tip: string | null;
  tipType: TextContentType;
  tipIcon: IconInput;
};
//-----------------------------------------------
export type GridFieldsEmitter = FieldChangeEmitter & {
  (eventName: 'name-change', payload: ValueChange<string>): void;
  (eventName: 'dom-ready', payload: GridFieldsDomReadyInfo): void;
};
//-----------------------------------------------
export type GridItemEmitter = {
  (eventName: 'name-change', payload: ValueChange<string>): void;
  (eventName: 'value-change', payload: FieldChange): void;
  (eventName: 'field-actived', payload: string): void;
  (eventName: 'field-inactived', payload: string): void;
};
//-----------------------------------------------
export type GridFieldsProps = Omit<
  GridFieldsInput,
  | 'rowStart'
  | 'rowSpan'
  | 'colSpan'
  | 'colStart'
  | 'transformer'
  | 'transArgs'
  | 'transPartial'
  | 'serializer'
  | 'serialArgs'
  | 'serialPartial'
  | 'changeEventName'
  | 'maxTrackCount'
  | 'validation'
> &
  Omit<FieldChangeProps<GridFieldsStrictField>, 'fields'> & {
    // 动态 explain 时的变量
    vars?: Vars;
    // 输入的数据
    data?: Vars;

    /**
     * 空白数据，显示的样式
     */
    emptyRoadblock?: RoadblockProps;

    /**
     * 采用快捷字段定义的字段集合名称
     * @see #use-obj-field
     */
    fieldSetName?: string;

    /**
     *
     * @param fieldItems
     * @returns
     */
    whenGrid?: (grid: GridFieldsFeature) => void;

    /**
     * 得到每个字段的状态
     */
    fieldStatus?: Record<string, FieldStatus>;

    /**
     * 每种状态的图标
     */
    fieldStatusIcons?: FieldStatusIcons;
  };
//-----------------------------------------------
/*
栅格字段组，是一个支持无穷嵌套的字段组合，依靠 CSS Grid 布局。
每一层嵌套支持下面三种类型:

1. `field` : 普通字段：特征是声明了 `name` 属性
2. `group` : 字段组合: 特征是声明了 `fields` 属性
3. `label` : 文本标签: 不符合上面两种特征的就是文本标签

因此一个 `TiGridFields` 可以看作一个 `group`
*/
export type GridFieldsItemRace = 'field' | 'group' | 'label';
//-----------------------------------------------
export type FieldInfo = [
  string,
  (
    | Partial<GridFieldsInput>
    | ((field: GridFieldsInput) => GridFieldsInput | void)
  )
];
//-----------------------------------------------
export type FieldRefer = GridFieldsInput | FieldInfo | string;
//-----------------------------------------------
export type GridFieldsInput = CommonProps &
  Partial<Omit<AbstractField, 'required' | 'validate'>> &
  FieldComProps &
  VisibilityProps &
  GridLayoutProps &
  ReadonlyProps & {
    //------------------------------------
    // 显示
    //------------------------------------
    title?: string | TextArm | ((ctx: FieldDynamicContext) => string);
    titleType?: TextContentType; // 默认 text
    titleIcon?: IconInput;
    titleStyle?: Vars;
    titleAlign?: CssTextAlign;
    titleClass?: any;
    titleTextStyle?: Vars;
    tip?: string;
    tipType?: TextContentType; // 默认 text
    tipBy?: FieldComProps;
    tipStyle?: Vars;
    tipAlign?: CssTextAlign;
    tipClass?: any;
    tipTextStyle?: Vars;

    // 仅仅当 tipMode = 'xxx-prefix|suffix-icon' 时生效
    // 默认为 'zmdi-help-outline'
    tipIcon?: IconInput;

    // 仅仅当 `race=field` 时有效
    fieldTitleBy?: FieldComProps;
    fieldTitleAlign?: CssTextAlign;

    // 普通字段的布局模式
    // 仅仅当 `race=field` 时有效
    fieldLayoutMode?: GridFieldLayoutMode;
    fieldValueStyle?: Vars;
    //------------------------------------
    // 约束
    //------------------------------------
    // 字段是否必选，是一个 `TiMatch` 匹配 `FormContext`
    required?: any;

    /**
     * 检查字段值的合法性
     */
    validation?: FieldValidation | FieldValidation[];

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

    rowStart?: number; // 指定格子的行起始轨道，比 style.gridRowStart 优先
    rowSpan?: number; // 指定格子的行跨度，比 style.gridRowEnd 优先
    colStart?: number; // 指定格子的列起始轨道，比 style.gridColumnStart 优先
    colSpan?: number; // 指定格子的列跨度，比 style.gridColumnEnd 优先
    //------------------------------------
    // 字段组专有属性
    //------------------------------------
    fields?: FieldRefer[];

    // 这个属性从顶层一直可以继承下去
    groupAspect?: GroupAspect;

    bodyPartStyle?: Vars;
    bodyPartDense?: boolean;
    bodyPartFontSize?: AspectSize;
    // 默认为 'm'
    bodyPartGap?: AspectSize;

    defaultFieldTitleBy?: FieldComProps;
    defaultFieldTipBy?: FieldComProps;
    defaultFieldType?: FieldValueType;
    defaultFieldTypeTransformOptions?: Vars;
    defaultFieldTypeSerializeOptions?: Vars;

    defaultComType?: string;
    defaultComConf?: Vars;
  };
//-----------------------------------------------
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
//-----------------------------------------------
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
//-----------------------------------------------
export type FieldDynamicContext = {
  data: Vars;
  vars: Vars;
};
/**
 * 编译后的严格属性字段
 */
export type GridFieldsStrictAbstractItem = FieldComProps &
  ReadonlyProps &
  VisibilityFeature & {
    data: Vars;
    uniqKey: string;
    index: number;
    race: GridFieldsItemRace;
    title?: TextArm | ((ctx: FieldDynamicContext) => string);
    titleIcon?: IconInput;
    titleType: TextContentType; // 默认 text
    titleStyle?: Vars;
    titleTextStyle?: Vars;
    titleAlign?: CssTextAlign;
    titleClass?: any;
    tip?: TextArm;
    tipType: TextContentType; // 默认 text
    tipBy?: FieldComProps;
    tipStyle?: Vars;
    tipAlign?: CssTextAlign;
    tipClass?: any;
    className?: Vars;
    style?: Vars;

    // 父块传递下来的，本项目最大可以跨越的轨道数
    maxTrackCount?: number;

    rowStart?: number; // 指定格子的行起始轨道，比 style.gridRowStart 优先
    rowSpan?: number; // 指定格子的行跨度，比 style.gridRowEnd 优先
    colStart?: number; // 指定格子的列起始轨道，比 style.gridColumnStart 优先
    colSpan?: number; // 指定格子的列跨度，比 style.gridColumnEnd 优先
  };
//-----------------------------------------------
export type GridFieldsStrictGroup = GridFieldsStrictAbstractItem &
  GridLayoutProps & {
    race: 'group';
    fields: GridFieldsStrictItem[];
    groupAspect?: GroupAspect;

    fieldTitleAlign?: CssTextAlign;

    // 用来传递给下属字段
    maxFieldNameWidth?: number | string;
    fieldLayoutMode?: GridFieldLayoutMode;

    bodyPartStyle?: Vars;
    bodyPartDense?: boolean;
    bodyPartFontSize?: AspectSize;
    bodyPartGap?: AspectSize;

    defaultFieldTitleBy?: FieldComProps;
    defaultFieldTipBy?: FieldComProps;
    defaultFieldType?: FieldValueType;
    defaultFieldTypeTransformOptions?: Vars;
    defaultFieldTypeSerializeOptions?: Vars;

    defaultComType?: string;
    defaultComConf?: Vars;
  };
//-----------------------------------------------
export type GridFieldsStrictField = GridFieldsStrictAbstractItem &
  AbstractField & {
    race: 'field';

    checkEquals: boolean;
    maxFieldNameWidth?: number | string;
    fieldLayoutMode: GridFieldLayoutMode;

    fieldTitleBy?: FieldComProps;
    titleTextStyle?: Vars;
    fieldValueStyle?: Vars;

    tipTextStyle?: Vars;
    tipIcon: IconInput;
  };
//-----------------------------------------------
export type GridFieldsStrictLabel = GridFieldsStrictAbstractItem & {
  race: 'label';
  titleTextStyle?: Vars;
  tipIcon?: IconInput;
  tipTextStyle?: Vars;
};
//-----------------------------------------------
export type GridFieldsStrictItem =
  | GridFieldsStrictGroup
  | GridFieldsStrictField
  | GridFieldsStrictLabel;
