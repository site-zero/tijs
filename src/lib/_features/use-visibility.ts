import { FuncA1, Match, Vars } from '../../core';

/*-------------------------------------------------------

                        Props

-------------------------------------------------------*/
export type VisibilityProps = {
  /**
   * 字段是否可见，是一个 `TiMatch` 匹配 `FormContext`
   */
  visible?: any;
  /**
   * 字段是否隐藏，是一个 `TiMatch` 匹配 `FormContext`
   */
  hidden?: any;
  /**
   * 字段是否不可用，是一个 `TiMatch` 匹配 `FormContext`
   */
  disabled?: any;
  /**
   * 字段是否启用，是一个 `TiMatch` 匹配 `FormContext`
   */
  enabled?: any;
};
/*-------------------------------------------------------

                     Feature

-------------------------------------------------------*/
export type VisibilityFeature = {
  isDisabled: FuncA1<Vars, boolean>;
  isHidden: FuncA1<Vars, boolean>;
};
/*-------------------------------------------------------

                     Methods

-------------------------------------------------------*/
function buildMatcher(whenYes: any, whenNo: any, dft: boolean) {
  let testYes = whenYes ? Match.parse(whenYes) : undefined;
  let testNo = whenNo ? Match.parse(whenNo) : undefined;
  return (data: Vars) => {
    if (testYes && testYes.test(data)) {
      return true;
    }
    if (testNo && testNo.test(data)) {
      return false;
    }
    return dft;
  };
}
/*-------------------------------------------------------

                   User Feature

-------------------------------------------------------*/
export function useVisibility(props: VisibilityProps): VisibilityFeature {
  return {
    isDisabled: buildMatcher(props.disabled, props.enabled, false),
    isHidden: buildMatcher(props.hidden, props.visible, false),
  };
}
