import _ from 'lodash';
import {
  Callback,
  Callback1,
  Convertor,
  Dom,
  FuncA0,
  Point2D,
  Rect,
  Rects,
} from '../../core';
import { getLogger } from '../../core/log/ti-log';
import { Dragging } from './drag/dragging';
export { Dragging } from './drag/dragging';

const log = getLogger('ti.lib.draggalbe');
/*-----------------------------------------------------

                      Types
                
-----------------------------------------------------*/
export type DraggingOptions = {
  /**
   * 获取监控的根元素，会在这个元素上绑定 POINTER_DOWN 事件，来监控推拽
   */
  getWatchTarget: FuncA0<HTMLElement>;
  /**
   * 获取一个视口，同时也用这个视口来作为推拽的位置坐标系
   *
   * 默认的，会采用 watchTarget 作为视口
   */
  getViewport?: FuncA0<HTMLElement | Rect>;
  /**
   * 如果未指定，拖拽的监控区域就是视口区域，超出这个区域，
   * 将不更新指针点位，拖拽行为会无响应
   */
  getWatchZone?: Convertor<Rect, Rect>;
  /**
   * 未设置，那么事件的 target 就是 dragTarget
   * 如果返回 undefined，那么就不启用拖拽
   */
  getDragTarget?: Convertor<HTMLElement, HTMLElement | undefined>;

  /**
   * 拖拽对象准备完成后的回调，这时推拽可能还未超出阈值激活。
   * 这时你依然有机会通过 `ing.stopDragging()` 阻止后续拖拽行为
   */
  onReady?: Callback1<Dragging>;

  /**
   * 拖拽开始时的回调。
   *
   * 这个会根据推拽的初始条件判断达到拖拽开始的阈值
   */
  onStart?: Callback1<Dragging>;

  /**
   * 拖拽时的回调，每次指针移动，都会尝试调用这个函数，
   *
   * 譬如，你如果想当指针超出 `watchZone` 就立即结束拖拽，你可以
   *
   * ```ts
   * if(ing.watchZone.hasPoint(ing.client)){
   *    ing.stopDragging()
   * }
   */
  onMoving: Callback1<Dragging>;

  /**
   * 结束拖拽时的回调
   */
  onEnd?: Callback1<Dragging>;

  /**
   * 一个销毁的注册函数，通常是控件 onUnmounted
   * 这样控件销毁时，会调用到 draggable 的销毁，即，删除对元素的监听
   */
  onDestroy?: Callback1<Callback>;
};

type WATCH_EVENT = {
  POINTER_DOWN: string;
  POINTER_UP: string;
  POINTER_MOVE: string;
  // 如果有这个设置，需要在激活后阻止
  POINTER_CLICK?: 'click';
  getPointerEvent: Convertor<Event, MouseEvent | Touch>;
  getPoint2D: Convertor<MouseEvent | Touch, Point2D>;
};
/*-----------------------------------------------------

                      Methods
                
-----------------------------------------------------*/
function getWatchEvent(): WATCH_EVENT {
  let getPointerEvent: Convertor<Event, MouseEvent | Touch>;
  if (Dom.isTouchDevice()) {
    getPointerEvent = (evt) => {
      return (evt as TouchEvent).touches[0];
    };
  } else {
    getPointerEvent = (evt) => {
      return evt as MouseEvent;
    };
  }
  let getPoint2D: Convertor<MouseEvent | Touch, Point2D> = (evt) => {
    return {
      x: evt.clientX,
      y: evt.clientY,
    };
  };
  // if (Dom.isTouchDevice()) {
  //   return {
  //     POINTER_DOWN: "touchstart",
  //     POINTER_MOVE: "touchmove",
  //     POINTER_UP: "touchend"
  //   };
  // }
  return {
    POINTER_DOWN: 'pointerdown',
    POINTER_MOVE: 'pointermove',
    POINTER_UP: 'pointerup',
    POINTER_CLICK: Dom.isTouchDevice() ? undefined : 'click',
    getPointerEvent,
    getPoint2D,
  };
}

/**
 * 结束拖拽，释放全部资源
 * @param ing
 * @param evt
 */
function deposeDragging(ing: Dragging, onEnd?: Callback1<Dragging>) {
  if (onEnd && ing.activated) {
    ing.activated = false;
    onEnd(ing);
  }
  ing.release();
}

/**
 * 处理指针移动事件
 *
 * @param ing
 * @param p2d
 * @param options
 * @returns
 */
function whenMoving(
  ing: Dragging,
  p2d: Point2D,
  options: Pick<DraggingOptions, 'onMoving' | 'onEnd'>
) {
  if (ing.update(p2d)) {
    // 处理推拽
    options.onMoving(ing);
    if (ing.isDead()) {
      deposeDragging(ing, options.onEnd);
    }
  }
}

/*-----------------------------------------------------

                    Use Feature
                [Use it in onMounted]               
-----------------------------------------------------*/
export function useDragging(options: DraggingOptions) {
  let { getWatchTarget, getViewport, getWatchZone, getDragTarget, onDestroy } =
    options;
  let $watchTarget = getWatchTarget();
  let $body = $watchTarget.ownerDocument.body;
  let ing: Dragging;

  //console.log('useDraggable', $watchTarget);
  log.debug('useDraggable', $watchTarget);
  // 准备监听
  let { POINTER_DOWN, POINTER_UP, POINTER_MOVE, getPointerEvent, getPoint2D } =
    getWatchEvent();

  // 准备结束监听
  function OnPointerUp() {
    //console.log("OnPointerUp");
    deposeDragging(ing, options.onEnd);
  }

  // 准备监控指针移动
  function OnPointerMove(e: Event) {
    let evt = getPointerEvent(e);
    let p2d = getPoint2D(evt);
    //console.log("OnPointerMove", p2d);
    whenMoving(ing, p2d, options);
  }

  // 准备监听指针按下的事件
  function OnPointerDown(evt: Event) {
    //console.log("OnPointerDown", evt);
    evt.stopPropagation();
    // 获取视口信息
    let $viewport = getViewport ? getViewport() : $watchTarget;
    let viewport = Rects.createBy($viewport);

    // 获取当前鼠标信息
    let pointerEvt = getPointerEvent(evt);
    let _start = getPoint2D(pointerEvt);

    // 准备拖拽上下文
    ing = new Dragging(viewport, _start);

    // 定制监控区
    if (getWatchZone) {
      ing.watchZone = getWatchZone(ing.watchZone);
    }

    // 设定释放回调
    ing.onRelease = () => {
      //console.log("release listen");
      $body.removeEventListener(POINTER_UP, OnPointerUp);
      $body.removeEventListener(POINTER_MOVE, OnPointerMove, { capture: true });
    };

    // 设定拖拽开始时的回调
    ing.onActivated = options.onStart;

    // 元素: body
    ing.body = $body;
    // 元素: 视口
    if ($viewport instanceof HTMLElement) {
      ing.viwportElement = $viewport;
    }
    // 元素: 触发源
    if (evt.target) {
      let target: HTMLElement | undefined = evt.target as HTMLElement;
      if (getDragTarget) {
        target = getDragTarget(target);
      }
      // 未发现有效目标，退出拖拽
      if (!target) {
        return;
      }
      ing.target = target;
      //
    }
    // 元素: 监控源  （这个应该就是 $watchTarget）
    if (evt.currentTarget) {
      ing.currentTarget = evt.currentTarget as HTMLElement;
    }

    // 自动计算目标的补偿点
    ing.autoSetCompensationByTarget();

    // 就绪回调
    if (options.onReady) {
      options.onReady(ing);
      if (ing.isDead()) {
        ing.release();
        return;
      }
    }

    // 监控结束
    $body.addEventListener(POINTER_UP, OnPointerUp, { once: true });

    // 监控指针的移动
    $body.addEventListener(POINTER_MOVE, OnPointerMove, { capture: true });
  }

  //
  // 开始监听目标的指针按下事件
  //
  $watchTarget.removeEventListener(POINTER_DOWN, OnPointerDown);
  _.delay(() => {
    $watchTarget.addEventListener(POINTER_DOWN, OnPointerDown);
  }, 0);

  //
  // 准备销毁程序
  //
  function release_draggable() {
    log.debug('release_draggable');
    $watchTarget.removeEventListener(POINTER_DOWN, OnPointerDown);
  }

  if (onDestroy) {
    onDestroy(release_draggable);
  }

  return release_draggable;
}
