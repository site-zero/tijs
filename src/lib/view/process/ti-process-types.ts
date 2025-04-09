import { ButtonProps, ListProps, TextSnippetProps } from '../../../';
import { CommonProps, Vars } from '../../../_type';
import { ProgressBarProps } from '../../tile/all-tiles';

export type ProcessProps = CommonProps & {
  title?: string | TextSnippetProps;

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

  /**
   * 日志信息行信息
   * 如果定义了这个属性（通常是响应式的数据）控件会在底部
   * 渲染一个日志输入列表
   */
  logs?: string[];

  /**
   * 状态列表
   * 如果定义了这个属性控件会在进度条下面展示一个列表控件
   * 调用者可控制列表控件的内容以便进度项的状态信息
   */
  listData?: Vars[];

  /**
   * 进度列表项目的配置信息
   */
  listConf?: ListProps;

  /**
   * 这个属性改变，可以自动将 list 滚动到该行所在位置，
   * `0 Base`
   */
  listCurrentRowIndex?: number;

  //-----------------------------------------------------
  // 显示部分
  //-----------------------------------------------------
  progressPartStyle?: Vars;
  listPartStyle?: Vars;
  logPartStyle?: Vars;
};
