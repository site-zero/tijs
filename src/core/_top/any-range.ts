import _ from "lodash";
import { I18n } from "../";
import {
  AnyToValue,
  CompareValue,
  isRangeInfo,
  isRangeObj,
  MatchValueType,
  RangeInfo,
  RangeObj,
  toRangeInfo,
  toRangeObj,
} from "../../_type";

//-----------------------------------------------
// 定义类型
//-----------------------------------------------
/**
 * 范围边界定义
 * @template T 边界值的类型
 */
type AnyRangeBorder<T> = {
  open: boolean;
  value: T;
};

export type AnyRangeSetup<T> = {
  anyToValue: AnyToValue<T>;
  compareValue: CompareValue<T>;
  isMatchType: MatchValueType<T>;
};

//-----------------------------------------------
// 定义工具类
//-----------------------------------------------
export class AnyRange<T> {
  public invalid?: boolean;
  public left?: AnyRangeBorder<T>;
  public right?: AnyRangeBorder<T>;
  public anyToValue: AnyToValue<T>;
  public compareValue: CompareValue<T>;
  public isMatchValueType: MatchValueType<T>;

  //--------------------------------
  // (1638861356185,1641798956185]
  // @return {left:{val:163.., open:true}, right:{val:163...,open:false}}
  // (1638861356185,]
  // @return {left:{val:163.., open:true}, right:{val:NaN,open:false}}
  constructor(
    setup: AnyRangeSetup<T>,
    input?:
      | AnyRange<T>
      | RangeObj<T>
      | RangeInfo<T>
      | string
      | T[]
      | null
      | undefined
  ) {
    //.........................................
    this.anyToValue = setup.anyToValue;
    this.compareValue = setup.compareValue;
    this.isMatchValueType = setup.isMatchType;
    //.........................................
    if (_.isNil(input)) {
      this.invalid = true;
      return;
    }
    //.........................................
    // Another Range
    if (input instanceof AnyRange) {
      if (input.invalid) {
        this.invalid = input.invalid;
      }
      if (input.left) {
        this.left = _.cloneDeep(input.left);
      }
      if (input.right) {
        this.right = _.cloneDeep(input.right);
      }
      this.anyToValue = input.anyToValue;
      this.compareValue = input.compareValue;
      return;
    }
    //.........................................
    // RangeInfo: { minValue, maxValue ... }
    if (isRangeInfo<T>(input, setup.isMatchType)) {
      let info = toRangeInfo(input, setup.isMatchType);
      if (info.hasMinValue && !_.isNil(info.minValue)) {
        this.left = {
          open: info.minValueIncluded ? false : true,
          value: info.minValue,
        };
      }
      if (info.hasMaxValue && !_.isNil(info.maxValue)) {
        this.right = {
          open: info.maxValueIncluded ? false : true,
          value: info.maxValue,
        };
      }
      return;
    }
    //.........................................
    if (isRangeObj<T>(input, setup.isMatchType)) {
      let ro = toRangeObj(input, setup.isMatchType);
      // {$ne: 99} = > `(99)`
      if (!_.isNil(ro.$ne)) {
        this.left = { open: true, value: ro.$ne };
        this.right = { open: true, value: ro.$ne };
      }
      // {$eq: 99} = > `[99]`
      else if (!_.isNil(ro.$eq)) {
        this.left = { open: false, value: ro.$eq };
        this.right = { open: false, value: ro.$eq };
      }
      // {$gt,$gte,$lt,$lte}
      else {
        // {$gt, ...}
        if (!_.isNil(ro.$gt)) {
          this.left = { open: true, value: ro.$gt };
        }
        // {$gte, ...}
        else if (!_.isNil(ro.$gte)) {
          this.left = { open: false, value: ro.$gte };
        }
        // {..., $lt}
        if (!_.isNil(ro.$lt)) {
          this.right = { open: true, value: ro.$lt };
        }
        // {..., $lte}
        else if (!_.isNil(ro.$lte)) {
          this.right = { open: false, value: ro.$lte };
        }
      }
      return;
    }
    //.........................................
    // String
    type NRValType = T | undefined;
    let vals: NRValType[];
    let borderOpen = [false, false] as [boolean, boolean];
    if (_.isString(input)) {
      let m = /^([(\[])([^\]]*)([)\]])$/.exec(input);
      if (!m) {
        throw `Invalid Range: [${input}]`;
      }
      // 解析成功
      let str = _.trim(m[2]);
      vals = _.map(str.split(/[,:;~]/g), (v) => {
        if (!_.isNil(v) && !_.isEmpty(v)) {
          return this.anyToValue(v);
        }
      });
      borderOpen[0] = "(" == _.trim(m[1]);
      borderOpen[1] = ")" == _.trim(m[3]);
    }
    //.........................................
    // Array
    else if (_.isArray(input)) {
      vals = _.map(input, (v) => this.anyToValue(v));
    }
    //.........................................
    // Others not support
    else {
      vals = [];
      this.invalid = true;
      return;
    }
    //.........................................
    // 搞一下左右边界的值
    //.........................................
    let [v0, v1] = vals;
    if (vals.length == 1) {
      v1 = v0;
    }

    if (!_.isUndefined(v0)) {
      this.left = {
        open: borderOpen[0],
        value: v0,
      };
    } else {
      this.left = undefined;
    }

    if (!_.isUndefined(v1)) {
      this.right = {
        open: borderOpen[1],
        value: v1,
      };
    } else {
      this.right = undefined;
    }
  }
  //--------------------------------
  contains(v: T): boolean {
    if (this.invalid) {
      return false;
    }
    let n = this.anyToValue(v);
    if (!this.isMatchValueType(n)) {
      return false;
    }
    if (!this.left && !this.right) {
      return false;
    }
    if (this.left && this.right) {
      if (this.left.value === this.right.value) {
      }
    }
    if (this.left) {
      let L = this.left.value;
      // (3,)
      if (this.left.open) {
        if (this.compareValue(n, L) <= 0) {
          return false;
        }
      }
      // [3,]
      else {
        if (this.compareValue(n, L) < 0) {
          return false;
        }
      }
    }
    if (this.right) {
      let R = this.right.value;
      // (,9)
      if (this.right.open) {
        if (this.compareValue(n, R) >= 0) {
          return false;
        }
      }
      // (,9]
      else {
        if (this.compareValue(n, R) > 0) {
          return false;
        }
      }
    }
    return true;
  }
  //--------------------------------
  toString({
    format = (v: T): string => `${v}`,
    separator = ",",
    leftOpen = "(",
    leftClose = "[",
    rightOpen = ")",
    rightClose = "]",
  } = {}) {
    if (this.invalid) {
      return (
        "<!!!Invalid Range!!!>: " +
        JSON.stringify({
          invalid: this.invalid,
          left: this.left,
          right: this.right,
        })
      );
    }
    let leftText = this.left
      ? this.left.open
        ? leftOpen
        : leftClose
      : leftOpen;
    let rightText = this.right
      ? this.right.open
        ? rightOpen
        : rightClose
      : rightOpen;
    let ss: string[] = [leftText];

    // 左右都有值
    if (this.left && this.right) {
      // 单值，即左右两值相等
      if (this.left.value === this.right.value) {
        let vs = format(this.left.value);
        ss.push(vs);
      }
      // 双值
      else {
        let vs0 = format(this.left.value);
        let vs1 = format(this.right.value);
        let sep = I18n.text(separator);
        ss.push(vs0, sep, vs1);
      }
    }
    // 左右可能没值
    else {
      let sep = I18n.text(separator);
      // 只有左值
      if (this.left) {
        let vs0 = format(this.left.value);
        ss.push(vs0, sep);
      }
      // 只有右值
      if (this.right) {
        let vs1 = format(this.right.value);
        ss.push(sep, vs1);
      }
    }
    ss.push(rightText);
    return ss.join("");
  }
  //--------------------------------
  toRangeInfo(): RangeInfo<T> {
    if (this.invalid) {
      return {};
    }
    let re = {} as RangeInfo<T>;
    if (this.left) {
      re.hasMinValue = true;
      re.minValue = this.left.value;
      if (_.isNil(this.left.open)) {
        re.minValueIncluded = true;
      } else {
        re.minValueIncluded = !this.left.open;
      }
    } else {
      re.hasMinValue = false;
    }
    if (this.right) {
      re.hasMaxValue = true;
      re.maxValue = this.right.value;
      if (_.isNil(this.right.open)) {
        re.maxValueIncluded = true;
      } else {
        re.maxValueIncluded = !this.right.open;
      }
    } else {
      re.hasMaxValue = false;
    }
    return re;
  }
  //--------------------------------
  toRangeObj(): RangeObj<T> {
    if (this.invalid) {
      return {};
    }
    let info = this.toRangeInfo();
    let {
      hasMinValue,
      minValue,
      minValueIncluded,
      hasMaxValue,
      maxValue,
      maxValueIncluded,
    } = info;

    let _nil_min_val = _.isNil(minValue);
    let _nil_max_val = _.isNil(maxValue);

    // {$ne}
    if (hasMinValue && hasMaxValue && !_nil_min_val && !_nil_max_val) {
      if (this.compareValue(minValue!, maxValue!) === 0) {
        if (!minValueIncluded && !maxValueIncluded) {
          return { $ne: minValue };
        }
        return { $eq: minValue };
      }
    }
    let ro = {} as RangeObj<T>;
    // {$gt, $gte}
    if (!_nil_min_val) {
      if (minValueIncluded) {
        ro.$gte = minValue;
      } else {
        ro.$gt = minValue;
      }
    }
    // {$lt, $lte}
    if (!_nil_max_val) {
      if (maxValueIncluded) {
        ro.$lte = maxValue;
      } else {
        ro.$lt = maxValue;
      }
    }
    return ro;
  }
  //--------------------------------
}
