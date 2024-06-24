import _ from 'lodash';
import { Num, Util } from '../';
import {
  DockAxis,
  DockOptions,
  Point2D,
  QuadrantName,
  Rect,
  RectCentreToOptions,
  RectInfo,
  RectZoomToOptions,
  Size2D,
  Vars,
  isDocument,
  isHTMLElement,
  isWindow,
} from '../../_type';

const RECTINFO_NAMES = {
  w: 'width',
  h: 'height',
  l: 'left',
  r: 'right',
  t: 'top',
  b: 'bottom',
  x: 'x',
  y: 'y',
} as { [k: string]: string };

//--------------------------------------
/**
 * 按照 mode ，找到对应的属性，组成数组返回。
 * @param mode 模式字符串，由 'w, h, l, r, t, b, x, y' 字符组成。
 * 字符简写与属性的对应关系为： w: width, h: height, l: left, r: right, t: top, b: bottom, x: x, y: y。
 * @param sorted 是否对属性进行排序
 * @returns 对应属性组成的数组
 */
export function explainToArray(mode: string, sorted: boolean = true): string[] {
  let re: string[] = [];
  let ks = mode.toLocaleLowerCase().split('');
  if (sorted) ks = ks.sort();
  for (let m of ks) {
    let name = RECTINFO_NAMES[m];
    if (!_.isNil(name)) {
      re.push(name);
    }
  }
  return re;
}

/**
 * 按照 keys 取出 rect 中的属性，组成原生对象返回
 * @param rect 矩形对象
 * @param keys 属性简写字符串
 * @param dft 默认值
 * @returns 含有指定属性的原生对象
 */
export function pickKeys(
  rect: RectInfo,
  keys: string,
  dft: number = NaN
): { [k: string]: number } {
  let re = {} as { [k: string]: number };
  let ks = explainToArray(keys, false);
  for (let key of ks) {
    let val = Util.fallback(_.get(rect, key), dft);
    if (!_.isUndefined(val)) {
      re[key] = val;
    }
  }
  return re;
}

class RectImpl implements Rect {
  width: number = 0;
  height: number = 0;
  left: number = 0;
  right: number = 0;
  top: number = 0;
  bottom: number = 0;
  x: number = 0;
  y: number = 0;

  constructor(
    rect = { top: 0, left: 0, height: 0, width: 0 } as RectInfo,
    mode?: string
  ) {
    if (_.isEmpty(rect)) {
      rect = { top: 0, left: 0, height: 0, width: 0 };
    }
    let key: keyof RectInfo;

    // 如果 mode 为空，则选择 keys 来更新
    if (_.isUndefined(mode)) {
      let nms = [];
      for (key in rect) {
        let val = rect[key];
        if (_.isFinite(val)) {
          this[key] = val!;
          nms.push(key.substring(0, 1));
        }
      }
      mode = nms.join('');
    } else {
      for (key in rect) {
        let val = rect[key];
        if (_.isFinite(val)) {
          this[key] = val!;
        }
      }
    }

    //  如果 mode 是 "bhlrtwxy"， 说明所有属性都齐备
    if ('bhlrtwxy' == mode) return this;

    // 按照 mode 更新其他属性
    this.updateBy(mode);
  }

  __I_am_rect(): boolean {
    return true;
  }

  update(mode?: string): Rect {
    return this.updateBy(mode);
  }

  toSize2D(): Size2D {
    return {
      width: this.width,
      height: this.height,
    };
  }

  /**
   * 更新矩形的其他属性数值
   * @param mode 更新模式
   * @returns 更新后的矩形本身
   */
  updateBy(mode: string = 'tlwh'): Rect {
    // TODO 占位实现
    let ary = explainToArray(mode);
    let alg = ary.join('/');
    (
      ({
        'height/left/top/width': () => {
          this.right = this.left + this.width;
          this.bottom = this.top + this.height;
          this.x = this.left + this.width / 2;
          this.y = this.top + this.height / 2;
        },
        'height/right/top/width': () => {
          this.left = this.right - this.width;
          this.bottom = this.top + this.height;
          this.x = this.left + this.width / 2;
          this.y = this.top + this.height / 2;
        },
        'bottom/height/left/width': () => {
          this.top = this.bottom - this.height;
          this.right = this.left + this.width;
          this.x = this.left + this.width / 2;
          this.y = this.top + this.height / 2;
        },
        'bottom/height/right/width': () => {
          this.top = this.bottom - this.height;
          this.left = this.right - this.width;
          this.x = this.left + this.width / 2;
          this.y = this.top + this.height / 2;
        },
        'bottom/left/right/top': () => {
          this.width = this.right - this.left;
          this.height = this.bottom - this.top;
          this.x = this.left + this.width / 2;
          this.y = this.top + this.height / 2;
        },
        'height/width/x/y': () => {
          let W2 = this.width / 2;
          let H2 = this.height / 2;
          this.top = this.y - H2;
          this.bottom = this.y + H2;
          this.left = this.x - W2;
          this.right = this.x + W2;
        },
        'height/left/width/y': () => {
          let W2 = this.width / 2;
          let H2 = this.height / 2;
          this.top = this.y - H2;
          this.bottom = this.y + H2;
          this.x = this.left + W2;
          this.right = this.left + this.width;
        },
        'height/right/width/y': () => {
          let W2 = this.width / 2;
          let H2 = this.height / 2;
          this.top = this.y - H2;
          this.bottom = this.y + H2;
          this.x = this.right - W2;
          this.left = this.right - this.width;
        },
        'height/top/width/x': () => {
          let W2 = this.width / 2;
          let H2 = this.height / 2;
          this.y = this.top + H2;
          this.bottom = this.top + this.height;
          this.left = this.x - W2;
          this.right = this.x + W2;
        },
        'bottom/height/width/x': () => {
          let W2 = this.width / 2;
          let H2 = this.height / 2;
          this.y = this.bottom - H2;
          this.top = this.bottom - this.height;
          this.left = this.x - W2;
          this.right = this.x + W2;
        },
      }) as {
        [k: string]: () => undefined;
      }
    )[alg]();

    return this as Rect;
  }

  /**
   * 按照 keys 取出 rect 中的属性，组成原生对象返回
   * @param keys 属性简写字符串
   * @param dft 属性默认值
   * @returns 含有指定属性的原生对象
   */
  raw(keys = 'tlwh', dft?: number): Record<string, number> {
    return _.isNil(dft) ? pickKeys(this, keys) : pickKeys(this, keys, dft);
  }
  /**
   * 将自己所有的尺度都进行四舍五入
   * @param precise 精确度，100 表示保持小数点后2位
   * @returns 自身
   */
  round(precise = 1): Rect {
    this.top = Num.round(this.top, precise);
    this.left = Num.round(this.left, precise);
    this.right = Num.round(this.right, precise);
    this.bottom = Num.round(this.bottom, precise);
    this.width = Num.round(this.width, precise);
    this.height = Num.round(this.height, precise);
    this.x = Num.round(this.x, precise);
    this.y = Num.round(this.y, precise);
    return this as Rect;
  }

  /**
   * 将一个矩形转换为得到一个 CSS 的矩形描述
   * 即 right,bottom 是相对于视口的右边和底边的
   * keys 可选，比如 "top,left,width,height" 表示只输出这几个CSS的值
   * 如果不指定 keys，则返回的是 "top,left,width,height,right,bottom"
   * keys 也支持快捷定义:
   *   - "tlwh" : "top,left,width,height"
   *   - "tlbr" : "top,left,bottom,right"
   * @param keys
   * @param viewport
   */
  toCss(
    keys: string = 'tlwh',
    viewport: Size2D = {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  ): Vars {
    // 计算
    var css = {
      top: this.top,
      left: this.left,
      width: this.width,
      height: this.height,
      right: viewport.width - this.right,
      bottom: viewport.height - this.bottom,
    };
    return pickKeys(css, keys);
  }

  /**
   * 将当前矩形(小矩形)，以基准矩形(大矩形)为基准，计算相对位置的 top 和 left。
   * scroll 是为了处理  大矩形的有滚动的情形。
   *
   * 原注释:
   *  得到一个新 Rect，左上顶点坐标系相对于 base (Rect)
   *  如果给定 forCss=true，则将坐标系统换成 CSS 描述
   *  baseScroll 是描述 base 的滚动，可以是 Element/jQuery
   *  也可以是 {x,y} 格式的对象
   *  默认为 {x:0,y:0}
   *
   * @param rect 基准矩形(大矩形)
   * @param scroll 相对基准矩形的移动，默认为 {x:0,y:0}
   * @returns 移动后的矩形
   */
  relative(rect: Rect, scroll = { x: 0, y: 0 }) {
    // 计算相对位置
    this.top = this.top - (rect.top - scroll.y);
    this.left = this.left - (rect.left - scroll.x);
    return this.updateBy('tlwh');
  }

  /**
   * 将一个与自己相同坐标系的点，转换为以自己为坐标系的点
   * @param p2d 给定点
   * @returns 以自己为坐标系的点
   */
  coordOnMe(p2d: Point2D): Point2D {
    return {
      x: p2d.x - this.left,
      y: p2d.y - this.top,
    };
  }

  /**
   * 判断给定点落在哪个象限里
   *
   * ```
   *             |
   *    top-left | top-right
   * ------------+-----------
   *  bottom-left| bottom-right
   *             |
   * ```
   */
  getQuadrant(p2d: Point2D): QuadrantName {
    // top
    if (p2d.y < this.y) {
      return p2d.x < this.x ? 'top-left' : 'top-right';
    }
    // bottom
    return p2d.x < this.x ? 'bottom-left' : 'bottom-right';
  }

  /**
   * 缩放矩形
   * @param param0
   *  对象参数属性如下:
   *  - x : X 轴缩放
   *  - y : Y 轴缩放，默认与 zoomX 相等
   *  - centre : 相对的顶点 {x,y}，默认取自己的中心点
   * @returns 矩形本身
   */
  // zoom({
  //   x = 1,
  //   y = x,
  //   centre = { x: this.x, y: this.y },
  // }: Partial<Point2D> & {
  //   centre?: Point2D;
  // })
  zoom(scale: Partial<Point2D>, centre?: Point2D): Rect {
    let x = scale.x ?? 1;
    let y = scale.y ?? x;
    centre = centre ?? { x: this.x, y: this.y };
    this.top = (this.top - centre.y) * y + centre.y;
    this.left = (this.left - centre.x) * x + centre.x;
    this.width = this.width * x;
    this.height = this.height * y;
    return this.updateBy('tlwh');
  }

  /**
   * 将给定矩形等比缩放到适合宽高
   * @param param0
   *  对象参数属性如下:
   *  - width  : 最大宽度
   *  - height : 最大高度
   *  - mode   : 缩放模式
   *    - contain : 确保包含在内
   *    - cover   : 最大限度撑满视口
   * @returns 矩形自身
   */
  zoomTo(options: RectZoomToOptions): Rect {
    let { width, height, mode = 'contain', round = false } = options;
    // 无需缩放的情况
    if ('contain' == mode) {
      let viewport = new RectImpl({ top: 0, left: 0, width, height });
      if (viewport.contains(this as Rect)) {
        return this as Rect;
      }
    }

    // 获得尺寸
    let w: number = width;
    let h: number = height;
    let oW: number = this.width;
    let oH: number = this.height;
    let oR: number = oW / oH;
    let nR: number = w / h;

    let nW: number, nH: number;

    // Too wide
    if (oR > nR) {
      // Cover
      if ('cover' == mode) {
        nH = h;
        nW = h * oR;
      }
      // Contain
      else {
        nW = w;
        nH = w / oR;
      }
    }
    // Too hight
    else if (oR < nR) {
      // Cover
      if ('cover' == mode) {
        nW = w;
        nH = w / oR;
      }
      // Contain
      else {
        nH = h;
        nW = h * oR;
      }
    }
    // Then same
    else {
      nW = w;
      nH = h;
    }

    this.width = round ? Math.round(nW) : nW;
    this.height = round ? Math.round(nH) : nH;

    return this.updateBy('tlwh');
  }

  /**
   * 移动自己到指定视口的中间
   * @returns 移动后的矩形
   */
  centreTo(
    options: RectCentreToOptions,
    axis?: { xAxis?: boolean; yAxis?: boolean }
  ): Rect {
    let { width, height, top = 0, left = 0 } = options;
    let { xAxis = true, yAxis = true } = axis ?? {};
    // Translate xAxis
    if (xAxis) {
      if (width > 0) {
        let w = width - this.width;
        this.left = left + w / 2;
      }
    }
    // Translate yAxis
    if (yAxis) {
      if (height > 0) {
        let h = height - this.height;
        this.top = top + h / 2;
      }
    }

    return this.updateBy('tlwh');
  }

  /**
   * 移动矩形，垂直方向和水平方向要移动的偏移量
   * @param p
   * 对象参数的属性
   *  - x   : X 轴位移
   *  - y   : Y 周位移
   * @returns 移动后的矩形
   */
  translate(p: Point2D = { x: 0, y: 0 }): Rect {
    this.x += p.x;
    this.y += p.y;
    return this.updateBy('xywh');
  }

  /**
   * 根据偏移量来移动矩形, 基准点是矩形的四个顶角之一。
   *
   * @param pos 当前位置坐标
   * @param offset x轴, y轴 偏移量
   * @param mode 基准顶点
   *  可以是 "tl", "tr", "bl", "br" 中的一个:
   *  - tl: top/leftm
   *  - tr: top/right
   *  - bl: bottom/left
   *  - br: bottom/right
   * @returns
   */
  moveTo(
    pos: Point2D = { x: 0, y: 0 },
    offset: Point2D = { x: 0, y: 0 },
    mode = 'tl'
  ): Rect {
    // _.defaults(pos, { x: 0, y: 0 });
    // _.defaults(offset, { x: 0, y: 0 });
    let ary = explainToArray(mode);
    let alg = ary.join('/');
    (
      ({
        'left/top': () => {
          this.left = pos.x - offset.x;
          this.top = pos.y - offset.y;
          this.updateBy('tlwh');
        },
        'right/top': () => {
          this.right = pos.x + offset.x;
          this.top = pos.y - offset.y;
          this.updateBy('trwh');
        },
        'bottom/left': () => {
          this.left = pos.x - offset.x;
          this.bottom = pos.y + offset.y;
          this.updateBy('blwh');
        },
        'bottom/right': () => {
          this.right = pos.x + offset.x;
          this.bottom = pos.y + offset.y;
          this.updateBy('brwh');
        },
      }) as {
        [k: string]: () => undefined;
      }
    )[alg]();

    return this as Rect;
  }

  /**
   * 把当前矩形停靠在目标矩形的边上, 具体位置依照 axis 而定。
   *
   * ```
   *                 H:center/top
   *          H:left/top          H:right:top
   *    V:left/top +----------------+ V:right/top
   *               |                |
   * V:left:center |                | V:right:center
   *               |                |
   * V:left/bottom +----------------+ V:right:bottom
   *       H:left/bottom          H:right:bottom
   *                H:center/bottom
   * ```
   *
   * @param rect{Rect}`R` - 目标矩形
   * @param axis.x{String} - X轴(横向)停靠模式:
   *  - `left`   : 停靠到左边
   *  - `right`  : 停靠到右边
   *  - `center` : 停靠到中间
   * @param axis.y{String} - Y轴(纵向)停靠模式:
   *  - `top`    : 停靠到上边
   *  - `bottom` : 停靠到底部
   *  - `center` : 停靠到中间
   * @param space.x{int} - 垂直侧间距
   * @param space.y{int} - 水平侧间距 spacing for horizontal-side
   * @param viewportBorder{int}
   * @param wrapCut{Boolean}
   *
   * @return {Self} 停靠模式
   */
  dockTo(
    rect: Rect,
    {
      mode = 'H',
      axis = { x: 'center', y: 'bottom' },
      space = { x: 0, y: 0 },
      viewport,
      viewportBorder = 4,
      wrapCut = false,
    } = {} as DockOptions
  ): string {
    let _space: Point2D;
    if (_.isNumber(space)) {
      _space = { x: space, y: space };
    } else if (!space) {
      _space = { x: 0, y: 0 };
    } else {
      _space = space;
    }
    // _.defaults(axis, { x: "center", y: "bottom" });
    // _.defaults(_space, { x: 0, y: 0 });
    let alg = mode + ':' + axis.x + '/' + axis.y;
    (
      ({
        'V:left/top': () => {
          this.right = rect.left - _space.x;
          this.top = rect.top + _space.y;
          this.updateBy('rtwh');
        },
        'V:left/center': () => {
          this.right = rect.left - _space.x;
          this.y = rect.y + _space.y;
          this.updateBy('rywh');
        },
        'V:left/bottom': () => {
          this.right = rect.left - _space.x;
          this.bottom = rect.bottom - _space.y;
          this.updateBy('rbwh');
        },
        'V:right/top': () => {
          this.left = rect.right + _space.x;
          this.top = rect.top + _space.y;
          this.updateBy('ltwh');
        },
        'V:right/center': () => {
          this.left = rect.right + _space.x;
          this.y = rect.y + _space.y;
          this.updateBy('lywh');
        },
        'V:right/bottom': () => {
          this.left = rect.right + _space.x;
          this.bottom = rect.bottom - _space.y;
          this.updateBy('lbwh');
        },
        'H:left/top': () => {
          this.left = rect.left + _space.x;
          this.bottom = rect.top - _space.y;
          this.updateBy('lbwh');
        },
        'H:left/bottom': () => {
          this.left = rect.left + _space.x;
          this.top = rect.bottom + _space.y;
          this.updateBy('ltwh');
        },
        'H:center/top': () => {
          this.x = rect.x + _space.x;
          this.bottom = rect.top - _space.y;
          this.updateBy('xbwh');
        },
        'H:center/bottom': () => {
          this.x = rect.x + _space.x;
          this.top = rect.bottom + _space.y;
          this.updateBy('xtwh');
        },
        'H:right/top': () => {
          this.right = rect.right - _space.x;
          this.bottom = rect.top - _space.y;
          this.updateBy('rbwh');
        },
        'H:right/bottom': () => {
          this.right = rect.right - _space.x;
          this.top = rect.bottom + _space.y;
          this.updateBy('rtwh');
        },
      }) as {
        [k: string]: Function;
      }
    )[alg]();

    // Wrap cut
    let dockMode = 'tl';
    if (wrapCut && viewport) {
      let viewport2 = viewport.clone(viewportBorder);
      // Wrap at first
      viewport2.wrap(this);
      // If still can not contains, overlay it
      if (!viewport2.contains(this)) {
        this.overlap(viewport2);
        dockMode = 'tlwh';
      }
    }
    // return
    return dockMode;
  }

  /**
   *
   * 和 `dockTo` 类似，但是停靠在目标矩形的内部
   *
   *         +------top-------+
   *         |       |        |
   *       left----center----right
   *         |       |        |
   *         +-----bottom-----+
   * @see #dockTo
   */
  dockIn(rect: Rect, axis: DockAxis, space = { x: 0, y: 0 } as Point2D): Rect {
    _.defaults(axis, { x: 'center', y: 'center' });
    _.defaults(space, { x: 0, y: 0 });

    let alg = axis.x + '/' + axis.y;
    (
      ({
        'left/top': () => {
          this.left = rect.left + space.x;
          this.top = rect.top + space.y;
          this.updateBy('ltwh');
        },
        'left/center': () => {
          this.left = rect.left + space.x;
          this.y = rect.y + space.y;
          this.updateBy('lywh');
        },
        'left/bottom': () => {
          this.left = rect.left + space.x;
          this.bottom = rect.bottom - space.y;
          this.updateBy('lbwh');
        },
        'right/top': () => {
          this.right = rect.right - space.x;
          this.top = rect.top + space.y;
          this.updateBy('rtwh');
        },
        'right/center': () => {
          this.right = rect.right - space.x;
          this.y = rect.y + space.y;
          this.updateBy('rywh');
        },
        'right/bottom': () => {
          this.right = rect.right - space.x;
          this.bottom = rect.bottom - space.y;
          this.updateBy('brwh');
        },
        'center/center': () => {
          this.x = rect.x + space.x;
          this.x = rect.y + space.y;
          this.updateBy('xywh');
        },
      }) as { [k: string]: () => undefined }
    )[alg]();

    return this as Rect;
  }

  //--------------------------------------
  /***
   * Make given rect contained by self rect(as viewport).
   * It will auto move the given rect to suited position.
   * If still can not fail to contains it, let it be.
   *
   * @param rect{Rect} : target rect
   *
   * @return target rect
   *
   */
  wrap(rect: Rect): Rect {
    let ms = ['w', 'h'];
    //....................................
    // Try X
    if (!this.containsX(rect)) {
      // [viewport]{given} or [viewport {gi]ven}
      if (rect.left > this.left && rect.right > this.right) {
        rect.right = this.right;
        ms.push('r');
      }
      // {given}[viewport] or { gi[ven }viewport ]
      // {giv-[viewport]-en}
      else {
        rect.left = this.left;
        ms.push('l');
      }
    }
    //....................................
    // Try Y
    if (!this.containsY(rect)) {
      // top:=> [viewport]{given} or [viewport {gi]ven}
      if (rect.top > this.top && rect.bottom > this.bottom) {
        rect.bottom = this.bottom;
        ms.push('b');
      }
      // top:=> {given}[viewport] or { gi[ven }viewport ]
      // top:=> {giv-[viewport]-en}
      else {
        rect.top = this.top;
        ms.push('t');
      }
    }
    // Has already X
    else if (ms.length == 3) {
      ms.push('t');
    }
    //....................................
    // Lack X
    if (3 == ms.length) {
      ms.push('l');
    }
    //....................................
    // Update it
    if (4 == ms.length) {
      return rect.updateBy(ms.join(''));
    }
    //....................................
    // Done
    return rect;
  }
  //--------------------------------------
  /***
   * Make given rect contained by self rect(as viewport).
   * It will auto move the given rect to suited position.
   * If still can not fail to contains it, do the overlap
   *
   * @param rect{Rect} : target rect
   *
   * @return target rect
   *
   */
  wrapCut(rect: Rect): Rect {
    // Wrap at first
    this.wrap(rect);
    // If still can not contains, overlay it
    if (!this.contains(rect)) {
      rect.overlap(this);
    }
    return rect;
  }

  /***
   * Union current rectangles with another
   */
  union(...rects: Rect[]): Rect {
    for (let rect of rects) {
      this.top = Math.min(this.top, rect.top);
      this.left = Math.min(this.left, rect.left);
      this.right = Math.max(this.right, rect.right);
      this.bottom = Math.max(this.bottom, rect.bottom);
    }
    return this.updateBy('tlbr');
  }

  overlap(...rects: Rect[]): Rect {
    for (let rect of rects) {
      this.top = Math.max(this.top, rect.top);
      this.left = Math.max(this.left, rect.left);
      this.right = Math.min(this.right, rect.right);
      this.bottom = Math.min(this.bottom, rect.bottom);
    }
    return this.updateBy('tlbr');
  }

  contains(rect: Rect, border = 0): boolean {
    return this.containsX(rect, border) && this.containsY(rect, border);
  }

  containsX(rect: Rect, border = 0): boolean {
    return this.left + border <= rect.left && this.right - border >= rect.right;
  }

  containsY(rect: Rect, border = 0): boolean {
    return this.top + border <= rect.top && this.bottom - border >= rect.bottom;
  }

  hasPoint(point: Point2D, border = 0): boolean {
    return this.hasPointX(point.x, border) && this.hasPointY(point.y, border);
  }
  //--------------------------------------
  hasPointX(x = 0, border = 0): boolean {
    return this.left + border <= x && this.right - border >= x;
  }
  //--------------------------------------
  hasPointY(y = 0, border = 0): boolean {
    return this.top + border <= y && this.bottom - border >= y;
  }

  //--------------------------------------
  isOverlap(rect: Rect): boolean {
    let t = Math.max(this.top, rect.top);
    let l = Math.max(this.left, rect.left);
    let r = Math.min(this.right, rect.right);
    let b = Math.min(this.bottom, rect.bottom);
    let w = r - l;
    let h = b - t;
    return w > 0 && h > 0;
  }
  //--------------------------------------
  /***
   * @return Current rectangle area
   */
  area(): number {
    return this.width * this.height;
  }

  clone(border = 0): Rect {
    return new RectImpl(
      {
        left: this.left + border,
        right: this.right - border,
        top: this.top + border,
        bottom: this.bottom - border,
      },
      'tlbr'
    );
  }
}

/**
 * 若是一个Element，则根据其DomRect创建矩形;
 *
 *
 * @param $el Element | Document | Window 中的一种
 * @returns 创建的矩形
 */
export function createBy(
  $el: Element | Document | Window | Rect | RectInfo
): Rect {
  if (_.isNil($el)) {
    return new RectImpl() as Rect;
  }
  if (isRect($el)) {
    return $el.clone();
  }
  if (isHTMLElement($el)) {
    let { top, left, width, height } = $el.getBoundingClientRect();
    return new RectImpl(
      {
        top,
        left,
        width,
        height,
      },
      'tlwh'
    ) as Rect;
  }
  let wd;
  if (isDocument($el)) {
    wd = $el.defaultView;
  } else if (isWindow($el)) {
    wd = $el;
  } else {
    return new RectImpl($el as RectInfo) as Rect;
  }

  if (!wd) {
    throw new Error('Cannot create rect with null window!');
  }

  let w = wd.document.documentElement.clientWidth;
  let h = wd.document.documentElement.clientHeight;
  return new RectImpl({ top: 0, left: 0, width: w, height: h }) as Rect;
}

export function union(...rects: Rect[]): Rect {
  // empty
  if (rects.length == 0) {
    return new RectImpl();
  }

  let r0: Rect = new RectImpl(rects[0]);
  r0.union(...rects.slice(1));

  return r0;
}

export function overlap(...rects: Rect[]): Rect {
  // empty
  if (rects.length == 0) {
    return new RectImpl() as Rect;
  }

  let r0: Rect = new RectImpl(rects[0]);
  r0.overlap(...rects.slice(1));

  return r0;
}

export function isRect(input: any): input is Rect {
  if (input && _.isFunction(input.__I_am_rect)) {
    return input.__I_am_rect();
  }
  return false;
}
