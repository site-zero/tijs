import { CommonProps, Convertor, CssUtils, Vars } from '../../core';

export type ClassStyleFeatureProps = Pick<CommonProps, 'className'> & {
  style?: Vars;
};

export type ClassStyleFeature = {
  className?: Vars;
  // @see runtime-dom.d.ts#StyleValue
  style?: Vars;
};

/**
 * 如果想获得响应性，本特性推荐在 computed 里使用
 */
export function useClassStyle<T>(
  props: ClassStyleFeatureProps,
  evalClass?: Convertor<T | undefined, any>,
  payload?: T
): ClassStyleFeature {
  return {
    className: CssUtils.mergeClassName(
      props.className,
      evalClass ? evalClass(payload) : undefined
    ),
    style: CssUtils.toStyle(props.style),
  };
}
