import _ from 'lodash';
import { HDirecton } from './core-types';

export type SelectValueArmItem<T, M> = T | [T, M];
export type SelectValueArm<T, M> = T | Array<SelectValueArmItem<T, M>>;

export type Gender = 'UNKNOWN' | 'MALE' | 'FEMALE';

export function toGender(str?: any): Gender {
  if (_.isNil(str)) {
    return 'UNKNOWN';
  }
  let lower = str.toLowerCase().trim();
  if (/^(m(ale)?)$/.test(lower)) {
    return 'MALE';
  }

  if (/^(f(emale)?)$/.test(lower)) {
    return 'FEMALE';
  }

  return 'UNKNOWN';
}

export type ObjModeInfo = {
  // 十进制的权限码
  // int: 488
  val: number;

  // 八进制的权限码
  // oct: 750
  oct: string;

  // 字符串形式的权限码
  // mod: rwxr-x---
  mod: string;

  // 分段权限码
  // 所有者: rwx
  owner: string;
  // 组权限: rwx
  group: string;
  // 其他人: rwx
  other: string;
};

export type AjaxResult = {
  ok: boolean;
  errCode?: string;
  msg?: string;
  data?: any;
};

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
