import {
  CheckProps,
  InputDatetimeProps,
  StrRange,
  useInputRangeApi,
} from "@site0/tijs";
import _ from "lodash";
import { InputDateRangeEmitter, InputDateRangeProps } from "./daterange-types";

export type TiInputDateRangeApi = ReturnType<typeof useTiInputDateRangeApi>;

export function useTiInputDateRangeApi(
  props: InputDateRangeProps,
  emit: InputDateRangeEmitter
) {
  const _api = useInputRangeApi<string, CheckProps, InputDatetimeProps>(props, {
    valueComType: () => "TiInputDate",
    valueToRange: (v) => new StrRange(v),
    emit,
    isMatchType: _.isString,
    msgPrefix: "ti-input-date-range",
    defaultValue: "",
  });
  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return _api;
}
