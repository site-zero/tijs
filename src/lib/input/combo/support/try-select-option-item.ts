import { ListSelectEmitInfo } from "@site0/tijs";
import { InputComboApi } from "../use-input-combo-api";

export async function try_select_option_item(
  api: InputComboApi,
  payload: ListSelectEmitInfo
) {
  if (api.debug) console.log("try_select_option_item", payload);
  let val = payload.currentId ?? null;
  if (payload.current) {
    api.setCurrentItem(payload.current);
  } else {
    api.setCurrentItem(undefined);
  }

  // 既然到了这里，显然我们需要无视所有的延迟处理
  // 我们直接给出最直接的操作，这样会比较快
  api.DeferList.clearDefer();

  // 应用值并清理状态
  await api.tryNotifyChange(val);
  api.setOptionsStatus("hide");
  api.clearLastHints();
}
