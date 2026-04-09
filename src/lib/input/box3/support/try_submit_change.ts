import { InputBoxApi } from "../ti-input-box3-types";

/**
 *
 * @param api
 * @param input
 */
export async function try_submit_change(api: InputBoxApi) {
  let val: any = null;
  // 如果选择了一个已经存在的项目
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
