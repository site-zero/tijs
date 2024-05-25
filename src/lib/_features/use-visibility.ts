import _ from 'lodash';
import { Match, Vars, VisibilityProps } from '../../core';

/*-------------------------------------------------------

                     Feature

-------------------------------------------------------*/
export type VisibilityFeature = {
  isDisabled: (vars: Vars) => boolean;
  isHidden: (vars: Vars) => boolean;
};
/*-------------------------------------------------------

                     Methods

-------------------------------------------------------*/
function buildMatcher(
  traceName: string,
  whenYes: any,
  whenNo: any,
  dft: boolean
) {
  if (/^id.isDisabled/.test(traceName)) {
    console.log('buildMatcher', traceName);
  }
  let testYes = !_.isNil(whenYes) ? Match.parse(whenYes) : undefined;
  let testNo = !_.isNil(whenNo) ? Match.parse(whenNo) : undefined;
  return (data: Vars) => {
    if (/^id.isDisabled/.test(traceName) && !_.isEmpty(data)) {
      console.log(traceName, data);
    }
    // 全都声明了
    if (testYes && testNo) {
      if (testYes.test(data)) {
        return true;
      }
      if (testNo.test(data)) {
        return false;
      }
      return dft;
    }

    // 仅仅声明了一个条件: Yes
    if (testYes) {
      if (testYes.test(data)) {
        return true;
      }
      return false;
    }

    // 仅仅声明了一个条件: No
    if (testNo) {
      if (testNo.test(data)) {
        return false;
      }
      return true;
    }

    return dft;
  };
}
/*-------------------------------------------------------

                   User Feature

-------------------------------------------------------*/
export function useVisibility(
  props: VisibilityProps,
  traceName: string
): VisibilityFeature {
  return {
    isDisabled: buildMatcher(
      `${traceName}.isDisabled`,
      props.disabled,
      props.enabled,
      false
    ),
    isHidden: buildMatcher(
      `${traceName}.isHidden`,
      props.hidden,
      props.visible,
      false
    ),
  };
}
