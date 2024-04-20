import { ActionBarItem, ComRef, CommonProps, EmitAdaptorProps, IconInput } from '..';
import { CssGridItem, CssGridLayout, PopPosition, Vars } from '../../core';

export type LayoutSchema = Record<string, ComRef>;

export type LayoutState = {
  shown: Record<string, boolean>;
};

export type LayoutProps = CommonProps &
  Pick<LayoutItem, 'name' | 'blocks'> & {
    schema?: LayoutSchema;

    /**
     * 统一为所有的布局项设置一个样式
     */
    itemStyle?: Vars;
  };

export type TabsProps = {
  /**
   * @default `top`
   */
  tabAt?: 'top' | 'bottom';
  /**
   * @default `center`
   */
  tabAlign?: 'left' | 'right' | 'center';
  /**
   * @default `0`
   */
  defaultTab?: string | number;
};

export type LayoutBar = {
  /**
   * 拖动条模式：
   *
   * - `column` 调整列宽，因此是一个竖条
   * - `row` 调整行高，因此是一个横条
   */
  mode: 'column' | 'row';

  /**
   * 拖动将调整哪个行/列（0 Base下标）。
   * 根据 `mode` 我们可以知道，你想修改的是
   * `gridTemplateColumns` 还是 `gridTemplateRows`
   */
  adjustIndex: number;

  // /**
  //  * 指定一个邻接布局块的。这个块是用来获取调整时的尺寸参考。
  //  * 当拖动开始时，我们可以通过控制柄所在的块，得到本行/列的初始尺寸，
  //  * 但是如果我们需要根据 `prev|next` 来调整相邻行/列的尺寸，我们还需要
  //  * 要相邻行/列的初始尺寸，这个属性如果声明的话，我们就能取到这个块的元素了。
  //  *
  //  * 如果不指定这个属性，将不会调整相邻区块，如果格子布局不合理
  //  * 可能会导致比较怪异的体验
  //  */
  // adjacentBlock?: string;

  /**
   * 拖动条位置
   *
   * - `prev` 调整与前一列/行的大小
   * - `next` 调整与后一列/行的大小
   *
   * 如果我们假设  adjustIndex=2 那么：
   *
   * | mode   | prev  | next  |
   * |--------|-------|-------|
   * | column |`[1,2]`|`[2,3]`|
   * | row    |`[1,2]`|`[2,3]`|
   *
   * 拖动将涉及上传的行/列的格子轨道改动
   */
  position: 'prev' | 'next';
};

export type LayoutItemType = 'block' | 'grid' | 'tabs';
export type LayoutBlock = TabsProps & {
  /**
   * 块的布局内唯一键，如果不指定，则会依次尝试：
   *
   * 1. name
   * 2. `B${index}`  // index 是块下标 0 base
   */
  uniqKey?: string;
  /**
   * 本布局项的名称，在事件传递中，会将自己名称叠加在事件名称前缀
   * 譬如，如果 `name="foo"`，当收到任何一个总线消息，譬如"bar"，那么
   * 会向父总线发送 "foo::bar" 这个消息。这样，在父总线，通过名称
   * 就能区分出是哪个布局项下的控件发出的消息。
   *
   * 当然，如果你不声明这个属性，则不会改变消息的名称，因为毕竟有些消息
   * 名称很特殊，没必要增加这个前缀。
   */
  name?: string;

  /**
   * 当 `type='block|tabs'` 时，从 `schema` 的哪个键获取块定义。
   */
  icon?: IconInput;
  title?: string;
  className?: any;
  grid?: CssGridItem;
  style?: Vars;

  /**
   * 拖动控制条，这个只对 Grid 布局有效
   */
  bar?: LayoutBar | LayoutBar[];

  /**
   * 当 `type='grid|tabs'` 时，需要知道自己的子项目都是什么
   */
  blocks?: LayoutBlock[];

  /**
   * 布局项的类型支持：
   *
   * - `block`: 一个布局块，直接引用某个在 `schema` 里定义的控件,
   *           块的外观标题等采用 BlockInfoProps 里的属性
   * - `grid`: 作为一个子布局，必须需要 `layout + blocks`
   * - `tabs`: 作为一个标签子布局，需要  `blocks`,
   *           其中每个块的 `icon/title`等属性也将作为标签的标题和图标
   *
   * 默认的，会自动根据属性来决定类型，判断的顺序是：
   *
   * 1. 如果声明了 body 就认为是 `block`
   * 2. 如果声明了 `layout` 就认为是 `grid`
   * 3. 如果声明了 `blocks` 就认为是 `tabs`
   *
   * 如果
   */
  type?: LayoutItemType;

  /**
   * 当 `type='block'` 时，从 `schema` 的哪个键获取块定义。
   * 当然，如果未声明这个属性，也会尝试用 name 来获取。
   *
   * 当然你可以直接声明 comType/comConf
   *
   * 如果都未声明，那么一定是调用者脑袋进水了，这个布局块将啥也显示不出来
   */
  body?: string;
  comType?: string;
  comConf?: Vars;

  /**
   * 如果项目的类型是 `grid` 那么则必须一个 `layout` 属性
   * 如果未指定，则会默认给一个 `1fr`
   */
  layout?: CssGridLayout;
};
/**
 * 根据 `LayoutBlock` 解析出来的布局块显示项
 */
export type LayoutItem = LayoutBlock & {
  uniqKey: string;
  index: number;
  conStyle?: Vars;
  itemConfig?: Vars;
};

export type TranSpeed = 'slow' | 'normal' | 'fast';
export type TranName =
  | 'ti-slide-up'
  | 'ti-slide-down'
  | 'ti-slide-left'
  | 'ti-slide-right'
  | 'ti-zoom';

export type PopItemProps = {
  position?: PopPosition;
  tranSpeed?: TranSpeed;
  showMask?: boolean;
  clickMaskToClose?: boolean;
  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
  minWidth?: string;
  minHeight?: string;
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  overflow?: string;
};

export type BlockInfoProps = {
  // 声明标题栏，如果有 icon || title 就显示标题栏
  icon?: IconInput;
  title?: string;

  /**
   * 块名称
   */
  name?: string;

  //
  // 右上角菜单
  //
  actions?: ActionBarItem[];

  //
  // 外观样式
  //
  headStyle?: Vars;
  mainStyle?: Vars;
};
export type BlockProps = CommonProps &
  CssGridItem &
  BlockInfoProps &
  ComRef &
  EmitAdaptorProps;
