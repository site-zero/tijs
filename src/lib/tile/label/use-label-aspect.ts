import _ from 'lodash';
import { computed } from 'vue';
import { CssUtils } from '../../../core';
import { LabelProps } from './ti-label-types';

export function useLabelAspect(props: LabelProps) {
  //--------------------------------------------------
  const TopClass = computed(() => {
    let hasValue = !_.isNil(props.value);
    return CssUtils.mergeClassName(props.className, {
      [`is-${props.type}`]: props.type ? true : false,
      'has-value': hasValue,
      'nil-value': !hasValue,
      'is-nowrap': props.nowrap,
    });
  });
  //--------------------------------------------------
  const TopStyle = computed(() => {
    let re = _.assign({}, props.style);
    if (props.width) {
      re.width = props.width;
    }
    re = CssUtils.toStyle(re);
    if (props.boxFontSize) {
      re['--box-fontsz'] = `var(--ti-fontsz-${props.boxFontSize})`;
    }
    if (props.boxPadding) {
      re['--box-padding'] = `var(--ti-box-pad-${props.boxPadding})`;
    }
    if (props.boxRadius) {
      re['--box-radius'] = `var(--ti-measure-r-${props.boxRadius})`;
    }
    if (props.align) {
      re['--box-align'] = props.align;
    }
    if (props.type) {
      _.assign(re, {
        '--box-color-border': `var(--ti-color-${props.type}-b)`,
        '--box-color-text': `var(--ti-color-${props.type})`,
        //'--box-color-bg': `var(--ti-color-${props.type}-r)`,
        '--box-color-focus-border': `var(--ti-color-${props.type})`,
        '--box-color-focus-text': `var(--ti-color-${props.type})`,
        '--box-color-focus-bg': `var(--ti-color-${props.type}-r)`,
      });
    }
    return re;
  });
  //--------------------------------------------------
  return {
    TopClass,
    TopStyle,
  };
}
