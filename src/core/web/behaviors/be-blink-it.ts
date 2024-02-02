import { Callback1, Dom, DomSelector, Rects } from "../../";
import _ from "lodash";

export type BlinkOptions = {
  /**
   * 当你需要个性化的闪烁效果时，你可以提供一个回调函数作为参数，
   * `BlinkIt` 会将默认的 闪烁块元素（div元素）传递给回调函数，
   * 你可以按照自己的意愿对该 div 元素进行效果改造。
   */
  update?: Callback1<Element>;

  // 执行完 Blink 后的回调
  after?: Callback1<Element>;
  /**
   * 闪烁持续时间（毫秒）
   *
   * @default 800
   */
  speed?: number;
};

export function BlinkIt(it: DomSelector, options = {} as BlinkOptions): void {
  let { update, after, speed = 800 } = options;

  let el = Dom.find(it);
  if (!el) {
    return;
  }

  // 样式
  let rect = Rects.createBy(el);
  let css = rect.toCss();
  _.assign(css, {
    "transition": `opacity ${speed}ms`,
    "border-color": "#FF0",
    "background": "#FFA",
    "opacity": 0.8,
    "position": "fixed",
    "z-index": 9999999
  });

  let blinkEl = Dom.createElement({
    tagName: "div",
    className: "ti-blink-light",
    style: css
  });

  if (_.isFunction(update)) {
    update(blinkEl);
  }

  Dom.appendToBody(blinkEl, el.ownerDocument.body);

  _.delay(() => {
    Dom.updateStyle(blinkEl, { opacity: 0 });
  }, 1);

  _.delay(() => {
    Dom.remove(blinkEl);
    if (_.isFunction(after)) {
      after(el!);
    }
  }, speed + 1);
}