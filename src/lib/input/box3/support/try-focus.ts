import { InputBoxApi, InputBoxProps } from "../ti-input-box3-types";
import { try_show_options } from "./";

export function try_focus(api: InputBoxApi, props: InputBoxProps) {
  if (api.isFocused.value) {
    return;
  }
  if (api.isReadonly.value) {
    return;
  }
  if ("focus" === props.tipShowTime) {
    try_show_options(api);
  }
  // 仅仅是 focus
  else {
    api.setFocused(true);
  }
}
