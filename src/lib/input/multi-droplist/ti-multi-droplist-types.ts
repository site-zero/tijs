import {
  DictProps,
  ListProps,
  PlaceholderProps,
  ReadonlyProps,
  TagsProps,
} from '../../';
import { CommonProps, TableRowID, Vars } from '../../../_type';
import { ValueOptionsProps } from '../box2/use-value-options';

export type MultiDroplistEmitter = {
  (event: 'change', vals: null | TableRowID[]): void;
};

export type MultiDroplistProps = CommonProps &
  PlaceholderProps &
  ReadonlyProps &
  DictProps &
  ValueOptionsProps & {
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

    /**
     * 提示列表的配置
     */
    tipList?: Omit<ListProps, 'data'>;

    /**
     * 展出提示框宽度，如果不声明，则采用与 box 相同的宽度
     */
    tipListWidth?: string;

    /**
     * 展出提示框最小宽度，如果不声明，则采用与 box 相同的宽度
     */
    tipListMinWidth?: string;

    //-----------------------------------------------------
    // 外观与样式
    //-----------------------------------------------------
    hideBorder?: boolean;

    style?: Vars;
    tagsStyle?: Vars;
    width?: string;

    /**
     * 强制不换行
     */
    nowrap?: boolean;
  };
