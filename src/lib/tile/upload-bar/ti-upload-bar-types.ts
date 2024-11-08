import {
  ActionBarProps,
  ImageProps,
  ProgressBarProps,
  TextSnippetProps,
} from '../../';
import {
  ActionBarItemInfo,
  AspectSize,
  CommonProps,
  CssAlignment,
  LogicType,
  Vars,
} from '../../../_type';

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
  preview?: ImageProps;
  progress?: ProgressBarProps;
  text?: string | TextSnippetProps;
  tip?: string;

  //-----------------------------------------------------
  // Behaviors
  //-----------------------------------------------------
  uploadButton?: ActionBarItemInfo | boolean;
  clearButton?: ActionBarItemInfo | boolean;
  actions?: ActionBarProps;
  placeholder?: string;
  //-----------------------------------------------------
  // Aspect
  //-----------------------------------------------------
  type?: LogicType;
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
