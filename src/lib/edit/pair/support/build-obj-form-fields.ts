import { FormField, Vars } from "@site0/tijs";
import _ from "lodash";
import { EditPairsProps } from "../edit-pairs-types";
import { EditPairsApi } from "../use-edit-pairs-api";
import { gen_obj_form_field } from "./gen-obj-form-field";

export function build_obj_form_fields(
  props: EditPairsProps,
  api: EditPairsApi
): FormField[] {
  let obj = api.ValueObj.value;
  let fields: FormField[] = [];
  __join_fields_by_obj(fields, obj, props);
  return fields;
}

function __join_fields_by_obj(
  fields: FormField[],
  obj: Vars,
  props: EditPairsProps,
  path: string[] = []
) {
  let keys = Object.keys(obj);
  let maxDepth = props.fieldDepth || 0;
  for (let key of keys) {
    let depth = path.length;
    let val = obj[key];
    // 递归
    if (maxDepth <= 0 || depth < maxDepth) {
      if (_.isPlainObject(val)) {
        __join_fields_by_obj(fields, val, props, [...path, key]);
        continue;
      }
    }
    // 生成字段
    let fld = gen_obj_form_field(key, val, path, props);
    fields.push(fld);
  }
}
