import { InputBoxApi } from "../ti-input-box3-types";
import { try_show_options } from "./try_show_options";
import { try_submit_change } from "./try_submit_change";

export async function on_input_keydown(api: InputBoxApi, evt: KeyboardEvent) {
  // 只读模式防守
  if (api.isReadonly.value) {
    return;
  }

  // 处理特殊按键
  const keyName = evt.key;

  // 选择下一项目
  if ("ArrowUp" == keyName) {
    try_show_options(api);
    let nextIt = api.getNextOptionItem(-1);
    api.setCurrentItem(nextIt);
  }
  // 选择上一项目
  else if ("ArrowDown" == keyName) {
    try_show_options(api);
    let nextIt = api.getNextOptionItem(1);
    api.setCurrentItem(nextIt);
  }
  // Tab 选择
  else if ("Tab" == keyName) {
    try_submit_change(api);
    api.setFocused(false);
    api.setOptionsStatus("hide");
  }
  // 取消
  else if ("Escape" == keyName) {
    api.setFocused(false);
    api.setOptionsStatus("hide");
    await api.reloadCurrentItem();
  }
  // 确认
  else if ("Enter" == keyName) {
    try_submit_change(api);
  }
}
