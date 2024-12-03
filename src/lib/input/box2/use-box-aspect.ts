import _ from 'lodash';
import { computed } from 'vue';
import { CssUtils } from '../../../';
import { InputBox2Props } from './ti-input-box2-types';
import { BoxTipsFeature } from './use-box-tips';
import { InputBox2Feature } from './use-input-box2';

export function useBoxAspect(
  props: InputBox2Props,
  _box: InputBox2Feature,
  _tips: BoxTipsFeature
) {
  //--------------------------------------------------
  const TopClass = computed(() =>
    CssUtils.mergeClassName(props.className, {
      'is-focused': _box.isFocused.value,
      'show-tips': _tips.TipBoxStyleReady.value,
      [`align-${props.align}`]: props.align ? true : false,
    })
  );
  //--------------------------------------------------
  const TopStyle = computed(() => {
    let re = _.assign({}, props.style, _tips.BoxMainStyle.value);
    if (props.hideBorder) {
      re.border = '0px';
    }
    if (props.boxFontSize) {
      re['--box-fontsz'] = `var(--ti-fontsz-${props.boxFontSize})`;
    }
    if (props.boxPadding) {
      re['--box-padding'] = `var(--ti-box-pad-${props.boxPadding})`;
    }
    if (props.boxRadius) {
      re['--box-radius'] = `var(--ti-measure-r-${props.boxRadius})`;
    }
    if(props.logicType){
      _.assign(re, {
        '--box-color-border': `var(--ti-color-${props.logicType})`,
        '--box-color-text': `var(--ti-color-${props.logicType})`,
        '--box-color-bg': `var(--ti-color-${props.logicType})`,
      })
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
  return {
    TopClass,
    TopStyle,
    InputStyle,
  };
}
