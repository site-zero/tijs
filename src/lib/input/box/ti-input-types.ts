import {
  ListProps,
  ValueBoxProps,
  ValueBoxState,
  ValueInputTidyMode,
} from '../../';
import { Vars } from '../../../core';

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
};

//--------------------------------------------------
//
//              提示框相关属性
//
//--------------------------------------------------
export type TipBoxProps = {
  // 一个过滤器 AutoMatch，用来预先过滤字典项
  optionFilter?: any;

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
  tipList?: Omit<ListProps, 'data'>;

  /**
   * 展出提示框宽度，如果不声明，则采用与 box 相同的宽度
   */
  tipListWidth?: string;
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
