import { Tmpl, Vars } from "@site0/tijs";
import _ from "lodash";
import { computed } from "vue";
import { BoxHintCookingProps } from "./types-box-hint-cooking";
//--------------------------------------------------
export type BoxHintCooking = ReturnType<typeof useBoxHintCooking>;
//--------------------------------------------------
export function useBoxHintCooking(props: BoxHintCookingProps) {
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
