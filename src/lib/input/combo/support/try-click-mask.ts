import { InputComboApi } from "../use-input-combo-api";

export async function try_click_mask(api: InputComboApi) {
  api.setFocused(true);
  api.setOptionsStatus("hide");
  api.clearLastHints();
  api.setCurrentItem(undefined);
}
