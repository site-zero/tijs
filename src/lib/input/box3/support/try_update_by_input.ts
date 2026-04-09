import { InputBoxApi } from "../ti-input-box3-types";

export async function try_update_by_input(api: InputBoxApi, input: string) {
  // 无需加载
  if (!api.hasOptionsData.value) {
    return;
  }
  // 整理值
  let val = api.applyPipe(input);
  console.log("input:", input, "val:", val);
  api.BoxView.value.updateViewPortSize();
  await api.tryReloadOptionsData(val);
  let it = api.lookupItem(val);
  api.setCurrentItem(it);
}
