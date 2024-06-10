import {
  InputBoxAspect,
  PlaceholderProps,
  ReadonlyProps,
  PrefixSuffixProps,
} from '../../';
import { CommonProps, Vars } from '../../../core';

export type InputNumProps = CommonProps &
  PlaceholderProps &
  ReadonlyProps &
  InputBoxAspect &
  Pick<PrefixSuffixProps, 'prefixText' | 'suffixText'> & {
    value?: number | string | boolean | null;
    style?: Vars;
    /**
     * 整数，精确度：
     * - 100 : 精确到小数点后两位
     * - 10  : 精确到小数点后一位
     * - 1   : 精确到个位
     * - 0   : 不确定精度
     * - 0.1 : 精确到十位
     * - 0.01 : 精确到百位
     */
    precision?: number;

    /**
     * 显示数字分段，一段有多长
     */
    partSize?: number;

    /**
     * 显示数字分段，段与段之间的分隔符
     */
    partSep?: string;

    /**
     * 最小值（包含）
     */
    minValue?: number;

    /**
     * 最大值（包含）
     */
    maxValue?: number;
  };
