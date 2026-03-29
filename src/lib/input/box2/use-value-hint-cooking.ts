import _ from "lodash";
import { computed } from "vue";
import { ValueHintCookingProps } from "../../";
import { Vars } from "../../../_type";
import { Tmpl } from "../../../core";
//--------------------------------------------------
export type ValueHintCooking = ReturnType<typeof useValueHintCooking>;
//--------------------------------------------------
export function useValueHintCooking(props: ValueHintCookingProps) {
  //--------------------------------------------------
  const _render_hint = computed(() => {
    if (props.renderHint) {
      if (_.isString(props.renderHint)) {
        let t = Tmpl.parse(props.renderHint);
        return (vars: Vars) => {
          return t.render(vars);
        };
      }
      return props.renderHint;
    }
  });

  //--------------------------------------------------
  return (hint: string) => {
    if (_render_hint.value) {
      let v_in_str = hint ?? "";
      let hvars = _.cloneDeep(props.hintVars ?? {});
      hvars.hint = v_in_str;
      return _render_hint.value(hvars) ?? v_in_str;
    }
    return hint;
  };
}
//--------------------------------------------------
