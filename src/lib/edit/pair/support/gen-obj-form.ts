import { FieldRefer, FieldValueType, getFieldTypeByValue, GridFieldsInput, InputBoxProps, InputNumProps, ToggleProps, Vars } from "@site0/tijs";
import _ from "lodash";

const DEFAULT_FIELDS: Record<FieldValueType, FieldRefer> = {
  "Boolean": {
    type:"Boolean",
    comType:"TiToggle",
    comConf: {} as ToggleProps
  },
  "Number": {
    type:"Number",
    comType:"TiInputNum",
    comConf: {} as InputNumProps
  },
  "Float": {
    type:"Number",
    comType:"TiInputNum",
    comConf: {

    } as InputNumProps
  },
  "String": {
    type:"String",
    comType:"TiInput",
    comConf: {} as InputBoxProps
  },
  "Array": {
    type:"Array",
    comType:"TiInputArray",
    comConf: {} as InputArrayProps
  },
};

export function gen_obj_form_fields(obj: Vars, defaultFields?: Record<FieldValueType, FieldRefer>): Partial<GridFieldsInput>[] {
  let re = [] as Partial<GridFieldsInput>[];
  for (let key of _.keys(obj)) {
    let val = obj[key];
    let vtp = getFieldTypeByValue(val);
    re.push({
      field: key,
      value: val,
    });
  }
  return re;
}
