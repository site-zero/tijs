import { SelectableProps, SelectEmitInfo } from "../../";
import {
  CommonProps,
  ComRef,
  GridLayoutProps,
  LogicType,
  TableRowID,
  TiRawCom,
  Vars,
} from "../../../_type";

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
     * 墙贴的顶级样式
     */
    style?: Vars;
    conStyle?: Vars;

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

export type WallEvent = {
  event: Event;
  item: WallItem;
};

export type WallSelectEmitInfo = SelectEmitInfo<TableRowID>;
export type WallEmitter = {
  (event: "select", payload: WallSelectEmitInfo): void;
  (event: "open", payload: WallItem): void;
};
