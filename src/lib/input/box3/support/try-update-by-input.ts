import { InputBoxApi } from "../ti-input-box3-types";

export async function try_update_by_input(api: InputBoxApi, input: string) {
  // 无需加载
  if (!api.hasOptionsData.value) {
    return;
  }
  // 整理值
  //console.log("input:", input);
  await api.tryReloadOptionsData(input);
  let it = api.lookupItem(input);
  api.setCurrentItem(it);
}
