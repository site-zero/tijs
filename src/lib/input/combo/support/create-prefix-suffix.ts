import {
  Be,
  BoxIconEmit,
  BoxIconHandler,
  BoxPrefixSuffixProps,
  useBoxPrefixSuffix,
  Vars,
} from "@site0/tijs";

import { InputComboEmitter } from "../input-combo-types";
import { InputComboApi } from "../use-input-combo-api";
import { try_clear_value, try_show_options } from "./";

export function create_prefix_suffix(
  props: BoxPrefixSuffixProps<InputComboApi>,
  api: InputComboApi,
  emit: InputComboEmitter,
  getElement: () => HTMLElement | null
) {
  return useBoxPrefixSuffix(props, {
    getBoxIcon: () => api.CurrentItem.value?.icon,
    getBoxValue: () => api.PropsStrValue.value,
    toOptionItem: (it: Vars) => api.toOptionItem(it)!,
    isReadonly: () => api.isReadonly.value,
    onInvoke: (hdl: BoxIconHandler<InputComboApi>) => {
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
        Be.Clipboard.write(api.PropsStrValue.value);
      } else {
        Be.Clipboard.write(api.PropsRawValue.value);
      }
      Be.BlinkIt(getElement());
    },
    onLoadOptions: () => {
      try_show_options(api);
    },
  });
}
