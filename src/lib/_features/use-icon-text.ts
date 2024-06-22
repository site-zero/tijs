import _ from 'lodash';
import { TextShowProps, useClassStyle } from '.';
import {
  Callback,
  Callback1,
  CommonProps,
  CssUtils,
  I18n,
  IconInput,
  Vars,
} from '../../core';
export type IconTextState = {
  iconHovered?: boolean;
  textHovered?: boolean;
};
/*-------------------------------------------------------

                     Events

-------------------------------------------------------*/
export type UseIconEvents = 'click-icon';
export type UseTextEvents = 'click-text';
export type IconTextEvents = UseIconEvents | UseTextEvents;
/*-------------------------------------------------------

                     Props

-------------------------------------------------------*/
export type IconTextProps = Pick<CommonProps, 'className'> &
  Pick<TextShowProps, 'autoI18n'> & {
    style?: Vars;
    icon?: IconInput;
    text?: string;
    hoverIcon?: IconInput;
    hoverText?: string;
    iconClass?: any;
    iconStyle?: Vars;
    textClass?: any;
    textStyle?: Vars;
    iconClickable?: boolean;
    textClickable?: boolean;
  };
/*-------------------------------------------------------

                     Feature

-------------------------------------------------------*/
export type IconTextFeature = {
  className?: Vars;
  style?: Vars;
  show?: boolean;
  showIcon: boolean;
  showText: boolean;
  canHoverIcon: boolean;
  canHoverText: boolean;
  icon?: IconInput;
  text?: string;
  getClassName: {
    (className?: string, ...others: any[]): Vars;
  };
  iconClass?: Vars;
  iconStyle?: Vars;
  textClass?: Vars;
  textStyle?: Vars;
  OnClickIcon: Callback;
  OnClickText: Callback;
  setIconHover: Callback1<boolean>;
  setTextHover: Callback1<boolean>;
};
/*-------------------------------------------------------

                     Options

-------------------------------------------------------*/
export type IconTextOptions<I extends string, T extends string> = {
  emit?: (event: I | T) => void;
  emitIcon?: I;
  emitText?: T;
};
/*-----------------------------------------------------

                Use Feature
                
-----------------------------------------------------*/
/**
 * 如果想获得响应性，本特性推荐在 computed 里使用
 */
export function useIconText<I extends string, T extends string>(
  state: IconTextState,
  props: IconTextProps,
  options: IconTextOptions<I, T> = {}
): IconTextFeature {
  let { emit, emitIcon, emitText } = options;

  //
  // 计算结果
  //
  let showIcon = !_.isEmpty(props.icon);
  let showText = !_.isEmpty(props.text);
  let canHoverIcon = showIcon && (props.iconClickable ?? false);
  let canHoverText = showText && (props.textClickable ?? false);

  let icon = props.icon;
  if (showIcon && state.iconHovered && props.hoverIcon) {
    icon = props.hoverIcon;
  }
  let text = props.text;
  if (showText && state.textHovered && props.hoverText) {
    text = props.hoverText;
  }
  if (text && props.autoI18n) {
    text = I18n.text(text);
  }

  // 准备动态类型计算函数
  let evalClassAndStyle = (
    info?: Pick<IconTextFeature, 'canHoverIcon' | 'canHoverText'>
  ) => {
    //console.log("canHoverIcon", info.canHoverIcon);
    return {
      'hover-icon': info?.canHoverIcon,
      'hover-text': info?.canHoverText,
    };
  };

  let _class_style = useClassStyle(props, evalClassAndStyle, {
    canHoverIcon,
    canHoverText,
  });

  let icon_class_style = useClassStyle({
    className: props.iconClass,
    style: props.iconStyle,
  });

  let text_class_style = useClassStyle({
    className: props.textClass,
    style: props.textStyle,
  });
  //
  // 返回特性
  //
  return {
    ..._class_style,
    show: showIcon || showText,
    showIcon,
    showText,
    canHoverIcon,
    canHoverText,
    icon,
    text,
    iconClass: icon_class_style.className,
    iconStyle: icon_class_style.style,
    textClass: text_class_style.className,
    textStyle: text_class_style.style,
    getClassName(className?: string, ...others: any[]) {
      return CssUtils.mergeClassName(className, ...others, {
        'hover-icon': canHoverIcon,
        'hover-text': canHoverText,
      });
    },

    OnClickIcon: function () {
      if (showIcon && canHoverIcon && emit && emitIcon) {
        emit(emitIcon);
      }
    },
    OnClickText: function () {
      if (showText && canHoverText && emit && emitText) {
        emit(emitText);
      }
    },
    setIconHover: function (hovred: boolean) {
      console.log('setIconHover', hovred)
      if (canHoverIcon) {
        state.iconHovered = hovred;
      }
    },
    setTextHover: function (hovred: boolean) {
      if (canHoverText) {
        state.textHovered = hovred;
      }
    },
  };
}
