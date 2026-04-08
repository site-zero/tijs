import { BoxDropListProps } from "../_fea";
import { InputBoxApi } from "../ti-input-box3-types";
import { try_show_options } from "./try_show_options";

/**
 *
 * @param api
 * @param input
 */
export function try_focus(api: InputBoxApi, props: BoxDropListProps) {
  if(api.isFocused.value){
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
