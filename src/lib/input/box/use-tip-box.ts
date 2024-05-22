import _ from 'lodash';
import { CssUtils, QuadrantName, Rect, Rects, Vars } from '../../../core';
import { ListProps } from '../../../lib';

export function getTipListConf(props?: ListProps) {
  let re = _.assign(
    {
      size: 's',
      selectable: true,
      hoverable: true,
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

export function getTipWrapperStyle($el?: HTMLElement, box?: Rect): Vars {
  if (!box || !$el) {
    return {};
  }
  let win = Rects.createBy($el.ownerDocument);
  let quard = win.getQuadrant(box);
  //console.log('quard', quard);
  let css: Vars = {
    minWidth: `${box.width}px`,
  };
  let boxBorder = 4;
  let _algs: Record<QuadrantName, () => void> = {
    // Tip should down and align=left
    'top-left': () => {
      css.top = `${box.bottom}px`;
      css.left = `${box.left}px`;
      css.maxWidth = `${win.width - box.left}px`;
      css.maxHeight = `${win.bottom - box.bottom - boxBorder}px`;
    },
    // Tip should down and align=right
    'top-right': () => {
      css.top = `${box.bottom}px`;
      css.right = `${win.width - box.right}px`;
      css.maxWidth = `${box.right}px`;
      css.maxHeight = `${win.bottom - box.bottom - boxBorder}px`;
    },
    // Tip should up and align=left
    'bottom-left': () => {
      css.bottom = `${win.height - box.top}px`;
      css.left = `${box.left}px`;
      css.maxWidth = `${win.right - box.left}px`;
      css.maxHeight = `${box.top - boxBorder}px`;
    },
    // Tip should up and align=right
    'bottom-right': () => {
      css.bottom = `${win.height - box.top}px`;
      css.right = `${win.width - box.right}px`;
      css.maxWidth = `${box.right}px`;
      css.maxHeight = `${box.top - boxBorder}px`;
    },
  };
  _algs[quard]();
  return css;
}
