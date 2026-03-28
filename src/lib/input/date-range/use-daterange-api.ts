import {
  CheckProps,
  DateTime,
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
  const today = DateTime.format(new Date(), { fmt: "yyyy-MM-dd" });
  const _api = useInputRangeApi<string, CheckProps, InputDatetimeProps>(props, {
    valueComType: () => "TiInputDate",
    valueToRange: (v) => new StrRange(v),
    emit,
    isMatchType: _.isString,
    msgPrefix: "ti-input-date-range",
    defaultValue: today,
    editFieldType: "String",
    editDialog: () => ({
      width: "640px",
    }),
  });
  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return _api;
}
