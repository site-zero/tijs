import { InputBoxApi } from "../ti-input-box3-types";

export async function on_input_change(api: InputBoxApi) {
  if (api.debug) console.log("on_input_change");
  let val: any = null;
  const $input = api.getInputElement();
  const input = $input?.value;
  val = api.applyPipe(input);

  // 收起选项表
  api.setOptionsStatus("hide");
  // 提交
  await api.tryNotifyChange(val);
  // 清理一下
  api.clearLastHints();
}
