import { InputComboProps } from "../input-combo-types";
import { InputComboApi } from "../use-input-combo-api";

export function on_click_top(api: InputComboApi, _props: InputComboProps) {
  api.setFocused(true);
}
