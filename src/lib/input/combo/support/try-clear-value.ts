import { InputComboApi } from "../use-input-combo-api";

/**
 *
 * @param api
 * @param input
 */
export function try_clear_value(api: InputComboApi) {
  api.setFocused(false);
  api.tryNotifyChange(null);
  api.setCurrentItem(null);
  api.clearLastHints();
}
