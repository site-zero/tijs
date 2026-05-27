import { FormField, FormProps, TabsFormProps } from "@site0/tijs";
import _ from "lodash";
import { EditPairsProps } from "./edit-pairs-types";
import { build_obj_form_fields, group_obj_fields } from "./support";
import { EditPairsApi } from "./use-edit-pairs-api";

export function useEditPairsForm(props: EditPairsProps, api: EditPairsApi) {
  let _flat_fields: FormField[] = build_obj_form_fields(props, api);
  let _grp_fields = group_obj_fields(_flat_fields, props.groups);

  // Simple Form
  let re: FormProps | TabsFormProps = _.assign(
    {
      layoutHint: 1,
      maxFieldNameWidth: 80,
      bodyPartGap: "s",
      style: { padding: "var(--ti-gap-m)" },
      fields: _grp_fields,
      data: api.ValueObj.value,
      changeMode: "all",
    } as FormProps,
    props.formConf
  );

  // Tabs Form
  if (api.FormMode.value == "tabs") {
    _.assign(re, props.tabsConf);
  }

  // 搞定
  return re;
}
