import { ValueBoxProps } from '../../../lib/_features';

export type InputBoxProps = ValueBoxProps<any> &
  TipBoxProps & {
    hideBorder?: boolean;
    boxFocused?: boolean;
  };

//--------------------------------------------------
//
//              提示框相关属性
//
//--------------------------------------------------
export type TipBoxProps = {
  // 提示框显示时机
  tipShowTime?: TipBoxShowTime;

  // 提示框显示时机
  tipHideTime?: TipBoxHideTime;
};

/**
 * 提示框的显示时机
 *
 * - focus : 聚焦就显示
 * - keyin : 按任何键就显示
 * - input : 只有实质上输入内容了，才显示
 */
export type TipBoxShowTime = 'focus' | 'keyin' | 'input';

/**
 * 提示框的隐藏时机
 *
 * - blur : 失焦才隐藏
 * - changed : 属性的值改变了才隐藏
 * - emit : 通知改动时才隐藏
 */
export type TipBoxHideTime = 'blur' | 'changed' | 'emit';

export type TipBoxState = {
  // 当前用户按下的键
  keyboard?: string;

  // 检测到用户输入的值
  input?: string;

  // 聚焦状态， false 表示失焦状态
  focused: boolean;
};
