import { InputBoxApi } from "../ti-input-box3-types";

/**
 *
 * @param api
 * @param input
 */
export async function try_show_options(api: InputBoxApi) {
  api.setFocused(true);
  api.BoxView.value.updateViewPortSize();
  await api.tryReloadOptionsData();
}
