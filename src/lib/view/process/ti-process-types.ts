import { ButtonProps, TextSnippetProps } from '../../../';
import { CommonProps, Vars } from '../../../_type';
import { ProgressBarProps } from '../../tile/all-tiles';

export type ProcessProps = CommonProps & {
  title?: string | TextSnippetProps;
  /**
   * 日志信息行
   */
  logs?: string[];

  /**
   * 进度条配置信息
   */
  progress?: ProgressBarProps;

  /**
   * 指定取消按钮的具体配置
   */
  abort?: string | ButtonProps;

  /**
   * 填充父元素的模式
   */
  fillMode?: 'cover' | 'fit' | 'auto';

  progressPartStyle?: Vars;
  logPartStyle?: Vars;
};
