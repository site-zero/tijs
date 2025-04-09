import _ from 'lodash';
import {
  IconTextEvents,
  IconTextFeature,
  IconTextOptions,
  IconTextState,
  UseIconEvents,
  UseTextEvents,
  useIconText,
} from '../../';
import { IconInput } from '../../../_type';
import { CssUtils, I18n } from '../../../core';
import { LabelTagsProps, LabelTagsSize } from './ti-LabelTags-types';
/*-------------------------------------------------------

                     Types

-------------------------------------------------------*/

/*-------------------------------------------------------

                     Events

-------------------------------------------------------*/
export type LabelTagsEvents = IconTextEvents;
/*-------------------------------------------------------

                     Props

-------------------------------------------------------*/

/*-------------------------------------------------------

                     Feature

-------------------------------------------------------*/
// export type LabelTagsFeature = {
//   state: IconTextState;
//   LabelTags: ComputedRef<IconTextFeature>;
//   Size: ComputedRef<LabelTagsSize>;
//   TopClass: ComputedRef<Vars>;
//   IconClass: ComputedRef<Vars>;
//   DisplayIcon: ComputedRef<IconInput>;
//   DisplayText: ComputedRef<string>;
//   hasLinks: ComputedRef<boolean>;
//   setIconHover: Callback1<boolean>;
//   setTextHover: Callback1<boolean>;
// };
/*-------------------------------------------------------

                     Options

-------------------------------------------------------*/
export type LabelTagsOptions = IconTextOptions<UseIconEvents, UseTextEvents> & {
  defaultIcon: IconInput;
  defaultText: string;
};

function getIconClass(LabelTags: IconTextFeature, Size: LabelTagsSize) {
  let css = CssUtils.mergeClassName({}, LabelTags.iconClass);
  let autoIconClass = {
    small: 's16',
    normal: 's32',
    big: 's64',
    large: 's128',
  }[Size];
  let keys = _.keys(css);
  for (let k of keys) {
    if (/^(s\d+)$/.test(k)) {
      return css;
    }
  }
  css[autoIconClass] = true;
  return css;
}
/*-----------------------------------------------------

                    Use Feature

                Better use it in computed
                
-----------------------------------------------------*/
export function useLabelTags(
  state: IconTextState,
  props: LabelTagsProps,
  options: LabelTagsOptions
) {
  //
  // 分析参数
  let { defaultIcon, defaultText } = options;

  const LabelTags = useIconText(state, props, options);
  const Size = props.size ?? ('B' == props.layout ? 'normal' : 'big');
  let hasLinks = !_.isEmpty(props.links);

  return {
    Size,
    ..._.pick(
      LabelTags,
      'showIcon',
      'showText',
      'OnClickIcon',
      'OnClickText',
      'setIconHover',
      'setTextHover'
    ),
    //.......................................
    TopClass: LabelTags.getClassName(
      props.className,
      `mode-${props.mode || 'fit'}`,
      `layout-${props.layout || 'A'}`,
      Size,
      _.isString(props.opacity) ? props.opacity : null,
      {
        'has-links': hasLinks,
      }
    ),
    //.......................................
    TopStyle: CssUtils.mergeStyles([
      LabelTags.style,
      _.isNumber(props.opacity) ? { opacity: props.opacity } : {},
    ]),
    //.......................................
    IconClass: getIconClass(LabelTags, Size),
    IconStyle: LabelTags.iconStyle,
    //.......................................
    TextClass: LabelTags.textClass,
    TextStyle: LabelTags.textStyle,
    //.......................................
    DisplayIcon: LabelTags.icon || defaultIcon,
    DisplayText: LabelTags.text || I18n.text(defaultText),
    //.......................................
    hasLinks,
    //.......................................
    setIconHover: function (hovred: boolean) {
      state.iconHovered = hovred;
    },
    setTextHover: function (hovred: boolean) {
      state.textHovered = hovred;
    },
  };
}
