import {
  CheckProps,
  InputNumProps,
  is_number,
  NumRange,
  useInputRangeApi,
} from "@site0/tijs";
import { InputNumRangeEmitter, InputNumRangeProps } from "./inrange-types";

export type TiInputNumRangeApi = ReturnType<typeof useTiInputNumRangeApi>;

export function useTiInputNumRangeApi(
  props: InputNumRangeProps,
  emit: InputNumRangeEmitter
) {
  const _api = useInputRangeApi<number, CheckProps, InputNumProps>(props, {
    valueComType: () => "TiInputNum",
    valueToRange: (v) => new NumRange(v),
    emit,
    isMatchType: is_number,
    msgPrefix: "ti-input-num-range",
    defaultValue: 0,
  });
  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return _api;
}
