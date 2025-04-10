import _ from 'lodash';

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
