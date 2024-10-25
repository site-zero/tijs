import {
  InputBoxAspect,
  PlaceholderProps,
  PrefixSuffixProps,
  ReadonlyProps,
} from '../../';
import { CommonProps, HDirecton, Vars } from '../../../_type';

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
     * 显示到小数点后几位，默认的则是自动不补零
     * 如果指定了这个位数，后面需要补零
     */
    decimalPlaces?:number;

    /**
     * 显示数字分段，一段有多长
     */
    partWidth?: number;

    /**
     * 显示数字分段，段与段之间的分隔符
     */
    partSep?: string;

    /**
   * 分隔的方向：
   *
   * - `left` 从右向左分隔，通常用来格式化金额【默认】
   * - `right` 从左至右分隔，通常用来格式化银行账号，或者软件激活码
   */
    partTo?:HDirecton;

    /**
     * 最小值（包含）
     */
    minValue?: number;

    /**
     * 最大值（包含）
     */
    maxValue?: number;
  };
