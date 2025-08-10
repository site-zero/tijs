import _ from "lodash";
import { Rect, Vars } from "../../_type";
import { Dom, Rects } from "../../core";
import { DOCKING_ADJUSTERS } from "./docking-adjuster";
import { TipBoxProps, TipDockPosition } from "./lib-tip-types";

export type TipBoxDockingApi = ReturnType<typeof useTipBoxDocking>;

export type TipBoxDockingOptions = {
  $tipbox: HTMLElement;
  $tipcon: HTMLElement;
  $tiparrow: HTMLElement;
};

export type TipBoxDockingContext = {
  arrowSize: number;
  space: number;
  // Tip 盒子与目标元素距离
  axis_space: number;
  // 动画位移距离
  tr_dis: number;
  // 动画速度
  tr_du: number;
  // 窗口矩形
  win: Rect;
  // 参考目标矩形
  ref: Rect;
  // 提示框矩形
  box: Rect;

  // 提示框的初始化位移，以便显示初始化动画
  conTransform: string;
  arrowCss: Vars;
};

export function useTipBoxDocking(tip: TipBoxProps, target: HTMLElement) {
  /**
   * 根据对接上下文计算提示框的停靠位置
   * @param dx - 提示框对接上下文，包含各种尺寸、位置信息
   * @returns 计算得到的提示框停靠位置
   */
  function getDockPosition(dx: TipBoxDockingContext): TipDockPosition {
    let { win, ref, box } = dx;
    let quad = win.getQuadrant(ref);
    let dockMode = tip.dockMode ?? "V";

    // 自动水平停靠，就是停靠在垂直边
    if ("H" == dockMode) {
      if (/left$/.test(quad)) {
        return "H-right";
      }
      return "H-left";
    }
    // 自动垂直停靠，就是停靠在水平边
    else if ("V" == dockMode) {
      // 上部有空间，就优先停靠顶部
      if (ref.top > box.height) {
        return "V-top";
      }
      return "V-bottom";
    }
    // 其他就是用户直接指定的了
    return dockMode as TipDockPosition;
  }

  function createDockingContext(): TipBoxDockingContext {
    // 指示箭头尺寸
    const arrowSize = 10;
    const space = 0;
    // Tip 盒子与目标元素距离
    const axis_space = arrowSize + space;
    // 动画位移距离
    const tr_dis = 10;
    // 动画速度
    const tr_du = {
      fast: 300,
      normal: 500,
      slow: 800,
    }[tip.tranSpeed ?? "normal"];
    return {
      arrowSize,
      space,
      axis_space,
      tr_dis,
      tr_du,

      conTransform: "",
      arrowCss: {},
      // 获取一下参考对象的矩形区域
      win: Rects.createBy(target.ownerDocument),
      ref: Rects.createBy(target),
      // 很好，现在显示了对象，需要针对显示的对象进行调整
      box: Rects.createBy({ width: 0, height: 0, left: 0, top: 0 }),
    };
  }

  /**
   * 初始化提示框的停靠位置
   * @param _dx - 提示框对接上下文，包含各种尺寸、位置信息
   * @param options - 提示框停靠相关的 DOM 元素选项
   */
  function initDocking(
    _dx: TipBoxDockingContext,
    options: TipBoxDockingOptions
  ) {
    let { $tipbox, $tipcon, $tiparrow } = options;

    // 很好，现在显示了对象，需要针对显示的对象进行调整
    _dx.box = Rects.createBy($tipbox);

    // 分析停靠位置
    let dockPos = getDockPosition(_dx);
    let adjuster = DOCKING_ADJUSTERS[dockPos];
    adjuster(_dx);

    // 调整完毕了，重新为 box 设置 Style
    let { left, top } = _dx.box.toCss("tl", _dx.win);
    //console.log('boxPosCss', { left, top });
    Dom.updateStyle($tipbox, {
      left: `${Math.round(left)}px`,
      top: `${Math.round(top)}px`,
      opacity: 0,
      transform: _dx.conTransform,
    });

    // 设置箭头位置
    const ori_border_key = "data-old-border-style";
    if (!$tiparrow.getAttribute(ori_border_key)) {
      $tiparrow.setAttribute(ori_border_key, $tiparrow.style.border);
    }
    // console.log('arrowCss', arrowCss);
    $tiparrow.style.border = $tiparrow.getAttribute(ori_border_key)!;
    Dom.updateStyle($tiparrow, _dx.arrowCss);

    // 然后马上设置一下入场位置
    _.delay(() => {
      let { tr_du } = _dx;
      Dom.updateStyle($tipbox, {
        opacity: 1,
        transition: [
          `opacity ${tr_du / 0.7}ms`,
          `transform ${tr_du}ms ease-out`,
        ].join(","),
        transform: "",
      });
    }, 0);
  }

  // -----------------------------------------------------
  // 返回特性
  // -----------------------------------------------------
  return {
    createDockingContext,
    initDocking,
  };
}
