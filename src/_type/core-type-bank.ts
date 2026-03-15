import { HDirecton } from "./core-types";

export type PartitionOptions = {
  /**
   * 每段有多长
   */
  width?: number;
  /**
   * 分隔字符串
   */
  sep?: string;
  /**
   * 分隔的方向：
   *
   * - `left` 从右向左分隔，通常用来格式化金额
   * - `right` 从左至右分隔，通常用来格式化银行账号，或者软件激活码
   */
  to?: HDirecton;
};

export type ToBankTextOptions = PartitionOptions & {
  /**
   * 显示到小数点后几位，默认的则是自动不补零
   * 如果指定了这个位数，后面需要补零
   */
  decimalPlaces?: number;
};
