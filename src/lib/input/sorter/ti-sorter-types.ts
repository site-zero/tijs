import { OptionsInput } from '../../';
import { CommonProps, IconInput, LogicType } from '../../../_type';

export type SorterExportApi = {
  onSetup: () => Promise<void>;
};

/**
 * 1: ASC
 * -1: DESC
 */
export type SorterValue = Record<string, number>;

export type SorterProps = CommonProps & {
  value?: SorterValue;
  options?: OptionsInput;

  colorType?: LogicType;

  sorterIcons?: {
    ASC: IconInput;
    DESC: IconInput;
  };

  /**
   * 前缀标题
   */
  title?: string;

  /**
   * 显示配置按钮
   */
  canSetup?: boolean;

  /**
   * @param api 本控件导出的可被外部使用的方法
   */
  exportApi?: (api: SorterExportApi) => void;
};
