import { ColorizedName, OptionsInput } from '../../';
import { CommonProps, IconInput } from '../../../core';

export type SorterExportApi = {
  onSetup: () => Promise<SorterValue | undefined>;
};

/**
 * 1: ASC
 * -1: DESC
 */
export type SorterValue = Record<string, number>;

export type SorterProps = CommonProps & {
  value?: SorterValue;
  options?: OptionsInput;

  colorType?: ColorizedName;

  sorterIcons?: {
    ASC: IconInput;
    DESC: IconInput;
  };

  /**
   * 显示配置按钮
   */
  canSetup?: boolean;

  /**
   * @param api 本控件导出的可被外部使用的方法
   */
  exportApi?: (api: SorterExportApi) => void;
};
