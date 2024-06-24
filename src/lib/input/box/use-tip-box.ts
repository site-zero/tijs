import _ from 'lodash';
import { Rect, Vars } from '../../../_type';
import { CssUtils } from '../../../core';
import { ListProps, getDockingStyle } from '../../../lib';
import { TipBoxProps } from './ti-input-types';

export function getTipListConf(props?: ListProps) {
  let re = _.assign(
    {
      size: 's',
      canSelect: true,
      canHover: true,
      allowUserSelect: false,
      borderStyle: 'solid',
    } as ListProps,
    props
  );
  re.className = CssUtils.mergeClassName(
    {
      'tip-block': true,
    },
    props?.className
  );
  return re;
}

export function getTipWrapperStyle(
  props: TipBoxProps,
  $el?: HTMLElement,
  box?: Rect
): Vars {
  return getDockingStyle(
    {
      minWidth: `${_.get(box, 'width')}px`,
      width: props.tipListWidth,
    },
    $el,
    box
  );
}
