import { InputBoxApi } from "../ti-input-box3-types";

/**
 *
 * @param api
 * @param input
 */
export async function try_show_options(api: InputBoxApi) {
  if (!api.isFocused.value) {
    api.setFocused(true);
  }
  // 可以加载就加载
  if (api.hasOptionsData.value) {
    api.BoxView.value.updateViewPortSize();
    await api.tryReloadOptionsData();
  }
}
