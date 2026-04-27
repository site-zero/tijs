import { InputComboApi } from "../use-input-combo-api";

/**
 *
 * @param api
 * @param input
 */
export async function try_show_options(api: InputComboApi) {
  if (api.isReadonly.value) {
    return;
  }
  if (!api.isFocused.value) {
    api.setFocused(true);
  }
  // 可以加载就加载
  if (api.hasOptionsData.value && !api.isOptionsDataShow.value) {
    let hint = api.getInputLiveValue();
    await api.tryReloadOptionsData(hint);
  }
}
