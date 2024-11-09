import {
  ActionBarEmitter,
  ActionBarProps,
  ImageProps,
  ProgressBarProps,
  TextSnippetProps,
} from '../../';
import {
  ActionBarItem,
  ActionBarItemInfo,
  AspectSize,
  CommonProps,
  CssAlignment,
  LogicType,
  Vars,
} from '../../../_type';

export type UploadBarEmitter = ActionBarEmitter & {
  (event: 'upload', payload: File): void;
  (event: 'clear'): void;
};

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
  /**
   * 默认的，如果不指定 clearButton，那么控件默认会开启
   * 前缀清除的属性
   *
   * 有些时候，用户会在 actions 里指定 clear 命令，因为
   * 他想任意指定按钮的排布，这时配合这个属性才能禁止掉
   * 前缀清除的特性。又或者，用户不想提供删除的按钮也可以
   * 使用这个属性
   * */
  prefixForClean?: 'no' | 'yes';
  actions?: ActionBarItem[];
  actionBar?: Omit<ActionBarProps, 'items'>;
  placeholder?: string;
  //-----------------------------------------------------
  // Aspect
  //-----------------------------------------------------
  type?: LogicType;
  nilValue?: boolean;
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
