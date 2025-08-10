import { App } from "vue";
import {
  AspectSize,
  LogicType,
  PopItemMeasure,
  Rect,
  TextContentType,
  TranSpeed,
  Vars,
} from "../../_type";

/**
 * 四种原始定位方式
 *
 * ```
 * #########################################
 * # V-top : 垂直顶部停靠
 * +----------------------+
 * | tip xxxxx            |
 * +----------------------+
 *       +--------+
 *       | Ref El |
 *       +--------+
 * #########################################
 * # V-bottom : 垂直底部停靠
 *       +--------+
 *       | Ref El |
 *       +--------+
 * +----------------------+
 * | tip xxxxx            |
 * +----------------------+
 * #########################################
 * # H-left : 水平左侧停靠
 * +----------------------++--------+
 * | tip xxxxx            || Ref El |
 * |                      |+--------+
 * +----------------------+
 * #########################################
 * # H-right : 水平右侧停靠
 * +--------++----------------------+
 * | Ref El || tip xxxxx            |
 * +--------+|                      |
 *           +----------------------+
 * ```
 */
export type TipDockPosition = "H-left" | "H-right" | "V-top" | "V-bottom";

export type TipDockMode = "H" | "V" | TipDockPosition;

type TipAspect = PopItemMeasure & {
  dockMode?: TipDockMode;
  tranSpeed?: TranSpeed;

  // 默认 s
  fontSize?: AspectSize;

  // 默认 m
  padding?: AspectSize;

  // 默认 s
  radius?: AspectSize | "none";

  // 默认 primary
  type?: LogicType;
};

export type ModifierKey = "ALT" | "CTRL" | "SHIFT" | "META";

export type TipBoxProps = TipAspect & {
  /**
   * 指定了只有这些键被按下时，才会触发 tip 的显示
   */
  modifier?: ModifierKey | ModifierKey[];

  /**
   * Tip 延迟多长时间后显示，默认为 800ms, 如果指定了 modifier 则默认 0ms
   */
  delay?: number;

  /**
   * 当前对象是否可以被用户主动取消。
   * 默认的，如果用户声明了 tip-id 那么这个值就是 true
   * 否则就是 false。
   * 这也非常符合直觉，如果一个 tip 被赋予了人工的 ID
   * 那么，就意味着，调用者希望它被标识出来。
   * 而标识出来干什么呢？自然是做一些客制化的定制了。
   * 最主要的客制化定制，自然就是标识这个 tip 下次是否需要弹出
   */
  canDisabled?: boolean;

  /**
   * 用户标记了取消，那么下次这个 tip 将不再会被触发。
   * 要想恢复，只有两个办法:
   *
   * 1. 打开专有的管理界面，这个界面将通过 `TipManagerApi`
   *    管理对应 tip  的属性，譬如打开关闭本属性
   * 2. `ALT+CTRL+SHIFT+Mouse Hover`将会强制打开提示
   */
  disabled?: boolean;

  /**
   * 指定了变量上下文，因此 content 会根据这个上下文动态渲染
   */
  vars?: Vars | (() => Vars);

  /**
   * 这个是一个内容模板，或者就是内容本身
   * 主要取决于 vars，如果声明了 vars ，每次显示
   * 都需要渲染一遍
   */
  content?: string;

  contentType?: TextContentType;

  /**
   * 这个 tip 非常复杂，需要指定一个控件来显示
   * 如果声明了这个属性，那么上面的 `content/vars` 就都会被无视了
   */
  comType?: string;

  /**
   * 如果声明了 comType，在这个字段里声明控件的配置信息
   */
  comConf?: Vars;

  /**
   * 如果 tip 渲染的时候动态控件，当内容渲染完毕， tipbox 的尺寸可能会变化
   * 这时候应该重新 docking，因此动态控件需要发出一个事件。
   * 通常这个事件的名称应该是 `ready` 但是可以通过这个属性特别指明
   */
  readyEvent?: string;
};

export type TipInstance = {
  app: App<Element>;
  tip: TipBoxProps;
  box: Rect;
  ref: Rect;
  conTransform: string;
  tr_du: number;
  $target: HTMLElement;
  $tipbox: HTMLElement;
  $tipcon: HTMLElement;
};
