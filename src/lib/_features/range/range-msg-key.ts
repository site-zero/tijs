import { RangeInfo, RangeInfoMsgKey } from "@site0/tijs";
import _ from "lodash";

export function get_range_info_msg_key<T>(info: RangeInfo<T>): RangeInfoMsgKey {
  let {
    hasMaxValue,
    hasMinValue,
    minValue,
    maxValueIncluded,
    minValueIncluded,
    maxValue,
  } = info;

  hasMinValue = !_.isNil(minValue);
  hasMaxValue = !_.isNil(maxValue);

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
    return "gtlt";
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
