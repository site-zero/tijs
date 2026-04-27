import { useBoxComposition } from "@site0/tijs";
import { InputComboApi } from "../use-input-combo-api";
import { do_submit_change, try_show_options, try_update_by_input } from "./";

export function create_combo_composition(api: InputComboApi) {
  return useBoxComposition(
    { canInput: true },
    {
      isReadonly: () => api.isReadonly.value,
      onChange: (val: string) => {
        try_update_by_input(api, val);
      },
      funcKeys: {
        ArrowLeft: async () => {},
        ArrowRight: async () => {},
        ArrowUp: async () => {
          let offset = api.isOptionsDataShow.value ? -1 : 0;
          try_show_options(api);
          if (offset) {
            api.clearLastHints();
            let nextIt = api.getNextOptionItem(offset);
            api.setCurrentItem(nextIt);
          }
        },
        ArrowDown: async () => {
          let offset = api.isOptionsDataShow.value ? 1 : 0;
          try_show_options(api);
          if (offset) {
            api.clearLastHints();
            let nextIt = api.getNextOptionItem(offset);
            api.setCurrentItem(nextIt);
          }
        },
        Tab: async () => {
          if (api.debug) console.log("compose<Tab>");
          do_submit_change(api);
          api.setFocused(false);
          api.setOptionsStatus("hide");
          api.clearLastHints();
        },
        Escape: async () => {
          if (api.debug) console.log("compose<Escape>");
          api.setOptionsStatus("hide");
        },
        Enter: async () => {
          if (api.debug) console.log("compose<Enter>");
          do_submit_change(api);
          api.setOptionsStatus("hide");
        },
      },
    }
  );
}
