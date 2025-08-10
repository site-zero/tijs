import _ from "lodash";
import { createApp } from "vue";
import { Rect, Vars } from "../../_type";
import { Dom } from "../../core";
import { TipBoxProps, TipInstance } from "./lib-tip-types";
import TipBoxApp from "./TipBoxApp.vue";
import {
  TipBoxDockingApi,
  TipBoxDockingContext,
  useTipBoxDocking,
} from "./use-tip-box-docking";

function __prepare_body_wrapper(src: HTMLElement) {
  let body = src.ownerDocument.body;
  let wrap = Dom.find("div.ti-tip-wrapper", body);
  if (!wrap) {
    wrap = Dom.createElement({
      tagName: "DIV",
      className: "ti-tip-wrapper",
      $p: body,
    });
  }
  return wrap;
}

function __prepare_box_style(tip: TipBoxProps, _win: Rect) {
  // 分析一下样式
  let fontsz = tip.fontSize ?? "s";
  let padding = tip.padding ?? "m";
  let radius = tip.radius ?? "s";
  let type = tip.type ?? "tip";

  // 计算目标绝对定位点
  let boxSty = {
    "--tip-color": `var(--ti-color-${type})`,
    "position": "fixed",
    "left": 0,
    "top": 0,
    "zIndex": 9999999,
    "opacity": 0,
  } as Vars;

  // 内容容器的样式
  let conSty = {
    position: "relative",
    //background: '#FF0',
    // maxHeight: tip.maxHeight ?? `${Math.round(win.height * 0.4)}px`,
    // maxWidth: tip.maxWidth ?? `${Math.round(win.width * 0.4)}px`,
    minHeight: tip.minHeight ?? "10px",
    minWidth: tip.minWidth ?? "50px",
    maxHeight: tip.maxHeight,
    maxWidth: tip.maxWidth,
    width: tip.width,
    height: tip.height,
    overflow: tip.overflow,
    lineHeight: "1.5em",
    fontSize: `var(--ti-fontsz-${fontsz})`,
    padding: `var(--ti-box-pad-${padding})`,
    borderRadius: `var(--ti-measure-r-${radius})`,
    color: `var(--ti-color-${type}-r)`,
    backgroundColor: `var(--tip-color)`,
    boxShadow: "3px 3px 10px var(--ti-color-mask-thin)",
  } as Vars;

  return { boxSty, conSty };
}

function __prepre_box_dom(
  tip: TipBoxProps,
  wrap: HTMLElement,
  boxSty: Vars,
  conSty: Vars,
  _dx: TipBoxDockingContext,
  docking: TipBoxDockingApi
) {
  // 那么就创建对应的元素
  // 包裹区域
  let $tipbox = Dom.createElement({
    tagName: "DIV",
    className: "ti-tipbox",
    style: boxSty,
    $p: wrap,
  });
  // 内容容器
  let $tipcon = Dom.createElement({
    tagName: "DIV",
    className: "tipbox-con",
    style: conSty,
    $p: $tipbox,
  });
  // 指示箭头
  let $tiparrow = Dom.createElement({
    tagName: "DIV",
    className: "tipbox-arrow",
    style: {
      position: "relative",
      width: 0,
      height: 0,
      overflow: "hidden",
      border: `${_dx.arrowSize}px solid transparent`,
    },
    $p: $tipbox,
  });

  // 准备显示控件
  let comConf: Vars = _.assign({}, tip.comConf);
  if (!tip.comConf) {
    _.defaults(comConf, {
      text: tip.content,
      textType: tip.contentType,
      autoI18n: true,
    });
  }

  let app = createApp(TipBoxApp, {
    comType: tip.comType,
    comConf,
    readyEvent: tip.readyEvent ?? "ready",
    updateDocking: () => {
      docking.initDocking(_dx, {
        $tipbox,
        $tipcon,
        $tiparrow,
      });
    },
  });
  app.mount($tipcon);

  return {
    $tipbox,
    $tipcon,
    $tiparrow,
    app,
  };
}

export function drawTipBox(
  tip: TipBoxProps,
  target: HTMLElement
): TipInstance | undefined {
  const docking = useTipBoxDocking(tip, target);

  const _dx = docking.createDockingContext();
  let { win, arrowSize } = _dx;

  // 构建初始的样式
  let { boxSty, conSty } = __prepare_box_style(tip, win);
  //console.log('css', boxSty);

  // 确保 body 下面有 tip 的插槽
  let wrap = __prepare_body_wrapper(target);

  // 准备初始化的 DOM
  let re = __prepre_box_dom(tip, wrap, boxSty, conSty, _dx, docking);
  if (!re) {
    return;
  }
  let { $tipbox, $tipcon, $tiparrow, app } = re;

  docking.initDocking(_dx, {
    $tipbox,
    $tipcon,
    $tiparrow,
  });

  // 返回必要信息给调用者
  return {
    ..._dx,
    app,
    tip,
    $target: target,
    $tipbox,
    $tipcon,
  };
}

export function eraseTip(tipObj: TipInstance) {
  // 看看转场时间
  let { conTransform, tr_du, $tipbox, app } = tipObj;
  Dom.updateStyle($tipbox, {
    transication: "200mx",
    transform: conTransform,
    opacity: 0,
  });

  // 最后移除 tip 的定义和 DOM
  // _.delay(() => {
  //   app.unmount();
  //   Dom.remove($tipbox);
  //   delete (tipObj.$target as any).__tip_obj;
  // }, tr_du);

  Dom.updateStyle($tipbox, { display: "none" });
  app.unmount();
  Dom.remove($tipbox);
  delete (tipObj.$target as any).__tip_obj;
}
