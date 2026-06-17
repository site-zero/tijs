import { RoadblockProps, SelectableProps, SelectEmitInfo } from "@site0/tijs";
import {
  CommonProps,
  ComRef,
  GridLayoutProps,
  LogicType,
  TableRowID,
  TextFragment,
  TiRawCom,
  Vars,
} from "../../../_type";
import { WallApi } from "./use-wall";

export type WallMode = "list" | "wall";

export type WallProps = CommonProps &
  ComRef &
  SelectableProps<TableRowID> &
  GridLayoutProps & {
    /**
     * 传入的数据对象
     */
    data?: Vars[];

    /**
     * 更多渲染时的上下文
     *
     * 每一个墙贴项目，会用 comConf 对 `data[i] + vars`
     * 作为上下文进行渲染
     *
     */
    vars?: Vars;

    /**
     * 是否支持多选
     */
    multi?: boolean;

    /**
     * 显示模式
     */
    mode?: WallMode;

    /**
     * 首尾扩展插槽
     */
    head?: TextFragment;
    tail?: TextFragment;

    /**
     * 空白数据，显示的样式
     */
    emptyRoadblock?: RoadblockProps;

    /**
     * 墙贴的顶级样式
     */
    style?: Vars;
    conStyle?: Vars;

    /**
     * 自定义墙贴项。
     *
     * 通过 `comType|comConf` 可以指明墙贴项。
     * 如果需要更高的定制性，可以声明本属性。
     *
     * 通过一个回调函数，可以为每个数据项指定不同的墙贴项
     *
     * @param itemContext 墙贴项渲染上下文
     * `{ ...vars,  logicType, isCurrent, isChecked, index, item }`
     * @returns 墙贴项的控件具体渲染方式
     */
    wallItem?: (itemContext: Vars) => Required<ComRef>;

    /**
     * 处理每个定制项目的事件
     */
    itemEventHandlers?: WallItemEventHandlers;

    /**
     * 每个项目的样式
     */
    itemStyle?: Vars;
    itemConStyle?: Vars;
    getItemStyle?: (item: Vars, index: number) => Vars;
    getItemConStyle?: (item: Vars, index: number) => Vars;
    getItemClass?: (item: Vars, index: number) => Vars;
    getItemConClass?: (item: Vars, index: number) => Vars;
    getItemLogicType?: (item: Vars, index: number) => LogicType | undefined;

    /**
     * 当选区变化，自动滚动
     */
    autoScrollIntoView?: boolean | undefined;

    /**
     * 有时候， 列表所在一个容器元素内，列表自动延长。
     * 这时候需要传入容器元素。
     *
     * 譬如在 droplist options 比较长的时候，就需要这样做
     *
     * @returns 如果自动滚动当前项目，可以指定滚动视口
     */
    scrollViewPort?: () => HTMLElement | undefined;
  };

export type WallItemEventHandlers = Record<
  string,
  (ctx: WallItemEventContext) => Promise<void>
>;

export type WallItemEventContext = {
  wall: WallApi;
  item: WallItem;
  payload: any;
};

export type WallItem = {
  index: number;
  id: TableRowID;
  type?: LogicType;
  style: Vars;
  className: Vars;
  conStyle?: Vars;
  conClass?: Vars;
  // 对应的数据项目
  rawData: Vars;

  comType: TiRawCom;
  comConf: Vars;
};

// export type WallEvent = {
//   event: Event;
//   item: WallItem;
// };

export type WallSelectEmitInfo = SelectEmitInfo<TableRowID>;
export type WallEmitter = {
  (event: "select", payload: WallSelectEmitInfo): void;
  (event: "open", payload: WallItem): void;
};
