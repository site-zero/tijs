import { NumRangeInfo } from "@site0/tijs";

type RangeInfoMsgKey =
  | "NA"
  | "ne"
  | "eq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "gtlt"
  | "gtelt"
  | "gtlte"
  | "gtelte";

export function getNumRangeInfoMsgKey(info: NumRangeInfo): RangeInfoMsgKey {
  let {
    hasMaxValue,
    hasMinValue,
    minValue,
    maxValueIncluded,
    minValueIncluded,
    maxValue,
  } = info;
  if (hasMaxValue && hasMinValue) {
    // {$eq, $ne}
    if (minValue === maxValue) {
      if (maxValueIncluded && minValueIncluded) {
        return "eq";
      } else if (!maxValueIncluded && !minValueIncluded) {
        return "ne";
      }
    }
    // {$lt, $lte, $gt, $gte}
    if (maxValueIncluded && minValueIncluded) {
      return "gtelte";
    }
    if (minValueIncluded) {
      return "gtelt";
    }
    if (maxValueIncluded) {
      return "gtlte";
    }
    return "gtelte";
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
  return "NA";
}
