import _ from 'lodash';
import { computed } from 'vue';
import { CssUtils } from '../../../';
import { InputBoxProps,InputBoxApi } from './ti-input-box2-types';
import { BoxTipsFeature } from './use-box-tips';

export function useBoxAspect(
  props: InputBoxProps,
  _box: InputBoxApi,
  _tips: BoxTipsFeature
) {
  //--------------------------------------------------
  const TopClass = computed(() => CssUtils.mergeClassName(props.className));
  //--------------------------------------------------
  const TopStyle = computed(() => {
    return CssUtils.toStyle(props.style);
  });
  //--------------------------------------------------
  const PartMainClass = computed(() => {
    return {
      'is-focused': _box.isFocused.value,
      'show-tips': _tips.TipBoxStyleReady.value,
      'is-readonly': _box.isReadonly.value,
    };
  });
  //--------------------------------------------------
  const PartMainStyle = computed(() => {
    let re = _.assign(
      CssUtils.toStyle(props.partMainStyle),
      _tips.MainBoxStyle.value
    );
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
  const MainBodyStyle = computed(() => {
    let re = _.assign({}, props.mainBodyStyle);
    if (props.width) {
      re.width = props.width;
      re.flex = '0 0 auto';
    }
    if (props.hideBorder) {
      re.border = '0px';
    }
    return CssUtils.toStyle(re);
  });
  //--------------------------------------------------
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
    PartMainClass,
    PartMainStyle,
    MainBodyStyle,
    InputStyle,
  };
}
