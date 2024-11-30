import _ from 'lodash';
import { computed } from 'vue';
import { Vars } from '../../../_type';
import { Tmpl } from '../../../core';
//--------------------------------------------------
export type ValueHintCooking = ReturnType<typeof useValueHintCooking>;
//--------------------------------------------------
export type ValueHintCookingProps = {
  /**
   * 动态渲染提示信息的上下文环境
   */
  hintVars?: Vars;

  /**
   * 有时候，我们不想让用户输入的字符串简单的传递给 dict.query 去查询。
   * 我们需要给 hint 字符串编制更多的信息。
   *
   * 譬如一个选择框，输入省份的 code 进行查询，但是我们还想加入国家这个约束条件。
   * 我们可以通过 boxVars 接受国家的代码，譬如 `{country:'CN'}`，
   * 当我们输入 G 的时候，我们希望传递给后端 `G:CN` 这样的字符串。
   *
   * 因此我们就要用到这个配置，将其设置为 '${hint}:${country}' 就能在每次查询
   * 的时候根据这个字符串模板进行渲染。
   * 它的上下文，永远是 `{...hintVars, hint:'你输入的内容'}`。
   *
   * > ！因此不要为 hintVars 设置 'hint' 这个名称的变量，因为会被你输入的内容重载掉。
   *
   * 如果你指定的是一个自定义函数，那你就能做的更加细腻
   */
  renderHint?: string | ((vars: Vars) => string);
};
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
      let v_in_str = hint ?? '';
      let hvars = _.cloneDeep(props.hintVars ?? {});
      hvars.hint = v_in_str;
      return _render_hint.value(hvars) ?? v_in_str;
    }
    return hint;
  };
}
//--------------------------------------------------
