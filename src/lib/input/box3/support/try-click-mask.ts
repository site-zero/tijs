import { InputBoxApi } from "../ti-input-box3-types";

export async function try_click_mask(api: InputBoxApi) {
  api.setFocused(true);
  api.setOptionsStatus("hide");
  api.clearLastHints();
  await api.reloadCurrentItem();
}
