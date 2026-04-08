import { InputBoxApi } from "../ti-input-box3-types";

export async function try_update_by_input(api: InputBoxApi, input: string) {
  let val = api.applyPipe(input);
  //api.notifyChange(val);
}
