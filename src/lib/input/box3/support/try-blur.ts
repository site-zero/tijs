import _ from "lodash";
import { InputBoxApi } from "../ti-input-box3-types";

/**
 * Blur 行为是绑定在<input @blur.stop>的事件监听上的
 * 1. Tab 失焦： 但是已经提前提交了 value，所以值不会丢失
 * 2. Click Mask 失焦： 我就是希望值丢失
 * 3. Escape 失焦： 我就是希望值丢失
 * 4. Icon 失焦: 我不在乎值是否丢失
 * 5. Select Item 失焦: 会导致问题，因为失焦会让 List 控件被注销
 *    因此我根本没机会得到 select 事件
 * 为此，我的策略需要做的复杂一点：
 * 1. 如果没有 options data，则放心大胆的失焦
 * 2. 否则，我并不知道本次失焦是不是 Select Item 导致的。因此我需要注册一个延迟处理
 * 3. 直到 select 事件被触发，在 try_select_option_item 会尝试调用这个延迟处理，因为
 *    我不知道要多久（大约在 100-200ms）才会触发 select 事件。我认为这是浏览器的 click
 *    事件的特性导致的，它必须完整捕获了一个 mouse down/up 的历程
 *    这个时间是用户按下和抬起鼠标的时间间隔决定的，因此我最好在 try_select_option_item
 *    里消费这个延迟处理函数
 * 4. 为了保底，我还需要注册一个500ms 的定时器，确保这个延迟处理函数一定会被调用
 */
export function try_blur(api: InputBoxApi) {
  if (api.debug) console.log("try_blur");
  api.setFocused(false);
  if (api.hasOptionsData.value && api.isOptionsDataShow.value) {
    api.DeferList.addDefer(() => {
      do_box_blur(api);
    });
    _.delay(() => api.DeferList.tryDeferList(), 500);
  }
  // 放心处理失焦
  else {
    do_box_blur(api);
  }
}

function do_box_blur(api: InputBoxApi) {
  if (api.debug) console.log("do_blur");
  api.setOptionsStatus("hide");
  api.clearLastHints();
  //await api.reloadCurrentItem();
}
