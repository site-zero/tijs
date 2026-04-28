import { InputComboApi } from "../use-input-combo-api";

const debug = true;

export async function try_update_by_props(api: InputComboApi) {
  if (debug)
    console.log(
      `try_update_by_props: props=${JSON.stringify(api.PropsRawValue.value)}`
    );
  api.setCurrentItem(undefined);
}
