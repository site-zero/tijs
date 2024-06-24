import { QuadrantName, Rect, Vars } from '../../_type';
import { Rects } from '../../core';

export type DockProps = {
  width?: string;
  height?: string;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
};

export function getDockingStyle(
  props: DockProps,
  $el?: HTMLElement,
  box?: Rect
) {
  if (!box || !$el) {
    return {};
  }
  let win = Rects.createBy($el.ownerDocument);
  let quard = win.getQuadrant(box);
  //console.log('quard', quard);
  let css: Vars = {
    width: props.width,
    height: props.height,
    minWidth: props.minWidth,
    maxWidth: props.maxWidth,
    minHeight: props.minHeight,
    maxHeight: props.maxHeight,
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
