import { PlaceholderFeatureProps, ReadonlyProps } from '../../';
import { CommonProps } from '../../../core';

export type InputNumProps = CommonProps &
  PlaceholderFeatureProps &
  ReadonlyProps & {
    value?: number | string | boolean | null;
    /**
     * 整数，精确度：
     * - 100 : 精确到小数点后两位
     * - 10  :  精确到小数点后一位
     * - 1   : 精确到个位
     * - 0.1 : 精确到十位
     * - 0.01 : 精确到百位
     */
    precise?: number
  };
