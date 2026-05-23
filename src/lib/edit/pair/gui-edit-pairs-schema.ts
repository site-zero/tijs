import { LayoutSchema, TabsProps } from "@site0/tijs";
import { computed } from "vue";
import { EditPairsProps } from './edit-pairs-types';
import { useEditPairsForm } from "./gui-edit-pairs-form";
import { get_tab_items } from "./support";
import { EditPairsApi } from "./use-edit-pairs-api";

export function useEditPairsSchema(
  props: EditPairsProps,
  api: EditPairsApi
): LayoutSchema {
  //-----------------------------------------------------
  const TabItems = computed(() => get_tab_items(props, api));
  //-----------------------------------------------------
  return {
    tabs: {
      comType: "TiTabs",
      comConf: {
        options: TabItems.value,
      } as TabsProps
    },
    main: {
      comType: "TiForm",
      comConf: useEditPairsForm(props, api)
    }
  };
}