import _ from 'lodash';
import { createApp } from 'vue';
import { TextSnippetProps } from '../../';
import { Rect, TiRawCom, Vars } from '../../_type';
import { Dom, Rects, tiCheckComponent } from '../../core';
import { TipBoxProps, TipDockPosition, TipInstance } from './lib-tip-types';

function __prepare_body_wrapper(src: HTMLElement) {
  let body = src.ownerDocument.body;
  let wrap = Dom.find('div.ti-tip-wrapper', body);
  if (!wrap) {
    wrap = Dom.createElement({
      tagName: 'DIV',
      className: 'ti-tip-wrapper',
      $p: body,
    });
  }
  return wrap;
}

function __prepare_box_style(tip: TipBoxProps, _win: Rect) {
  // 分析一下样式
  let fontsz = tip.fontSize ?? 's';
  let padding = tip.padding ?? 'm';
  let radius = tip.radius ?? 's';
  let type = tip.type ?? 'tip';

  // 计算目标绝对定位点
  let boxSty = {
    '--tip-color': `var(--ti-color-${type})`,
    'position': 'fixed',
    'left': 0,
    'top': 0,
    'zIndex': 9999999,
    'opacity': 0,
  } as Vars;

  // 内容容器的样式
  let conSty = {
    position: 'relative',
    //background: '#FF0',
    // maxHeight: tip.maxHeight ?? `${Math.round(win.height * 0.4)}px`,
    // maxWidth: tip.maxWidth ?? `${Math.round(win.width * 0.4)}px`,
    minHeight: tip.minHeight ?? '10px',
    minWidth: tip.minWidth ?? '50px',
    width: tip.width,
    height: tip.height,
    overflow: tip.overflow,
    lineHeight: '1.5em',
    fontSize: `var(--ti-fontsz-${fontsz})`,
    padding: `var(--ti-box-pad-${padding})`,
    borderRadius: `var(--ti-measure-r-${radius})`,
    color: `var(--ti-color-${type}-r)`,
    backgroundColor: `var(--tip-color)`,
    boxShadow: '3px 3px 10px var(--ti-color-mask-thin)',
  } as Vars;

  return { boxSty, conSty };
}

function __eval_dock_position(
  tip: TipBoxProps,
  win: Rect,
  ref: Rect,
  box: Rect
): TipDockPosition {
  let quad = win.getQuadrant(ref);
  let dockMode = tip.dockMode ?? 'V';

  // 自动水平停靠，就是停靠在垂直边
  if ('H' == dockMode) {
    if (/left$/.test(quad)) {
      return 'H-right';
    }
    return 'H-left';
  }
  // 自动垂直停靠，就是停靠在水平边
  else if ('V' == dockMode) {
    // 上部有空间，就优先停靠顶部
    if (ref.top > box.height) {
      return 'V-top';
    }
    return 'V-bottom';
  }
  // 其他就是用户直接指定的了
  return dockMode as TipDockPosition;
}

function __prepre_box_dom(
  tip: TipBoxProps,
  wrap: HTMLElement,
  boxSty: Vars,
  conSty: Vars,
  arrowSize: number
) {
  // 那么就创建对应的元素
  // 包裹区域
  let $tipbox = Dom.createElement({
    tagName: 'DIV',
    className: 'ti-tipbox',
    style: boxSty,
    $p: wrap,
  });
  // 内容容器
  let $tipcon = Dom.createElement({
    tagName: 'DIV',
    className: 'tipbox-con',
    style: conSty,
    $p: $tipbox,
  });
  // 指示箭头
  let $tiparrow = Dom.createElement({
    tagName: 'DIV',
    className: 'tipbox-arrow',
    style: {
      position: 'relative',
      width: 0,
      height: 0,
      overflow: 'hidden',
      border: `${arrowSize}px solid transparent`,
    },
    $p: $tipbox,
  });

  // 准备显示控件
  let rawCom: TiRawCom;
  let comConf: Vars;
  if (tip.comType) {
    rawCom = tiCheckComponent(tip.comType).com;
    comConf = tip.comConf ?? {};
  } else {
    rawCom = tiCheckComponent('TiTextSnippet').com;
    comConf = {
      text: tip.content,
      textType: tip.contentType,
      autoI18n: true,
    } as TextSnippetProps;
  }

  let app = createApp(rawCom, comConf);
  app.mount($tipcon);

  return {
    $tipbox,
    $tipcon,
    $tiparrow,
    app,
    rawCom,
    comConf,
  };
}

export function drawTipBox(
  tip: TipBoxProps,
  target: HTMLElement
): TipInstance | undefined {
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
  }[tip.tranSpeed ?? 'normal'];
  // console.log('draw tip', tr_du, tip);

  // 获取一下参考对象的矩形区域
  let win = Rects.createBy(target.ownerDocument);
  let ref = Rects.createBy(target);
  //console.log('target:', ref.toString())

  // 构建初始的样式
  let { boxSty, conSty } = __prepare_box_style(tip, win);
  //console.log('css', boxSty);

  // 确保 body 下面有 tip 的插槽
  let wrap = __prepare_body_wrapper(target);

  // 准备初始化的 DOM
  let re = __prepre_box_dom(tip, wrap, boxSty, conSty, arrowSize);
  if (!re) {
    return;
  }
  let { $tipbox, $tipcon, $tiparrow, app } = re;

  // 很好，现在显示了对象，需要针对显示的对象进行调整
  let box = Rects.createBy($tipbox);

  // 分析停靠位置
  let dockPos = __eval_dock_position(tip, win, ref, box);
  // console.log('tpos=', dockPos);
  let conTransform: string = '';
  let arrowCss: Vars = {};

  // 对于四种模式的调整
  const adjust_style = {
    'V-top': () => {
      conTransform = `translateY(${tr_dis}px)`;
      // 停靠 box
      box.dockTo(ref, {
        mode: 'H',
        axis: { x: 'center', y: 'top' },
        space: { x: 0, y: 0 },
        viewport: win,
        wrapCut: true,
      });
      // 设置箭头位置
      let x = ref.x - box.left - arrowSize;
      arrowCss = {
        transform: `translateX(${x}px)`,
        borderTopColor: 'var(--tip-color)',
      };
    },
    'V-bottom': () => {
      conTransform = `translateY(-${tr_dis}px)`;
      // 停靠 box
      box.dockTo(ref, {
        mode: 'H',
        axis: { x: 'center', y: 'bottom' },
        space: { x: 0, y: axis_space },
        viewport: win,
        wrapCut: true,
      });
      // 设置箭头位置
      let x = ref.x - box.left - arrowSize;
      let y = box.height * -1 + 2;
      arrowCss = {
        transform: `translate(${x}px, ${y}px)`,
        borderBottomColor: 'var(--tip-color)',
      };
    },
    'H-left': () => {
      conTransform = `translateX(${tr_dis}px)`;
      // 停靠 box
      box.dockTo(ref, {
        mode: 'V',
        axis: { x: 'left', y: 'center' },
        space: { x: axis_space, y: 0 },
        viewport: win,
        wrapCut: true,
      });
      // 设置箭头位置
      let x = box.width;
      let y = ref.y - box.bottom + arrowSize;
      arrowCss = {
        transform: `translate(${x}px, ${y}px)`,
        borderLeftColor: 'var(--tip-color)',
      };
    },
    'H-right': () => {
      conTransform = `translateX(-${tr_dis}px)`;
      // 停靠 box
      box.dockTo(ref, {
        mode: 'V',
        axis: { x: 'right', y: 'center' },
        space: { x: axis_space, y: 0 },
        viewport: win,
        wrapCut: true,
      });
      // 设置箭头位置
      let x = arrowSize * -2 + 2;
      let y = ref.y - box.bottom + arrowSize;
      arrowCss = {
        transform: `translate(${x}px, ${y}px)`,
        borderRightColor: 'var(--tip-color)',
      };
    },
  }[dockPos];
  // console.log('docPos', dockPos);
  adjust_style();

  // 调整完毕了，重新为 box 设置 Style
  let { left, top } = box.toCss('tl', win);
  //console.log('boxPosCss', { left, top });
  Dom.updateStyle($tipbox, {
    left: `${Math.round(left)}px`,
    top: `${Math.round(top)}px`,
    opacity: 0,
    transform: conTransform,
  });

  // 设置箭头位置
  // console.log('arrowCss', arrowCss);
  Dom.updateStyle($tiparrow, arrowCss);

  // 然后马上设置一下入场位置
  _.delay(() => {
    Dom.updateStyle($tipbox, {
      opacity: 1,
      transition: [
        `opacity ${tr_du / 0.7}ms`,
        `transform ${tr_du}ms ease-out`,
      ].join(','),
      transform: '',
    });
  }, 0);

  // 返回必要信息给调用者
  return {
    app,
    tip,
    box,
    ref,
    conTransform,
    tr_du,
    $target: target,
    $tipbox,
    $tipcon,
  };
}

export function eraseTip(tipObj: TipInstance) {
  // 看看转场时间
  let { conTransform, tr_du, $tipbox, app } = tipObj;
  Dom.updateStyle($tipbox, {
    transication: '200mx',
    transform: conTransform,
    opacity: 0,
  });

  // 最后移除 tip 的定义和 DOM
  // _.delay(() => {
  //   app.unmount();
  //   Dom.remove($tipbox);
  //   delete (tipObj.$target as any).__tip_obj;
  // }, tr_du);

  Dom.updateStyle($tipbox, { display: 'none' });
  app.unmount();
  Dom.remove($tipbox);
  delete (tipObj.$target as any).__tip_obj;
}
