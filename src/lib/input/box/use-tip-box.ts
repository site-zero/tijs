import _ from 'lodash';
import { QuadrantName, Rect, Rects, Vars } from '../../../core';
import { ListProps } from '../../../lib';
import { TipBoxProps } from './ti-input-types';

export type TipBoxOptions = {
  /**
   * 是否启用提示框，如果未定义，则看是否提供了提示框的宿主位置以及选项表
   */
  enabled?: boolean;

  /**
   * @returns 提示框的宿主矩形（窗口坐标系）
   */
  getHostElement?: () => Rect;

  /**
   * 获取提示的方法
   */
  getOptions?: (signal?: AbortSignal) => Promise<void>;
};

export function useTipBox(_props: TipBoxProps) {}

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

  return re;
}

export function getTipWrapperStyle($el?: HTMLElement, box?: Rect): Vars {
  if (!box || !$el) {
    return {};
  }
  let win = Rects.createBy($el.ownerDocument);
  let quard = win.getQuadrant(box);
  console.log('quard', quard);
  let css: Vars = {
    minWidth: `${box.width}px`,
  };
  let _algs: Record<QuadrantName, () => void> = {
    // Tip should down and align=left
    'top-left': () => {
      css.top = `${box.bottom}px`;
      css.left = `${box.left}px`;
      css.maxWidth = `${win.width - box.left}px`;
      css.maxHeight = `${win.bottom - box.bottom}px`;
    },
    // Tip should down and align=right
    'top-right': () => {
      css.top = `${box.bottom}px`;
      css.right = `${win.width - box.right}px`;
      css.maxWidth = `${box.right}px`;
      css.maxHeight = `${win.bottom - box.bottom}px`;
    },
    // Tip should up and align=left
    'bottom-left': () => {
      css.bottom = `${win.height - box.top}px`;
      css.left = `${box.left}px`;
      css.maxWidth = `${win.right - box.left}px`;
      css.maxHeight = `${box.top}px`;
    },
    // Tip should up and align=right
    'bottom-right': () => {
      css.bottom = `${win.height - box.top}px`;
      css.right = `${win.width - box.right}px`;
      css.maxWidth = `${box.right}px`;
      css.maxHeight = `${box.top}px`;
    },
  };
  _algs[quard]();
  return css;
}
