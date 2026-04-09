import { BoxCompositionProps, useBoxComposition } from "../_fea";
import { InputBoxApi } from "../ti-input-box3-types";
import { try_show_options, try_submit_change, try_update_by_input } from "./";

export function create_box_composition(
  props: BoxCompositionProps,
  api: InputBoxApi
) {
  return useBoxComposition(props, {
    isReadonly: () => api.isInputReadonly.value,
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
          let nextIt = api.getNextOptionItem(offset);
          api.setCurrentItem(nextIt);
        }
      },
      ArrowDown: async () => {
        let offset = api.isOptionsDataShow.value ? 1 : 0;
        try_show_options(api);
        if (offset) {
          let nextIt = api.getNextOptionItem(offset);
          api.setCurrentItem(nextIt);
        }
      },
      Tab: async () => {
        try_submit_change(api);
        api.setFocused(false);
        api.setOptionsStatus("hide");
      },
      Escape: async () => {
        api.setFocused(false);
        api.setOptionsStatus("hide");
        await api.reloadCurrentItem();
      },
      Enter: async () => {
        try_submit_change(api);
      },
    },
  });
}
