import { InputBoxApi } from "../ti-input-box3-types";

/**
 *
 * @param api
 * @param input
 */
export function try_clear_value(api: InputBoxApi) {
  api.setFocused(false);
  api.tryNotifyChange(null);
  api.setCurrentItem(null);
}
