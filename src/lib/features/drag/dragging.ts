import { Callback, Callback1, G2D, Point2D, Rect, Rects } from "../../../core";
import _ from "lodash";

export type MoveDirectionX = "left" | "right";
export type MoveDirectionY = "up" | "down";
export type DragWatchMode = "stop" | "pause" | "play";

/**
 * 拖动时（核心计算类）
 *
 * ## 观念： 三个坐标系
 *
 * ```
 * |<--------------- x ---------------------->|
 * (0,0) <window coord>                       |
 * +------------------------------------------+......
 * |                                          |   ^
 * |   +--------------------------------+     |   |
 * |   | (0,0) <viewport coord>         |     |   |
 * |   |                                |     |   |
 * |   |                                |     |   |
 * |   |                                |     |   |
 * |   |                                |     |   |
 * |   |    (0,0) <target coord>        |     |
 * |   |    +-----------+               |     |   y
 * |   |    |           |               |     |
 * |   |    |           |               |     |   |
 * |   |    |           |               |     |   |
 * |   |    +-----------+               |     |   |
 * |   |                                |     |   |
 * |   |                                |     |   |
 * |   |                                |     |   |
 * |   +--------------------------------+     |   V
 * +------------------------------------------+......
 * ```
 *
 *
 */
export class Dragging {
  /*
  --------------------------------------------------------
                          关键元素
  --------------------------------------------------------
  常用的譬如: 
  - src
  - target
  - viewport
  */
  private _elements: Map<string, HTMLElement> = new Map();
  private _points: Map<string, Point2D> = new Map();
  private _measures: Map<string, number> = new Map();
  private _vars: Map<string,any> = new Map();
  /*
  --------------------------------------------------------
                          Status
  --------------------------------------------------------
  */
  /**
   * 一旦被标记为 true, 那么 update 将在也不响应
   */
  _dead: boolean = false;
  /**
   * 当前拖拽是否被激活，通常是拖动超过一个阈值才会激活
   */
  activated: boolean = false;

  /**
   * 指针是否超出了监控区
   */
  outOfWatch: boolean = false;

  /**
   * 当拖动距离超过一个阈值，就表示激活拖拽
   */
  activeDistance: number = 5;

  /**
   * 超过监控区，就自动释放拖拽
   *
   * - `"stop"` : 将立即停止拖拽，释放资源
   * - `"pause"` : 将暂停拖拽回调，如果指针又回到监控区则继续
   * - `"play"` : 继续调用回调
   */
  watchMode: DragWatchMode = "pause";
  /*
  --------------------------------------------------------
                          Timestamp
  --------------------------------------------------------
  */
  /**
   * 拖动开始的计时
   */
  startInMs: number;
  /**
   * 拖动发生时的时间戳
   */
  nowInMs: number;
  /**
   * 拖动的持续时间
   */
  duInMs: number;
  /*
  --------------------------------------------------------
                          Measure
  --------------------------------------------------------
  */
  /**
   * 超过了这个区域，将不会响应点的 update
   * 默认将采用视口区域
   */
  private _watchZone: Rect;

  /**
   * 拖动的视口 (window coord)
   */
  viewport: Rect;

  /**
   * 移动发生的指针位置 (window coord)
   */
  client: Point2D = { x: 0, y: 0 };

  /**
   * 移动发生的指针位置 (viewport coord)
   */
  inview: Point2D = { x: 0, y: 0 };

  /**
   * 拖动开始时，指针点击的位置 (viewport coord)
   */
  start: Point2D;

  /**
   * 当前指针位置与开始位置的偏移 (viewport coord)
   */
  offset: Point2D;

  /**
   * 推拽开始时，指针在拖拽目标上的偏移 (target coord)
   * 在设置拖拽目标的 css.left/top 时，这个补偿偏移需要被考虑进去
   */
  compensation: Point2D = { x: 0, y: 0 };

  /**
   * 当前指针位置与上一次位置的偏移 (viewport coord)
   */
  move: Point2D;

  /**
   * 当前指针位置与视口宽高的比例 (viewport coord)
   * 就是说，我可以直到指针的位置是在视口 x 轴的百分之多少
   * y 轴的百分之多少。其中 x 轴的 100% 就是视口宽度，y 轴
   * 的 100% 是视口的高度。
   */
  scale: Point2D;

  // 移动的距离与方向
  moveDistance: number = 0;
  directionX: MoveDirectionX = "left";
  directionY: MoveDirectionY = "down";
  speed: number = 0;

  /**
   * Speed Unit, move 1px per 1ms
   * default 100, mean: move 1px in 1ms, it was 100
   *
   * @default 100
   */
  private _speedUnit: number = 100;

  private _on_activated?: Callback1<Dragging>;

  private _on_release?: Callback;

  constructor(_viewport: Rect, _start: Point2D) {
    this.viewport = _viewport;
    this._watchZone = _viewport.clone();
    this.startInMs = Date.now();
    this.nowInMs = this.startInMs;
    this.duInMs = 0;
    let { left, top } = this.viewport;
    let { x, y } = _start;
    this.client = { x, y };
    this.inview = { x: x - left, y: y - top };
    this.start = _.clone(this.inview);
    this.offset = { x: 0, y: 0 };
    this.move = { x: 0, y: 0 };
    this.scale = { x: 0, y: 0 };
  }

  /**
   * 更新指针位置，同时更新对应的时间戳
   *
   * @param _client 指针位置 (window coord)
   * @returns 推拽是否处于激活状态
   */
  update(_client: Point2D): boolean {
    // 防守
    if (this._dead) {
      return false;
    }

    // 更新时间戳
    this.nowInMs = Date.now();
    this.duInMs = this.nowInMs - this.startInMs;

    // 计算指针在视口中位置
    let { x, y } = _client;
    let _X = x - this.viewport.left;
    let _Y = y - this.viewport.top;

    // 更新指针位置
    this.client = { x, y };

    // 总偏移  (viewport coord)
    this.offset = {
      x: _X - this.start.x,
      y: _Y - this.start.y
    };

    // 总比例
    this.scale = {
      x: _X / this.viewport.width,
      y: _Y / this.viewport.height
    };

    // 步偏移  (viewport coord)
    this.move = {
      x: _X - this.inview.x,
      y: _Y - this.inview.y
    };

    // 根据步偏移，求出距离方向等步进信息
    this.moveDistance = Math.sqrt(
      Math.pow(this.move.x, 2) + Math.pow(this.move.y, 2)
    );
    this.directionX = this.move.x < 0 ? "left" : "right";
    this.directionY = this.move.y < 0 ? "up" : "down";
    this.speed = (this.moveDistance * this._speedUnit) / this.duInMs;

    // 最后更新指针在视口中的位置
    this.inview = {
      x: _X,
      y: _Y
    };

    // 超过了监视区，不响应了
    this.outOfWatch = !this._watchZone.hasPoint(_client);
    if (this.outOfWatch) {
      if ("pause" == this.watchMode) {
        return false;
      }
      // 主动停止推拽
      else if ("stop" == this.watchMode) {
        this.stopDragging();
        return true;
      }
    }

    // 如果拖拽未激活，则尝试激活它
    if (!this.activated) {
      // 计算移动的距离
      let dis = G2D.getDistance(this.offset);
      if (dis > this.activeDistance) {
        this.activated = true;
        if (this._on_activated) {
          this._on_activated(this);
        }
      }
    }

    return this.activated;
  }

  /**
   * 根据当前的滚动速度和位移，计算出结束滚动后 x 轴的位置
   *
   * ```
   * |                       |
   * |<------- min left ---->|
   * |                       |  viewport
   * |                       |<-- width -->|
   * |-----------------------|-------------|
   * |                                     |
   * |<----------- scrollWidth ----------->|
   * ```
   *
   * @param scrollWidth 补偿的滚动宽度
   * @param left 初始的 left 位置
   * @returns  `left` 应该值
   */
  evalLeftBySpeed(scrollWidth = 0, left = 0) {
    if (this.speed > 1) {
      left += this.speed * this.offset.x;
    }
    let minLeft = this.viewport.width - scrollWidth;
    left = _.clamp(left, minLeft, 0);
    return left;
  }

  /**
   * 根据当前的滚动速度和位移，计算出结束滚动后 x 轴的位置
   *
   * ```
   * |                       |
   * |<------- min top  ---->|
   * |                       |  viewport
   * |                       |<-- height-->|
   * |-----------------------|-------------|
   * |                                     |
   * |<----------- scrollHeight ---------->|
   * ```
   *
   * @param scrollHeight 补偿的滚动宽度
   * @param top 初始的 top 位置
   * @returns  `top` 应该值
   */
  evalTopBySpeed(scrollHeight = 0, top = 0) {
    if (this.speed > 1) {
      top += this.speed * this.offset.y;
    }
    let minTop = this.viewport.height - scrollHeight;
    top = _.clamp(top, minTop, 0);
    return top;
  }

  isDead() {
    return this._dead;
  }

  stopDragging() {
    this._dead = true;
  }

  release() {
    if (this._on_release) {
      this._on_release();
    }
    this.activated = false;
    this._dead = true;
  }

  get onRelease() {
    return this._on_release;
  }

  set onRelease(_fn: Callback | undefined) {
    this._on_release = _fn;
  }

  get onActivated() {
    return this._on_activated;
  }

  set onActivated(_fn: Callback1<Dragging> | undefined) {
    this._on_activated = _fn;
  }

   /*
  --------------------------------------------------------
                   Customized Vars
  --------------------------------------------------------
  */
  getVar(key: string) {
    return this._vars.get(key);
  }
  setVar(key: string, val: any) {
    if (_.isNil(val)) {
      this._vars.delete(key);
    } else {
      this._vars.set(key, val);
    }
  }

  /*
  --------------------------------------------------------
                   Customized Measures
  --------------------------------------------------------
  */
  getMeasure(key: string) {
    return this._measures.get(key);
  }
  setMeasure(key: string, val: number | undefined | null) {
    if (_.isNil(val)) {
      this._measures.delete(key);
    } else {
      this._measures.set(key, val);
    }
  }

  /*
  --------------------------------------------------------
                        Points
  --------------------------------------------------------
  */
  getPoint(key: string) {
    return this._points.get(key);
  }
  setPoint(key: string, val: Point2D | undefined | null) {
    if (!val) {
      this._points.delete(key);
    } else {
      this._points.set(key, val);
    }
  }

  autoSetCompensationByTarget() {
    let $ta = this.target;
    if ($ta) {
      let rect = Rects.createBy($ta);
      this.compensation = rect.coordOnMe(this.client);
    }
  }

  /*
  --------------------------------------------------------
                        Elements
  --------------------------------------------------------
  */
  getElement(key: string) {
    return this._elements.get(key);
  }
  setElement(key: string, ele: HTMLElement | undefined | null) {
    if (!ele) {
      this._elements.delete(key);
    } else {
      this._elements.set(key, ele);
    }
  }

  /**
   * 拖拽目标，通常监控`POINTER_DOWN`的元素
   */
  get target() {
    return this._elements.get("target");
  }
  set target(target: HTMLElement | undefined) {
    this.setElement("target", target);
  }

  /**
   * 监控元素，是 `getWatchTarget` 返回的元素。通常就是 viewport
   */
  get currentTarget() {
    return this._elements.get("currentTarget");
  }
  set currentTarget(currentTarget: HTMLElement | undefined) {
    this.setElement("currentTarget", currentTarget);
  }

  /**
   * 视口元素，通常你需要将指针坐标换算成这个元素的坐标系。
   * 上下文的 `inview` 属性就是帮你换算好的坐标
   */
  get viwportElement() {
    return this._elements.get("viewport");
  }
  set viwportElement(viewport: HTMLElement | undefined) {
    this.setElement("viewport", viewport);
  }

  /**
   * 移动监控元素，通常是 viewport 所在的 body
   * 我们会在这个元素上监控 `POINTER_MOVE | POINTER_UP`
   */
  get body() {
    return this._elements.get("body");
  }
  set body(body: HTMLElement | undefined) {
    this.setElement("body", body);
  }

  /*
  --------------------------------------------------------
                          Getter & Setter
  --------------------------------------------------------
  */
  get speedUnit() {
    return this._speedUnit;
  }
  set speedUnit(unit: number) {
    this._speedUnit = unit;
  }

  get watchZone() {
    return this._watchZone;
  }
  set watchZone(zone: Rect) {
    this._watchZone = zone;
  }
}