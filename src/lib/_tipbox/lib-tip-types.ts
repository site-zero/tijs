import { PopItemMeasure, TextContentType, TranSpeed, Vars } from '../../_type';

export type TipPosition =
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'left-top'
  | 'right-top'
  | 'bottom-left'
  | 'bottom-right'
  | 'x-auto'
  | 'y-auto';

type TipAspect = PopItemMeasure & {
  position?: TipPosition;
  tranSpeed?: TranSpeed;
  // H: 水平边, 会放置在目标对象上方，实在放不下，才会放置在目标
  //    对象下面
  // V: 垂直边，目标对象在屏幕左侧，就放右边，否则就放左边
  dockMode?: 'H' | 'V'
  selector?: HTMLElement | string;
};

export type TipBoxProps = TipAspect & {
  /**
   * 一个 tip 的唯一 ID，如果调用者不指定
   * 那么，会被自动分配一个
   */
  id: string;
  appId: string;
  comId: string;

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
  disabled: boolean;

  /**
   * 指定了变量上下文，因此 content 会根据这个上下文动态渲染
   */
  vars: Vars | (() => Vars);

  /**
   * 这个是一个内容模板，或者就是内容本身
   * 主要取决于 vars，如果声明了 vars ，每次显示
   * 都需要渲染一遍
   */
  content: string;

  contentType: TextContentType;

  /**
   * 这个 tip 非常复杂，需要指定一个控件来显示
   * 如果声明了这个属性，那么上面的 `content/vars` 就都会被无视了
   */
  comType?: string;

  /**
   * 如果声明了 comType，在这个字段里声明控件的配置信息
   */
  comConf?: Vars;
};

export type TipTarget = TipBoxProps & {
  target: HTMLElement;
};
