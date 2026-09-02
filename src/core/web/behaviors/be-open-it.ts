import _ from "lodash";
import { Dom } from "@site0/tijs";
import { OpenUrlOptions } from "../../../_type";

export function OpenUrl(url: string, options: OpenUrlOptions = {}) {
  let { target = "_blank", method = "GET", params = {}, delay = 100 } = options;
  if (!url) {
    return;
  }
  // 对于 url 带 query String 的
  let pos = url.indexOf("?");
  if (pos > 0) {
    let query_str = url.substring(pos + 1).trim();
    url = url.substring(0, pos).trim();
    const sp2 = new URLSearchParams(query_str);
    for (const [k, v] of sp2) {
      params[k] = v;
    }
  }

  // Join to DOM
  let $form = Dom.createElement({
    $p: document.body,
    tagName: "form",
    attrs: { target, method, action: url },
    props: { style: "display:none;" },
  }) as HTMLFormElement;
  
  // Add params
  _.forEach(params, (value, name) => {
    Dom.createElement({
      $p: $form,
      tagName: "input",
      props: {
        name,
        value,
        type: "hidden",
      },
    });
  });
  // await for a while
  _.delay(() => {
    // Submit it
    $form.submit();
    // Remove it
    Dom.remove($form);
  }, delay);
}
