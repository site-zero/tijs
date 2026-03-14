import _ from "lodash";
import { HDirecton } from "./core-types";

export type SelectValueArmItem<T, M> = T | [T, M];
export type SelectValueArm<T, M> = T | Array<SelectValueArmItem<T, M>>;

export type Gender = "UNKNOWN" | "MALE" | "FEMALE";

export function toGender(str?: any): Gender {
  if (_.isNil(str)) {
    return "UNKNOWN";
  }
  let lower = str.toLowerCase().trim();
  if (/^(m(ale)?)$/.test(lower)) {
    return "MALE";
  }

  if (/^(f(emale)?)$/.test(lower)) {
    return "FEMALE";
  }

  return "UNKNOWN";
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

export type RangeObj<T> = {
  $gt?: T;
  $gte?: T;
  $lt?: T;
  $lte?: T;
  $eq?: T;
  $ne?: T;
};
export type AnyRangeObj = RangeObj<any>;
export type StrRangeObj = RangeObj<string>;
export type NumRangeObj = RangeObj<number>;

export function isAnyRangeObj(input: any): input is AnyRangeObj {
  return isRangeObj<any>(input, (v: any): v is any => !_.isNil(v));
}

export function isStrRangeObj(input: any): input is StrRangeObj {
  return isRangeObj<string>(input, (v) => _.isString(v));
}

export function isNumRangeObj(input: any): input is NumRangeObj {
  return isRangeObj<number>(input, (v) => _.isNumber(v));
}

export function toAnyRangeObj(input: any): AnyRangeObj {
  return toRangeObj<any>(input, (v: any): v is any => !_.isNil(v));
}

export function toStrRangeObj(input: any): StrRangeObj {
  return toRangeObj<string>(input, (v) => _.isString(v));
}

export function toNumRangeObj(input: any): NumRangeObj {
  return toRangeObj<number>(input, (v) => _.isNumber(v));
}

export function isRangeObj<T>(
  input: any,
  isMatchType: (v: any) => v is T
): input is RangeObj<T> {
  if (_.isNil(input``)) return false;
  if (
    _.isNil(input.$gt) &&
    _.isNil(input.$gte) &&
    _.isNil(input.$lt) &&
    _.isNil(input.$lte) &&
    _.isNil(input.$eq) &&
    _.isNil(input.$ne)
  ) {
    return false;
  }
  return Object.keys(input).every((k) => {
    if (["$gt", "$gte", "$lt", "$lte", "$eq", "$ne"].includes(k)) {
      return isMatchType(input[k]);
    }
    return false;
  });
}

export function toRangeObj<T>(
  input: any,
  isMatchType: (v: any) => v is T
): RangeObj<T> {
  if (!isRangeObj(input, isMatchType)) {
    throw new Error("input is not a range object: " + JSON.stringify(input));
  }
  return input as RangeObj<T>;
}

export type RangeInfo<T> = {
  hasMinValue?: boolean;
  minValue: T; //
  minValueIncluded?: boolean;
  hasMaxValue?: boolean;
  maxValue: T;
  maxValueIncluded?: boolean;
};

export type AnyRangeInfo = RangeInfo<any>;
export type StrRangeInfo = RangeInfo<string>;
export type NumRangeInfo = RangeInfo<number>;

export function isAnyRangeInfo(input: any): input is AnyRangeInfo {
  return isRangeInfo<any>(input, (v: any): v is any => !_.isNil(v));
}

export function isStrRangeInfo(input: any): input is StrRangeInfo {
  return isRangeInfo<string>(input, (v) => _.isString(v));
}

export function isNumRangeInfo(input: any): input is NumRangeInfo {
  return isRangeInfo<number>(input, (v) => _.isNumber(v));
}

export function toAnyRangeInfo(input: any): AnyRangeInfo {
  return toRangeInfo<any>(input, (v: any): v is any => !_.isNil(v));
}

export function toStrRangeInfo(input: any): StrRangeInfo {
  return toRangeInfo<string>(input, (v) => _.isString(v));
}

export function toNumRangeInfo(input: any): NumRangeInfo {
  return toRangeInfo<number>(input, (v) => _.isNumber(v));
}

export function isRangeInfo<T>(
  input: any,
  isMatchType: (v: any) => v is T
): input is RangeInfo<T> {
  if (_.isNil(input)) return false;
  if (_.isNil(input.hasMinValue) && _.isNil(input.hasMaxValue)) {
    return false;
  }
  return Object.keys(input).every((k) => {
    if (["hasMinValue", "hasMaxValue"].includes(k)) {
      return _.isBoolean(input[k]);
    }
    if (["minValue", "maxValue"].includes(k)) {
      return isMatchType(input[k]);
    }
    if (["minValueIncluded", "maxValueIncluded"].includes(k)) {
      return _.isBoolean(input[k]);
    }
    return false;
  });
}

export function toRangeInfo<T>(
  input: any,
  isMatchType: (v: any) => v is T
): RangeInfo<T> {
  if (!isRangeInfo(input, isMatchType)) {
    throw new Error(
      "input is not a range info object: " + JSON.stringify(input)
    );
  }
  return input as RangeInfo<T>;
}


