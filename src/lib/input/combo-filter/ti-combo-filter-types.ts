import {
  FilterProps,
  FilterValue,
  KeepInfo,
  SorterProps,
  SorterValue,
} from '../../';
import { ActionBarItem, CommonProps } from '../../../core';

export type ComboFilterValue = {
  filter?: FilterValue;
  sorter?: SorterValue;
};

export type ComboFilterEmitter = {
  (event: 'change', payload: ComboFilterValue): void;
  (event: 'search' | 'reset'): void;
};

export type ComboFilterProps = CommonProps & {
  /**
   * 输入的值
   */
  value?: ComboFilterValue;

  /**
   * 布局模式
   * 
   * - comfy : 默认
   * - online : 尽量保持一行
   */
  layout?:'oneline'|'comfy'

  /**
   * 更多自定义命令
   */
  moreActions?: ActionBarItem[];

  /**
   * 保持Filter的本地配置
   */
  keepMajor?: KeepInfo;

  /**
   * 对于 Filter 的设置
   */
  filterConfig?: Omit<FilterProps, 'value' | 'moreActions'>;

  sorterConfig?: Omit<SorterProps, 'value' | 'exportApi'>;
};
