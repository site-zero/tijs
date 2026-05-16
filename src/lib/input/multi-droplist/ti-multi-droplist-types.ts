import {
  BoxAspectProps,
  BoxDropListProps,
  BoxOptionsDataProps,
  CommonProps,
  TableRowID,
  Vars,
} from "@site0/tijs";
import { DictProps, PlaceholderProps, ReadonlyProps, TagsProps } from "../../";

export type MultiDroplistEmitter = {
  (event: "change", vals: null | TableRowID[]): void;
};

export type MultiDroplistProps = CommonProps &
  DictProps &
  PlaceholderProps &
  ReadonlyProps &
  BoxAspectProps &
  BoxOptionsDataProps &
  BoxDropListProps & {
    /**
     * 值，通常应该是数组，如果不是，会被转换为数组处理
     */
    value?: TableRowID | TableRowID[] | null;

    //-----------------------------------------------------
    // 标签和列表
    //-----------------------------------------------------
    /**
     * 显示标签配置
     */
    tags?: TagsProps;

    //-----------------------------------------------------
    // 外观与样式
    //-----------------------------------------------------
    tagsStyle?: Vars;
    /**
     * 强制不换行
     */
    nowrap?: boolean;

    //-----------------------------------------------------
    // 行为模式
    //-----------------------------------------------------
    /**
     * 是否显示选项过滤框
     *
     * - `number`  : 如果选项超过了指定数量，则显示
     * - `boolean` : 直接指定是否显示
     */
    showOptionKeyword?: number | boolean;
  };
