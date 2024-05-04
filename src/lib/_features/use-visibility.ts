import { FuncA1, Match, Vars, VisibilityProps } from '../../core';

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
