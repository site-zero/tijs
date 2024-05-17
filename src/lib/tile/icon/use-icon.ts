import _ from 'lodash';
import { ComputedRef } from 'vue';
import { CssUtils, FuncSet, IconObj, Vars, colorToStr } from '../../../core';
import { IconProps } from './icon-props';

export function getIconStyle(props: IconProps, icon: ComputedRef<IconObj>) {
  // 通过 props 获取的属性
  let style = {} as Vars;

  (
    ({
      emoji: () => {
        _.assign(
          style,
          {
            fontSize: props.fontSize,
            color: colorToStr(props.color),
            //filter: 'grayscale(100%) contrast(200%)'
          },
          props.fontStyle
        );
      },
      font: () => {
        _.assign(
          style,
          {
            fontSize: props.fontSize,
            color: colorToStr(props.color),
          },
          props.fontStyle
        );
      },
      image: () => {
        _.assign(
          style,
          {
            objectFit: props.objectFit,
          },
          props.imgStyle
        );
      },
    }) as FuncSet
  )[icon.value.type]();

  // 在 ICON 里指定的属性
  if (icon.value.style) {
    style = CssUtils.mergeStyles([style, icon.value.style]);
  }
  return CssUtils.toStyle(style);
}
