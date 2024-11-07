import { ActionBarProps, ProgressBarProps, TextSnippetProps } from '../../';
import { AspectSize, CommonProps, CssAlignment, Vars } from '../../../_type';
import { IconProps } from '../icon/icon-props';

/**
 * 一个缩略图的结构承载了下面结构的 DOM:
 *
 * ```
 * +--+----------------+
 * |IC| Info Text      | [Actions]
 * +--+----------------+
 * ```
 */
export type UploadBarProps = CommonProps & {
  //-----------------------------------------------------
  // Data
  //-----------------------------------------------------
  icon?: IconProps;
  progress?: ProgressBarProps;
  text?: string | TextSnippetProps;

  actions?: ActionBarProps;

  //-----------------------------------------------------
  // Aspect
  //-----------------------------------------------------
  width?: string | number;
  height?: string | number;
  style?: Vars;
  //-----------------------------------------------------
  conStyle?: Vars;
  conClass?: any;
  //-----------------------------------------------------
  textSize?: AspectSize;
  textPadding?: AspectSize;
  textAlign?: CssAlignment;
  boxRadius?: AspectSize;
  //-----------------------------------------------------
};
