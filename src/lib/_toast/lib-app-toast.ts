import _ from "lodash";
import { createApp } from "vue";
import { PopPosition } from "../../_type/core-types";
import { Dom } from "../../core";
import { ToastProps } from "./ti-toast-types";
import TiToast from "./TiToast.vue";

export async function Toast(content: string, setup: ToastProps = {}) {
  let props = _.assign({ content }, setup);
  return openToast(props);
}

export async function openToast(props: ToastProps) {
  // 确保已经存在了对应的 DOM  结构
  const pos = props.position || "top";
  let $toa = prepare_toast_dom(pos);

  // 准备异步返回
  return new Promise<void>((_resolve) => {
    // 创建 Vue 实例
    const app = createApp(TiToast, {
      ...props,
      releaseDom: () => {
        app.unmount();
        $toa.remove();
      },
    });
    // 挂载 Vue 实例
    app.mount($toa);
  });
}

/**
 * 需要确保网页的结构是
 *
 * ```bash
 * <body>
 * |-- div.ti-toast-gasket
 * |   |-- div.toast-con at-left
 * |   |-- div.toast-con at-right
 * |   |-- div.toast-con at-top
 * |   |   |-- <TiToast>
 * |   |-- div.toast-con at-bottom
 * |   |-- div.toast-con at-center
 * |   |-- div.toast-con at-free
 * |   |-- div.toast-con at-left-top
 * |   |-- div.toast-con at-right-top
 * |   |-- div.toast-con at-bottom-left
 * |   |-- div.toast-con at-bottom-right"
 * ```
 */
function prepare_toast_dom(pos: PopPosition) {
  let $body = document.body as HTMLBodyElement;
  let $gask = Dom.find(":scope > .ti-toast-gasket", $body);
  if (!$gask) {
    $gask = Dom.createElement({
      $p: $body,
      tagName: "div",
      className: "ti-toast-gasket",
    });
  }
  let $con = Dom.find(`:scope > .toast-con.at-${pos}`, $gask);
  if (!$con) {
    $con = Dom.createElement({
      $p: $gask,
      tagName: "div",
      className: `toast-con at-${pos}`,
    });
  }

  let $toa = Dom.createElement({
    $p: $con,
    tagName: "div",
    className: `toast-item`,
  });

  return $toa;
}
