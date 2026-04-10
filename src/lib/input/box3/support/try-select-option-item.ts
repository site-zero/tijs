import { ListSelectEmitInfo } from "@site0/tijs";
import { InputBoxApi } from "../ti-input-box3-types";

/**
 *
 * @param api
 * @param input
 */
export async function try_select_option_item(
  api: InputBoxApi,
  payload: ListSelectEmitInfo
) {
  if (api.debug) console.log("try_select_option_item", payload);
  let val = payload.currentId ?? null;
  await api.tryNotifyChange(val);
  api.tryDeferBlur();
  api.clearHints();
}
