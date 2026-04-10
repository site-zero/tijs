import { InputBoxApi } from "../ti-input-box3-types";

const debug = false;

export async function try_update_by_props(api: InputBoxApi) {
  if (debug)
    console.log(
      `try_update_by_props: props=${JSON.stringify(api.PropsRawValue.value)}`
    );
  await api.reloadCurrentItem();
}
