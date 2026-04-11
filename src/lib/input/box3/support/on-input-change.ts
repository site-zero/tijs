import { BoxCompositionApi } from "../_fea";
import { InputBoxApi } from "../ti-input-box3-types";

export async function on_input_change(
  api: InputBoxApi,
  compose: BoxCompositionApi
) {
  if (api.debug) console.log("on_input_change");

  // Tab 导致的 change 应该已经被处理了，这里需要忽略一下
  if (compose.LastDownKey.value === "Tab") {
    return;
  }

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
