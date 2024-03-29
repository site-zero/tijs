import {
  BusEmitProps,
  ClassStyleFeature,
  IconTextFeature,
  useIconText,
} from '.';
import { IconInput } from '../';
import { Callback1, Vars } from '../../core';
/*-------------------------------------------------------

                     Events

-------------------------------------------------------*/
export type PrefixSuffixEvents =
  | 'click-prefix-icon'
  | 'click-prefix-text'
  | 'click-suffix-icon'
  | 'click-suffix-text';

export type PrefixSuffixEmits = {
  (event: PrefixSuffixEvents): void;
};
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
  emit: PrefixSuffixEmits
): PrefixSuffixFeature {
  return {
    //.......................................
    Prefix: useIconText<'click-prefix-icon', 'click-prefix-text'>(
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
        emit,
        emitIcon: 'click-prefix-icon',
        emitText: 'click-prefix-text',
      }
    ),
    //.......................................
    Suffix: useIconText<'click-suffix-icon', 'click-suffix-text'>(
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
        emit,
        emitIcon: 'click-suffix-icon',
        emitText: 'click-suffix-text',
      }
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
