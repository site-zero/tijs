import { InputBoxApi } from "../ti-input-box3-types";

export async function try_update_by_input(api: InputBoxApi, input: string) {
  // 无需加载
  if (!api.hasOptionsData.value) {
    return;
  }
  // 首先清理一下当前值
  api.setCurrentItem(null);

  // 为了不让 Input 框的内容弹跳，我需要预先设置 LastHint
  // 否则如果用户删空了Input， DisplayText 计算会返回 LastHint(旧值)
  // 直到 defer change 被 apply 了，才会更新 LastHint 为当前值
  // 输入框又会清空
  // 看到的现象就是，用户删空了输入框，但是输入框里面瞬间会恢复旧值
  // 然后 500ms 后，会再度变成空
  // 500ms 内用户如果再输入点什么，就会是 `旧值+新值`
  // 这会让用户非常的困扰，非常的不符合他的预期
  api.setLastHint(input);
  if (api.debug) console.log(`try_update_by_input(input:[${input}])`);

  // 整理值
  if (api.shouldDelayTipReload.value) {
    api.debounceTryReloadOptionsDataAndLookupItem(input);
  } else {
    await api.tryReloadOptionsDataAndLookupItem(input);
  }
}
