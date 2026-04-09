import { Be, InputBox3Emitter, KeyboardStatus, Vars } from "@site0/tijs";
import {
  Box3IconHandler,
  BoxIconEmit,
  BoxPrefixSuffixProps,
  useBoxPrefixSuffix,
} from "../_fea";
import { InputBoxApi } from "../ti-input-box3-types";
import { try_clear_value, try_show_options } from "./";

export function create_prefix_suffix(
  props: BoxPrefixSuffixProps,
  api: InputBoxApi,
  emit: InputBox3Emitter,
  getElement: () => HTMLElement | null
) {
  return useBoxPrefixSuffix(props, {
    getBoxIcon: () => api.CurrentItem.value?.icon,
    getBoxValue: () => api.BoxInputValue.value,
    toOptionItem: (it: Vars) => api.toOptionItem(it)!,
    isReadonly: () => api.isReadonly.value,
    onInvoke: (hdl: Box3IconHandler) => {
      hdl(api);
    },
    onEmit: (clickEmit: BoxIconEmit) => {
      emit(clickEmit);
    },
    onClear: () => {
      try_clear_value(api);
    },
    onCopy: ({ ctrlKey }) => {
      if (ctrlKey) {
        Be.Clipboard.write(api.BoxInputValue.value);
      } else {
        Be.Clipboard.write(api.BoxPropsValue.value);
      }
      Be.BlinkIt(getElement());
    },
    onLoadOptions: () => {
      try_show_options(api);
    },
  });
}
