import { BoxCompositionApi } from "../_fea";
import { InputBoxApi } from "../ti-input-box3-types";

export async function on_input_change(
  api: InputBoxApi,
  compose: BoxCompositionApi
) {
  // Tab 导致的 change 应该已经被处理了，这里需要忽略一下
  if (compose.LastDownKey.value === "Tab") {
    return;
  }

  // Enter 导致的 change 应该已经被处理了，这里也需要忽略一下
  if (compose.LastDownKey.value === "Enter") {
    return;
  }

  // 下面必然伴随着 blue，我们在 try_blur 里会增加一个延迟处理
  // 这里就把处理先记录到延迟里就好
  let val: any = null;
  const $input = api.getInputElement();
  const input = $input?.value;
  val = api.applyPipe(input);

  if (api.debug) console.log(`on_input_change(input:[${input}], val:[${val}])`);

  if (api.hasOptionsData.value && api.isOptionsDataShow.value) {
    api.DeferList.addDefer(async () => {
      await do_apply_input_change(api, val);
    });
  }
  // 放心处理change
  else {
    await do_apply_input_change(api, val);
  }
}

export async function do_apply_input_change(api: InputBoxApi, val: any) {
  if (api.debug) console.log(`do_apply_input_change(val:${val}) Begin`);
  // 提交
  await api.tryNotifyChange(val);
  // 清理一下
  api.clearLastHints();
  if (api.debug) console.log(`do_apply_input_change(val:${val}) End`);
}
