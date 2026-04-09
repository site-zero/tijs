import { InputBoxApi, InputBoxProps } from "../ti-input-box3-types";
import { try_show_options } from "./";

/**
 *
 * @param api
 * @param input
 */
export function on_click_top(api: InputBoxApi, props: InputBoxProps) {
  if ("focus" === props.tipShowTime) {
    try_show_options(api);
  }
  // 仅仅是 focus
  else {
    api.setFocused(true);
  }
}
