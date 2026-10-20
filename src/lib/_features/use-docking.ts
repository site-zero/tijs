import _ from "lodash";
import { QuadrantName, Rect } from "../../_type";
import { Rects } from "../../core";

export type DockingApi = ReturnType<typeof useDocking>;

export type DockingProps = {
  width?: string;
  height?: string;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
};

export type DockingStyle = DockingProps & {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
};

export type DockingOptions = DockingProps & {
  /**
   * @returns 获取要停靠的目标元素
   */
  getElement: () => HTMLElement | null | undefined;

  /**
   * 指定停靠间距(px)，默认为 4
   */
  space?: number;
};

/**
 * 提供一个特性，根据给的元素判断如何👂靠。
 * 并给出一个停靠样式的特性
 *
 * @param options 停靠的配置信息
 */
export function useDocking(options: DockingOptions) {
  /**
   * 获取一个停靠样式，根据当前元素所在页面位置。
   * 根据这样式指定元素绝对位置，就会显示的停靠在指定位置。
   *
   * @returns 停靠样式
   */
  function genDockingStyle() {
    let $el = options.getElement();
    if (!$el || !_.isElement($el)) {
      return {};
    }
    let box = Rects.createBy($el);
    let win = Rects.createBy($el.ownerDocument);
    return getDockingStyle(options, $el, box, win);
  }

  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return {
    genDockingStyle,
  };
}

export function getDockingStyle(
  props: DockingProps,
  $el?: HTMLElement,
  box?: Rect,
  win?: Rect
): DockingStyle {
  if (!box || !$el) {
    return {};
  }
  if (!win) {
    win = Rects.createBy($el.ownerDocument);
  }
  let quard = win.getQuadrant(box);
  //console.log('quard', quard);
  let css: DockingStyle = {
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
    "top-left": () => {
      css.top = `${box.bottom}px`;
      css.left = `${box.left}px`;
      css.maxWidth = `${win.width - box.left}px`;
      css.maxHeight = `${win.bottom - box.bottom - boxBorder}px`;
    },
    // Tip should down and align=right
    "top-right": () => {
      css.top = `${box.bottom}px`;
      css.right = `${win.width - box.right}px`;
      css.maxWidth = `${box.right}px`;
      css.maxHeight = `${win.bottom - box.bottom - boxBorder}px`;
    },
    // Tip should up and align=left
    "bottom-left": () => {
      css.bottom = `${win.height - box.top}px`;
      css.left = `${box.left}px`;
      css.maxWidth = `${win.right - box.left}px`;
      css.maxHeight = `${box.top - boxBorder}px`;
    },
    // Tip should up and align=right
    "bottom-right": () => {
      css.bottom = `${win.height - box.top}px`;
      css.right = `${win.width - box.right}px`;
      css.maxWidth = `${box.right}px`;
      css.maxHeight = `${box.top - boxBorder}px`;
    },
  };
  _algs[quard]();
  return css;
}
