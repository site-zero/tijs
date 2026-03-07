import { NumRange } from "@site0/tijs";
import _, { max } from "lodash";
import { NumRangeInputValue } from "../inrange-types";
import { NumRangeInfo } from "./inrange-inner-types";

export function parse_inrange(
  input?: NumRangeInputValue | undefined | null
): NumRangeInfo {
  // 解析
  const nr = !input || _.isEmpty(input) ? null : new NumRange(input);
  // 搞定
  return inrangeFromNumRange(nr);
}

export function inrangeFromNumRange(nr?: NumRange | null) {
  let info: NumRangeInfo = {
    hasMaxValue: false,
    hasMinValue: false,
    maxValue: 0,
    maxValueIncluded: false,
    minValue: 0,
    minValueIncluded: false,
  };
  if (!nr) {
    return info;
  }
  if (nr.left) {
    info.hasMinValue = true;
    info.minValue = nr.left.value;
    info.minValueIncluded = !nr.left.open;
  }
  if (nr.right) {
    info.hasMaxValue = true;
    info.maxValue = nr.right.value;
    info.maxValueIncluded = !nr.right.open;
  }
  return info;
}

export function inrangeToNumRange(info: NumRangeInfo) {
  let {
    hasMaxValue,
    hasMinValue,
    maxValue,
    maxValueIncluded,
    minValue,
    minValueIncluded,
  } = info;
  const re = new NumRange([]);
  if (hasMinValue) {
    re.left = { value: minValue, open: !minValueIncluded };
  }
  if (hasMaxValue) {
    re.right = { value: maxValue, open: !maxValueIncluded };
  }
  return re;
}

export function getNumRangeInfoMsgKey(info: NumRangeInfo) {
  let {
    hasMaxValue,
    hasMinValue,
    minValue,
    maxValueIncluded,
    minValueIncluded,
    maxValue,
  } = info;
  if (hasMaxValue && hasMinValue) {
    if (maxValueIncluded && minValueIncluded) {
      if (minValue === maxValue) return "eq";
      return "in-lre";
    }
    if (minValueIncluded) {
      return "in-le";
    }
    if (maxValueIncluded) {
      return "in-re";
    }
    return "in";
  }
  if (hasMinValue) {
    if (minValueIncluded) {
      return "gte";
    }
    return "gt";
  }
  if (hasMaxValue) {
    if (maxValueIncluded) {
      return "lte";
    }
    return "lt";
  }
  return "na";
}
