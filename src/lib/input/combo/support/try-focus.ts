import { InputComboProps } from "../input-combo-types";
import { InputComboApi } from "../use-input-combo-api";

export function try_focus(api: InputComboApi, _props: InputComboProps) {
  if (api.isFocused.value) {
    return;
  }
  if (api.isReadonly.value) {
    return;
  }

  api.setFocused(true);
}
