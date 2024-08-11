import {
  ListProps,
  ValueBoxProps,
  ValueBoxState,
  ValueInputTidyMode,
} from '../../';
import { CssAlignment, Vars } from '../../../_type';

//--------------------------------------------------
export type InputBoxState = ValueBoxState<any> & {
  // 为了保证 updateTipList 不被重入，如果10ms 内的重入将被无视
  // 每次有效调用 updateTimeList 都会更新这个值
  lastUpdateAMS: number;

  // 上次请求的退出控制器
  lastAbort?: AbortController;
};

//--------------------------------------------------
export type InputBoxProps = ValueBoxProps<any> & TipBoxProps & InputBoxAspect;
//--------------------------------------------------
export type InputBoxAspect = {
  hideBorder?: boolean;
  boxFocused?: boolean;
  width?: string;
  style?: Vars;
  /**
   * 为 <div class="part-value"><input></div> 元素直接指定的样式
   */
  valuePartStyle?: Vars;

  /**
   * 值的排列位置： 'left' | 'right' | 'center'
   */
  valueInputAlign?: CssAlignment;

  /**
   * 为 <input> 元素直接指定的样式
   */
  valueInputStyle?: Vars;
};
//--------------------------------------------------
export type OptionPredicateMaker = (vars: Vars) => OptionPredicater;
export type OptionPredicater = (item: Record<string, any>) => boolean;
//--------------------------------------------------
//
//              提示框相关属性
//
//--------------------------------------------------
export type QuickTipFormat = 'T' | 'VT' | 'TV' | 'VTT' | 'TT';
export type TipListProps = Omit<ListProps, 'data'>;
export type TipBoxProps = {
  // 动态渲染的上下文
  boxVars?: Vars;
  // 一个过滤器 AutoMatch，用来预先过滤字典项
  // 第二个参数是解析上下文，来自 box 的 vars 字段
  // 如果控件在表单里，自然采用表单字段的动态上下文
  optionFilter?:
    | Record<string, any>
    | Record<string, any>[]
    | OptionPredicateMaker;

  /**
   * 对于 droplist 设置为 false，则关闭的时候不检查之，默认为 true
   */
  checkValueWhenClose?: boolean;

  // 提示框显示时机
  tipShowTime?: TipBoxShowTime;

  // 查询提示信息的时候，采用输入的值
  // 默认 false
  tipUseHint?: boolean;

  // 如果查询提示信息，输入提示值，是否需要先经过值的整理器
  // 默认 ['main']
  tipTidyBy?: ValueInputTidyMode[];

  /**
   * 提示列表的配置
   */
  tipList?: TipListProps;

  /**
   * 对于提示列表的快速格式模式，
   *
   * - `T`   : `<em>${text}</em>`
   * - `VT`  : `<code>${value}</code><em>${text}</em>`
   * - `TV`  : `<em>${text}</em><code>${value}</code>`
   * - `TT`  : `<em>${text}</em><span>${tip}</span>`
   * - `VTT` : `<code>${value}</code><em>${text}</em><span>${tip}</span>`
   *
   * 在没有声明  tipList.textFormat 的前提下，它可以为其快速设置格式化方式
   */
  tipFormat?: QuickTipFormat;

  /**
   * 默认的，展示提示框的时候，会将对象根据配置转换为标准选项
   * 开启这个选项后，将会维持原有对象。
   * 这样你能得到更多的信息可以最大程度的定制列表的显示样式。
   * 但是你可能需要做更多的配置，才能让列表显示正常。
   */
  tipItemKeepRaw?: boolean;

  /**
   * 展出提示框宽度，如果不声明，则采用与 box 相同的宽度
   */
  tipListWidth?: string;

  /**
   * 展出提示框最小宽度，如果不声明，则采用与 box 相同的宽度
   */
  tipListMinWidth?: string;
};

/**
 * 提示框的显示时机
 *
 * - focus : 聚焦就显示
 * - keyin : 按任何键就显示
 * - input : 只有实质上输入内容了，才显示
 */
export type TipBoxShowTime = 'focus' | 'keyin' | 'input';

// /**
//  * 提示框的隐藏时机
//  *
//  * - blur : 失焦才隐藏
//  * - changed : 属性的值改变了才隐藏
//  * - emit : 通知改动时才隐藏
//  */
// export type TipBoxHideTime = 'blur' | 'changed' | 'emit';
