import _ from "lodash";
import { MatchValueType } from "./core-types";

//-----------------------------------------------
// RangeObj: { $gt, $gte, $lt, $lte, $eq, $ne }
//-----------------------------------------------
export type RangeObj<T> = {
  $gt?: T;
  $gte?: T;
  $lt?: T;
  $lte?: T;
  $eq?: T;
  $ne?: T;
};
//-----------------------------------------------
/**
 * 判断输入值是否为 RangeObj（范围对象）类型。
 * @param input - 待判断的任意输入值
 * @param isMatchType - 用于校验范围边界值类型的类型守卫函数
 * @returns 如果 input 是符合要求的 RangeObj<T>，则返回 true；否则返回 false
 */
export function isRangeObj<T>(
  input: any,
  isMatchType: (v: any) => v is T
): input is RangeObj<T> {
  if (_.isNil(input)) return false;
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

/**
 * 将输入值转换为 RangeObj（范围对象）类型。
 * @param input - 待转换的任意输入值
 * @param isMatchType - 用于校验范围边界值类型的类型守卫函数
 * @returns 如果 input 是符合要求的 RangeObj<T>，则返回该对象；否则抛出错误
 */
export function toRangeObj<T>(
  input: any,
  isMatchType: (v: any) => v is T
): RangeObj<T> {
  if (!isRangeObj(input, isMatchType)) {
    throw new Error("input is not a range object: " + JSON.stringify(input));
  }
  return input as RangeObj<T>;
}
//-----------------------------------------------
// 实例化 RangeObj 类型的工具函数
//-----------------------------------------------
export type AnyRangeObj = RangeObj<any>;
export type StrRangeObj = RangeObj<string>;
export type NumRangeObj = RangeObj<number>;
//-----------------------------------------------
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
//-----------------------------------------------
// RangeInfo: { minValue, maxValue ... }
//-----------------------------------------------
export type RangeInfo<T> = {
  hasMinValue?: boolean;
  minValue?: T; //
  minValueIncluded?: boolean;
  hasMaxValue?: boolean;
  maxValue?: T;
  maxValueIncluded?: boolean;
};
//-----------------------------------------------
/**
 * 判断输入值是否为 RangeInfo（范围信息对象）类型。
 * @param input - 待判断的任意输入值
 * @param isMatchType - 用于校验范围边界值类型的类型守卫函数
 * @returns 如果 input 是符合要求的 RangeInfo<T>，则返回 true；否则返回 false
 */
export function isRangeInfo<T>(
  input: any,
  isMatchType: MatchValueType<T>
): input is RangeInfo<T> {
  if (_.isNil(input) || _.isEmpty(input)) return false;
  return Object.keys(input).every((k) => {
    let v = input[k];
    if (_.isNil(v)) return true;
    if (["hasMinValue", "hasMaxValue"].includes(k)) {
      return _.isBoolean(v);
    }
    if (["minValue", "maxValue"].includes(k)) {
      return isMatchType(v);
    }
    if (["minValueIncluded", "maxValueIncluded"].includes(k)) {
      return _.isBoolean(v);
    }
    return false;
  });
}

/**
 * 将输入值转换为 RangeInfo（范围信息对象）类型。
 * @param input - 待转换的任意输入值
 * @param isMatchType - 用于校验范围边界值类型的类型守卫函数
 * @returns 如果 input 是符合要求的 RangeInfo<T>，则返回该对象；否则抛出错误
 */
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
//-----------------------------------------------
// 实例化 RangeInfo 类型的工具函数
//-----------------------------------------------
export type AnyRangeInfo = RangeInfo<any>;
export type StrRangeInfo = RangeInfo<string>;
export type NumRangeInfo = RangeInfo<number>;
//-----------------------------------------------
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
