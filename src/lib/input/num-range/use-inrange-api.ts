import { CheckProps, I18n, InputNumProps, is_number, NumRange, NumRangeInfo, useInputRangeApi } from "@site0/tijs";
import _ from "lodash";
import { computed } from "vue";
import { InputNumRangeEmitter, InputNumRangeProps } from "./inrange-types";
import { open_inrange_editor } from "./support/open-inrange-editor";
import { get_num_range_info_msg_key } from "./support/range-info-msg-key";

export type TiInputNumRangeApi = ReturnType<typeof useTiInputNumRangeApi>;

export function useTiInputNumRangeApi(
  props: InputNumRangeProps,
  emit: InputNumRangeEmitter
) {
  const _api = useInputRangeApi<number, CheckProps, InputNumProps>(props,{
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
