import { FieldName, FieldValueType } from 'src/lib/_top';
import {
  ComRef,
  CommonProps,
  CssGridItem,
  CssGridLayout,
  IconInput,
  InvokePartial,
  Vars,
  VisibilityProps,
} from '../../../core';
import { FieldComProps, ReadonlyProps } from '../../../lib/_features';
/*
栅格字段组，是一个支持无穷嵌套的字段组合，依靠 CSS Grid 布局。
每一层嵌套支持下面三种类型:

1. `field` : 普通字段：特征是声明了 `name` 属性
2. `group` : 字段组合: 特征是声明了 `fields` 属性
3. `label` : 文本标签: 不符合上面两种特征的就是文本标签

因此一个 `TiGridFields` 可以看作一个 `group`
*/
export type GridFieldsItemRace = 'field' | 'group' | 'label';
export type GridFieldsProps = CommonProps &
  Partial<AbstractField> &
  FieldComProps &
  VisibilityProps &
  CssGridItem &
  ReadonlyProps & {
    //------------------------------------
    // 显示
    //------------------------------------
    title?: string;
    titleType?: TextContentType; // 默认 text
    tip?: string;
    tipType?: TextContentType; // 默认 text
    // Tip 的显示模式
    tipMode?: GridFieldTipMode;
    // 仅仅当 tipMode = 'xxx-prefix|suffix-icon' 时生效
    // 默认为 'zmdi-help-outline'
    tipIcon?: IconInput;

    // 直接指定名称部分的显示控件，默认的用纯DOM渲染文字
    // 如果控件有 change 事件，则会 emit('name-change')
    nameBy?: ComRef;
    //------------------------------------
    // 约束
    //------------------------------------
    // 字段是否必选，是一个 `TiMatch` 匹配 `FormContext`
    required?: any;
    // 修改前是否检查相同，默认为true
    checkEquals?: boolean;

    //------------------------------------
    // 布局样式
    //------------------------------------
    // 自定义这个是字段最外层的包裹元素的样式
    // 一个字段的 DOM 有下面的结构
    //
    // `div.grid-field as-group`     <-- 最外层包裹元素
    //  |-- `div.field-part as-name` <-- 字段名
    //  |-- `div.field-part as-value`<-- 字段值（控件）
    //  |-- `div.field-part as-name` <-- 字段名
    //
    // 当这个属性被作用到 group 时， group.layout 更加优先
    style?: Vars;
    // 限制一个字段名称最大宽度
    maxFieldNameWidth?: number;

    // 指明一个字段组是怎么布局的
    // > 仅当 `group` 有效
    layout?: CssGridLayout;
    // 指定 layout 过于麻烦，并且不能自适应，那么可以通过这个属性进行定制
    // > 仅当 `group` 有效
    // > 如果已经指定了 `layout.gridTemplateColumns` 则会无视
    layoutHint?: GridLayoutHint;
    // 默认的，根据 layoutHint 计算出来的轨道数，每个轨道都是 1fr ，
    // 这里可以允许你根据轨道下标(0 base)指定每个轨道具体的宽度
    // > 仅当 `group` 有效
    // > 如果已经指定了 `layout.gridTemplateColumns` 则会无视
    layoutGridTracks?: string[] | ((trackIndex: number) => string);

    //------------------------------------
    // 字段组专有属性
    //------------------------------------
    fields?: GridFieldsProps[];
  };

/**
 * 字段的提示信息有下面这些模式：
 *
 * - bottom : 提示信息出现在字段底部
 * - wrap : 提示信息出现在字段控件下方另起一行
 * - name-prefix-icon : 提示信息缩成一个 icon 并附着在名称前面
 * - name-suffix-icon : 提示信息缩成一个 icon 并附着在名称后面
 * - value-prefix-icon : 提示信息缩成一个 icon 并附着在值件前面
 * - value-suffix-icon : 提示信息缩成一个 icon 并附着在值件后面
 */
export type GridFieldTipMode =
  | 'bottom'
  | 'wrap'
  | 'name-prefix-icon'
  | 'name-suffix-icon'
  | 'value-prefix-icon'
  | 'value-suffix-icon';

/**
 * 描述了一个条件: [3, 500] 相当于尺寸大于500，就是 3
 *
 * 如果就是一个数字，则表示固定的结果
 */
type GridLayoutHintItem = number | [number, number];

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

export type TextContentType = 'html' | 'text';

/**
 * 抽象字段
 * TODO 以后提到全局，给 Table Cell 也用上
 */
export type AbstractField = {
  /**
   * 字段唯一键，如果未定义，则会根据 name 来生成
   *
   * @see getFieldUniqKey
   */
  uniqKey?: string;
  /**
   * 字段名称， 如果是 `string[]` 则会从数据中提取子对象
   * `string` 时，支持 `.` 分割的属性路径
   */
  name: FieldName;
  /**
   * 字段类型
   *
   * @default `String`
   */
  type?: FieldValueType;
  /**
   * 字段默认值
   */
  defaultAs?: any;

  /**
   * 当字段为空时的默认值
   */
  emptyAs?: any;

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
};

export type GridFieldsStrictAbstractItem = {
  uniqKey: string;
  index: number;
  race: GridFieldsItemRace;
  title: null | string;
  titleType?: TextContentType; // 默认 text
  tip: null | string;
  tipType: TextContentType; // 默认 text
  // Tip 的显示模式
  tipMode: null | GridFieldTipMode;
  // 仅仅当 tipMode = 'xxx-prefix|suffix-icon' 时生效
  // 默认为 'zmdi-help-outline'
  tipIcon: null | IconInput;
  className?: Vars;
  style?: Vars;
};
export type GridFieldsStrictGroup = GridFieldsStrictAbstractItem & {
  race: 'group';
  layout: CssGridLayout;
};
export type GridFieldsStrictField = GridFieldsStrictAbstractItem & {
  race: 'field';
  name: FieldName;
  type: FieldValueType;
  defaultAs: any;
  emptyAs: any;
  required: (val: any, data: Vars, name: FieldName) => any;
  checkEquals: boolean;
  transformer?: (val: any, data: Vars, name: FieldName) => any;
  serializer?: (val: any, data: Vars, name: FieldName) => any;
};
export type GridFieldsStrictLabel = GridFieldsStrictAbstractItem & {
  race: 'label';
};

export type GridFieldsStrictItem =
  | GridFieldsStrictGroup
  | GridFieldsStrictField
  | GridFieldsStrictLabel;

export function isGridFieldStrictsGroup(
  item: GridFieldsStrictItem
): item is GridFieldsStrictGroup {
  return item && 'group' == item.race;
}

export function isGridFieldStrictsLabel(
  item: GridFieldsStrictItem
): item is GridFieldsStrictLabel {
  return item && 'label' == item.race;
}

export function isGridFieldsStrictField(
  item: GridFieldsStrictItem
): item is GridFieldsStrictField {
  return item && 'field' == item.race;
}
