import { isAsyncFunc } from "@site0/tijs";
import { ref } from "vue";

const debug = false;

export function useDeferList() {
  /**
   * 譬如在 InputBox 的下面事件中
   *  - blur
   *  - on_input_change
   * 有可能是下面操作导致的:
   * 1. 点击输入框以外区域
   *    > 我们需要延迟的处理所有的 defer
   * 2. 点击选项: 会先触发 change/blur,
   *    > 我们需要保留 options 的 DOM，为此 change/blur 的操作会被 defer
   *    > 在 try_select_option_item 我们可以有机会无视这些 defer
   * 3. Enter 键: 可以立即处理
   * 4. Tab 键: 可以立即处理
   */
  const _defer_list = ref<Function[]>([]);
  //-----------------------------------------------------
  function addDefer(deferFn: Function) {
    _defer_list.value.push(deferFn);
    if (debug) console.log("addDefer: len=", _defer_list.value.length);
  }
  //-----------------------------------------------------
  function clearDefer() {
    _defer_list.value = [];
    if (debug) console.log("clearDefer: len=", _defer_list.value.length);
  }
  //-----------------------------------------------------
  async function tryDeferList() {
    for (let deferFn of _defer_list.value) {
      if (isAsyncFunc(deferFn)) {
        await deferFn();
      } else {
        deferFn();
      }
    }
    _defer_list.value = [];
  }
  //-----------------------------------------------------
  return {
    addDefer,
    clearDefer,
    tryDeferList,
  };
}
