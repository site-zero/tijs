import { ListSelectEmitInfo } from "@site0/tijs";
import { InputBoxApi } from "../ti-input-box3-types";

/**
 *
 * @param api
 * @param input
 */
export function try_select_option_item(
  api: InputBoxApi,
  payload: ListSelectEmitInfo
) {
  console.log("try_select_option_item", payload);
  let val = payload.currentId ?? null;
  api.notifyChange(val);
  api.setFocused(false);
  api.tryDeferBlur();
}
