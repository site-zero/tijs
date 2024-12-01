import _ from 'lodash';
import { computed } from 'vue';
import { CssUtils } from '../../../';
import { InputBox2Props } from './ti-input-box2-types';

export function useBoxAspect(props: InputBox2Props) {
  //--------------------------------------------------
  const TopClass = computed(() =>
    CssUtils.mergeClassName(props.className, {
      [`align-${props.align}`]: props.align ? true : false,
    })
  );
  //--------------------------------------------------
  const TopStyle = computed(() => {
    let re = _.assign({}, props.style);
    if (props.hideBorder) {
      re.border = '0px';
    }
    if (props.boxSize) {
      re['--box-size'] = `var(--ti-fontsz-${props.boxSize})`;
    }
    if (props.boxPadding) {
      re['--box-padding'] = `var(--ti-bpx-pad-${props.boxPadding})`;
    }
    if (props.boxRadius) {
      re['--box-radius'] = `var(--ti-measure-r-${props.boxSize})`;
    }
    return re;
  });
  //--------------------------------------------------
  const InputStyle = computed(() => {
    return CssUtils.toStyle(props.inputStyle);
  });
  //--------------------------------------------------
  // 输出
  //--------------------------------------------------
  return  {
    TopClass,
    TopStyle,
    InputStyle,
  }
}
