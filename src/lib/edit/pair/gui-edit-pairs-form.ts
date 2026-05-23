import { Vars } from "@site0/tijs";
import _ from "lodash";
import { EditPairsProps } from "./edit-pairs-types";
import { gen_obj_form_fields } from "./support";
import { EditPairsApi } from "./use-edit-pairs-api";

export function useEditPairsForm(
  props: EditPairsProps,
  api: EditPairsApi
): Vars {
  //-----------------------------------------------------
  // Tabs Form
  //-----------------------------------------------------
  if (api.FormMode.value == 'tabs') {

  }
  //-----------------------------------------------------
  // Group Form
  //-----------------------------------------------------
  if (api.FormMode.value == 'group') {

  }
  //-----------------------------------------------------
  // Simple Form
  //-----------------------------------------------------
  return _.assign({
    layoutHint: 1,
    maxFieldNameWidth: 80,
    bodyPartGap: "s",
    style: { padding: "var(--ti-gap-m)" },
    fields: gen_obj_form_fields(api.ValueObj.value, {
      titles: props.titles,
      icons: props.icons,
      tips: props.tips,
      fields: props.fields,
      defaultFields: props.defaultFields,
      keyFilter: props.keepTab,
      path: []
    })
  }, props.defaultFormConf)
}