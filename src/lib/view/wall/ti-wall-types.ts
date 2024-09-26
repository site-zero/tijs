import {
  CommonProps,
  ComRef,
  CssGridLayout,
  LogicType,
  Vars,
} from '../../../_type';

export type WallProps = CommonProps &
  ComRef & {
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
     * 墙贴的顶级样式
     */
    style?: Vars;
    layout?: CssGridLayout;

    /**
     * 每个项目的样式
     */
    itemStyle?: Vars;
    getItemStyle?: (item: Vars, index: number) => Vars;
    getItemClass?: (item: Vars, index: number) => Vars;
    getItemLogicType?: (item: Vars, index: number) => LogicType | undefined;
  };

export type WallItem = {
  index: number;
  // 对应的数据项目
  item: Vars;
  type?: LogicType;
  style: Vars;
  className: Vars;

  comType: string;
  comConf: Vars;
};
