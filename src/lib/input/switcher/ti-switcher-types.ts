import { OptionsProps, SelectableProps } from '../../';
import {
  AspectSize,
  CommonProps,
  LogicType,
  TableRowID,
  Vars,
} from '../../../_type';

export type SwitcherProps = CommonProps &
  Pick<SelectableProps<TableRowID>, 'minChecked' | 'maxChecked'> &
  Omit<OptionsProps, 'mustInOptions'> & {
    multi?: boolean;

    readonly?: boolean;

    /**
     * 值，如果多选就是数组，如果单选就是单个值
     */
    value?: TableRowID | TableRowID[];

    defaultItemType?: LogicType;

    /**
     * 选项强制不折行
     */
    nowrap?: boolean;

    style?: Vars | string;
    itemStyle?: Vars | string;

    /**
     * 选项字体大小
     */
    itemSize?: AspectSize;

    /**
     * 选项间距
     */
    itemGap?: AspectSize | 'none';

    /**
     * 选项圆角
     */
    itemRadius?: AspectSize | 'none';
  };
