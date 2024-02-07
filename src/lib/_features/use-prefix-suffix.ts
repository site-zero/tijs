import { Callback1, Vars } from '../../core';
import { IconInput, TiEventTrigger } from '../';
import {
  BusEmitProps,
  ClassStyleFeature,
  IconTextFeature,
  useIconText,
} from '.';
/*-------------------------------------------------------

                     Events

-------------------------------------------------------*/
export type PrefixSuffixEvents =
  | 'click-prefix-icon'
  | 'click-prefix-text'
  | 'click-suffix-icon'
  | 'click-suffix-text';
/*-------------------------------------------------------

                     State

-------------------------------------------------------*/
export type PrefixSuffixState = {
  prefixIconHovered: boolean;
  prefixTextHovered: boolean;
  suffixIconHovered: boolean;
  suffixTextHovered: boolean;
};
/*-------------------------------------------------------

                     Props

-------------------------------------------------------*/
export type PrefixSuffixFeatureProps = BusEmitProps & {
  //
  // Prefix.style
  //
  prefixClass?: any;
  prefixStyle?: Vars;
  prefixIconClass?: any;
  prefixIconStyle?: Vars;
  prefixTextClass?: any;
  prefixTextStyle?: Vars;
  //
  // Prefix
  //
  prefixIcon?: IconInput;
  prefixText?: string;
  prefixHoverIcon?: IconInput;
  prefixHoverText?: string;
  prefixIconClickable?: boolean;
  prefixTextClickable?: boolean;
  //
  // Suffix.style
  //
  suffixClass?: any;
  suffixStyle?: Vars;
  suffixIconClass?: any;
  suffixIconStyle?: Vars;
  suffixTextClass?: any;
  suffixTextStyle?: Vars;
  //
  // Suffix
  //
  suffixIcon?: IconInput;
  suffixText?: string;
  suffixHoverIcon?: IconInput;
  suffixHoverText?: string;
  suffixIconClickable?: boolean;
  suffixTextClickable?: boolean;
};
/*-------------------------------------------------------

                     Feature

-------------------------------------------------------*/
export type PrefixSuffixFeature = {
  Prefix: IconTextFeature & ClassStyleFeature;
  Suffix: IconTextFeature & ClassStyleFeature;
  setPrefixIconHover: Callback1<boolean>;
  setPrefixTextHover: Callback1<boolean>;
  setSuffixIconHover: Callback1<boolean>;
  setSuffixTextHover: Callback1<boolean>;
};
/*-----------------------------------------------------

                Use Feature
                
-----------------------------------------------------*/
export function usePrefixSuffix(
  state: PrefixSuffixState,
  props: PrefixSuffixFeatureProps,
  notify: TiEventTrigger<PrefixSuffixEvents, undefined>,
): PrefixSuffixFeature {
  return {
    //.......................................
    Prefix: useIconText(
      {
        iconHovered: state.prefixIconHovered,
        textHovered: state.prefixTextHovered,
      },
      {
        className: props.prefixClass,
        style: props.prefixStyle,
        icon: props.prefixIcon,
        text: props.prefixText,
        iconClass: props.prefixIconClass,
        iconStyle: props.prefixIconStyle,
        textClass: props.prefixTextClass,
        textStyle: props.prefixTextStyle,
        hoverIcon: props.prefixHoverIcon,
        hoverText: props.prefixHoverText,
        iconClickable: props.prefixIconClickable,
        textClickable: props.prefixTextClickable,
      },
      {
        notify,
        notifyIcon: ['click-prefix-icon', undefined],
        notifyText: ['click-prefix-text', undefined],
      },
    ),
    //.......................................
    Suffix: useIconText(
      {
        iconHovered: state.suffixIconHovered,
        textHovered: state.suffixTextHovered,
      },
      {
        className: props.suffixClass,
        style: props.suffixStyle,
        icon: props.suffixIcon,
        text: props.suffixText,
        iconClass: props.suffixIconClass,
        iconStyle: props.suffixIconStyle,
        textClass: props.suffixTextClass,
        textStyle: props.suffixTextStyle,
        hoverIcon: props.suffixHoverIcon,
        hoverText: props.suffixHoverText,
        iconClickable: props.suffixIconClickable,
        textClickable: props.suffixTextClickable,
      },
      {
        notify,
        notifyIcon: ['click-suffix-icon', undefined],
        notifyText: ['click-suffix-text', undefined],
      },
    ),
    //.......................................
    setPrefixIconHover: function (hovred: boolean) {
      state.prefixIconHovered = hovred;
    },
    setPrefixTextHover: function (hovred: boolean) {
      state.prefixTextHovered = hovred;
    },
    //.......................................
    setSuffixIconHover: function (hovred: boolean) {
      state.suffixIconHovered = hovred;
    },
    setSuffixTextHover: function (hovred: boolean) {
      state.suffixTextHovered = hovred;
    },
    //.......................................
  };
}
