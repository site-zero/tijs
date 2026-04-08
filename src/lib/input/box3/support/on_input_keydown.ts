import { InputBoxApi } from "../ti-input-box3-types";
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
  }
  // 选择上一项目
  else if ("ArrowDown" == keyName) {
  }
  // 取消
  else if ("Escape" == keyName) {
    api.setFocused(false);
    api.setOptionsStatus("hide");
  }
  // 确认
  else if ("Enter" == keyName) {
    try_submit_change(api);
  }
}
