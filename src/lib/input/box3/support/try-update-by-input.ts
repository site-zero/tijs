import { InputBoxApi } from "../ti-input-box3-types";

export async function try_update_by_input(api: InputBoxApi, input: string) {
  // 无需加载
  if (!api.hasOptionsData.value) {
    return;
  }
  // 首先清理一下当前值
  api.setCurrentItem(null);
  // 整理值
  if (api.shouldDelayTipReload.value) {
    api.debounceTryReloadOptionsDataAndLookupItem(input);
  } else {
    await api.tryReloadOptionsDataAndLookupItem(input);
  }
}
