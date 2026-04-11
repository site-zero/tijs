import { InputBoxApi } from "../ti-input-box3-types";

/**
 *
 * @param api
 * @param input
 */
export async function try_show_options(api: InputBoxApi) {
  if (api.isReadonly.value) {
    return;
  }
  if (!api.isFocused.value) {
    api.setFocused(true);
  }
  // 可以加载就加载
  if (api.hasOptionsData.value && !api.isOptionsDataShow.value) {
    let hint = api.getLiveHintForReloadOptions();
    await api.tryReloadOptionsData(hint);
  }
}
