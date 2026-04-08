import { InputBoxApi } from "../ti-input-box3-types";

/**
 *
 * @param api
 * @param input
 */
export function try_submit_change(api: InputBoxApi) {
  const $input = api.getInputElement();
  const input = $input?.value;
  let val = api.applyPipe(input);
  api.notifyChange(val);
}
