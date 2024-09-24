import { TextSnippetProps } from '../../../';
import { CommonProps } from '../../../_type';
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
};
