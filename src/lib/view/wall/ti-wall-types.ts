import { RoadblockProps, SelectableProps, SelectEmitInfo } from "../../";
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
