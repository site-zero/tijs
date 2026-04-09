import { InputBoxApi } from "../ti-input-box3-types";

export async function try_update_by_props(api: InputBoxApi) {
  await api.reloadCurrentItem();
}
