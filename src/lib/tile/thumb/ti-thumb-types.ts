import { ImageProps, ProgressBarProps, TextSnippetProps } from '../../';
import {
  AspectSize,
  CommonProps,
  CssAlignment,
  IconInput,
  LogicType,
  Vars,
} from '../../../_type';

export type ThumbIndicatorPosition =
  | 'left-top'
  | 'right-top'
  | 'bottom-left'
  | 'bottom-right'
  | 'center';

export type ThumbIndicator = {
  position: ThumbIndicatorPosition;
  type?: LogicType;
  className?: string;
  style?: Vars;
  icon?: IconInput;
  text?: string | TextSnippetProps;
  tip?: string | TextSnippetProps;
};

/**
 * 一个缩略图的结构承载了下面结构的 DOM:
 *
 * ```
 * +---------------+
 * |               |
 * |    Preview    |
 * |               |
 * +---------------+
 * |     Text      |
 * +---------------+
 * |     ?More     |
 * +---------------+
 * ```
 */
export type ThumbProps = CommonProps & {
  preview?: ImageProps;
  progress?: ProgressBarProps;
  text?: string | TextSnippetProps;
  more?: string | TextSnippetProps;
  indicators?: ThumbIndicator[];

  width?: string | number;
  height?: string | number;
  style?: Vars;

  textSize?: AspectSize;
  textPadding?: AspectSize;
  textAlign?: CssAlignment;

  moreSize?: AspectSize;
  morePadding?: AspectSize;
  moreAlign?: CssAlignment;

  flexGrow?: 'text' | 'more' | 'none';
};
