import { GridFieldsInput, Vars } from "@site0/tijs";
import _ from "lodash";

export function gen_obj_form_fields(obj: Vars): Partial<GridFieldsInput>[] {
  let re = [] as Partial<GridFieldsInput>[];
  for (let key of _.keys(obj)) {
  }
  return re;
}
