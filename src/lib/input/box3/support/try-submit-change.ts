import _ from "lodash";
import { InputBoxApi } from "../ti-input-box3-types";

/**
 * 与 try_blur 一样，在 input onchange 事件里也会调用这个
 * 因此，它也要等等，看是不是 click options item 导致的 change
 */
export async function try_submit_change(api: InputBoxApi) {
  if (api.hasOptionsData.value && api.isOptionsDataShow.value) {
    api.setDeferBlur(async () => await do_submit_change(api));
    _.delay(() => api.tryDeferBlur(), 500);
  }
  // 放心处理失焦
  else {
    await do_submit_change(api);
  }
}

export async function do_submit_change(api: InputBoxApi) {
  if (api.debug) console.log("do_submit_change");
  let val: any = null;
  // // 如果选择了一个已经存在的项目
  let curIt = api.CurrentItem.value;
  if (curIt) {
    val = curIt.value ?? null;
  }
  // 尝试采用输入框里的值
  else {
    const $input = api.getInputElement();
    const input = $input?.value;
    val = api.applyPipe(input);
  }
  // 收起选项表
  api.setOptionsStatus("hide");
  // 提交
  await api.tryNotifyChange(val);
  // 清理一下
  api.clearHints();
}
