import {
  AspectSize,
  BlockAspectClass,
  BlockInfoProps,
  ComRef,
  CommonProps,
  CssGridItem,
  CssGridLayout,
  EmitAdaptorProps,
  PopItemProps,
  PopPosition,
  StrOptionItem,
  TranName,
  TranSpeed,
  Vars,
} from '../../../_type';
import { KeepInfo } from '../../_features';
import { LayoutGridProps } from './grid/ti-layout-grid-types';
import { LayoutTabsProps } from './tabs/ti-layout-tabs-types';

export type BlockSchema = ComRef & EmitAdaptorProps;

export type LayoutSchema = Record<string, BlockSchema>;

export type LayoutState = {
  shown: Record<string, boolean>;
};

export type LayoutProps = CommonProps &
  Pick<LayoutBlock, 'name' | 'blocks' | 'itemStyle' | 'itemClass'> & {
    schema?: LayoutSchema;
    // /**
    //  * 如果是组合的布局，这里就需要传递 true
    //  * 以便把深层组合的 block 也传递过来
    //  *
    //  * 这个属性通常不需要用户主动设置。
    //  * 在 layout -> layout 的时候，在内部设置即可
    //  */
    subLayout?: boolean;
  };

//
// Layout Panel
//
export type LayoutPanel = LayoutBlock & PopItemProps;

export type LayoutPanelItem = LayoutItem & {
  position: PopPosition;
  showMask?: boolean;
  clickMaskToClose?: boolean;
  /**
   * 得到过渡动画相关
   */
  tranSpeed?: TranSpeed;
  tranName: TranName;
  /**
   * 计算出来的，当前段面板是否是隐藏
   */
  hidden: boolean;
  visible: boolean;
};

export type LayoutPanelProps = {
  panels?: LayoutPanel[];
  panelStyle?: Vars;
};

//
// Tab Layout
//
export type TabsAt = 'top' | 'bottom';
export type TabsAlign = 'left' | 'right' | 'center';
export type TabsAspect = {
  /**
   * @default `top`
   */
  tabsAt?: TabsAt;
  /**
   * @default `center`
   */
  tabsAlign?: TabsAlign;

  /**
   * @default false
   */
  wrapTabs?: boolean;

  /**
   * 指定每个标签最大的宽度
   */
  tabMaxWidth?: string | number;

  tabItemSpace?: AspectSize;

  defaultTab?: string | number;
  keepTab?: KeepInfo;
};

export type TabDisplayItem = StrOptionItem & {
  className: Vars;
  style?: Vars;
  current: boolean;
  index: number;
};

//
// Layout Adjust Bar
//
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
export type LayoutBlock = TabsAspect &
  BlockInfoProps & {
    /**
     * 块的布局内唯一键，如果不指定，则会依次尝试：
     *
     * 1. name
     * 2. `B${index}`  // index 是块下标 0 base
     */
    uniqKey?: string;

    /**
     * 对于 Tabs 布局，就传递到 'keepTab'
     * 对于 Grid 布局，就传递到 'KeepSizes'
     */
    keep?: KeepInfo;

    /**
     * 对应块的包裹元素的类选择器
     */
    conClass?: any;
    style?: Vars;
    /**
     * 统一为所有的布局项设置一个样式
     */
    itemStyle?: Vars;
    /**
     * 统一为所有的布局项设置对应部分的 class
     */
    itemClass?: BlockAspectClass;
    /**
     * 仅当 type=block 指定 TiBlock 本身的 className
     */
    bodyClass?: any;

    grid?: CssGridItem;
    /**
     * 仅当 type=grid，指定 TiLayoutGrid 本身的 className
     */
    gridClass?: any;

    /**
     * 仅当 type=tabs 指定 TiLayoutTabs 本身的 className
     */
    tabsClass?: any;

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
  //itemConfig?: Vars; zozoh: 废弃了，采用下面的三个属性分别设置三种块
  propsForBlock?: BlockProps;
  propsForLayoutGrid?: LayoutGridProps;
  propsForLayoutTabs?: LayoutTabsProps;
};

/**
 * 块的主体区域，对于溢出内容，有两种处理模式:
 *
 * - cover: 内容将严格按照块的区域（通常由grid布局来决定），如果超过，则会自动滚动
 * - auto: 内容将会把 块的内容撑开
 */
export type BlockOverflowMode = 'cover' | 'auto';

export type BlockProps = CommonProps &
  CssGridItem &
  BlockInfoProps &
  BlockSchema;
