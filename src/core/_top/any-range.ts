import _ from "lodash";
import { I18n } from "../";

export interface AnyRangeBorder<T> {
  open: boolean;
  value: T;
}
type MatchValueType<T> = (v: any) => v is T;
type AnyToValue<T> = (v: any) => T;
/**
 * -1: v1 < v2
 *  0: v1 = v2
 *  1: v1 > v2
 */
type CompareValue<T> = (v1: T, v2: T) => number;

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
    input: AnyRange<T> | string | T[],
    atv: AnyToValue<T>,
    cv: CompareValue<T>,
    imvt: MatchValueType<T>
  ) {
    this.anyToValue = atv;
    this.compareValue = cv;
    this.isMatchValueType = imvt;
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
    // String
    type NRValType = T | undefined;
    let vals: NRValType[];
    let borderOpen = [false, false] as [boolean, boolean];
    if (_.isString(input)) {
      let m = /^([(\[])([^\]]+)([)\]])$/.exec(input);
      if (!m) {
        throw `Invalid TiMsRange: ${input}`;
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
    // Array
    else if (_.isArray(input)) {
      vals = _.map(input, (v) => this.anyToValue(v));
    }
    // Others not support
    else {
      vals = [];
      this.invalid = true;
      return;
    }

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
      return "<!!!Invalid MsRange!!!>";
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
}
