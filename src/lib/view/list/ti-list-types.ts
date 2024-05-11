import { RoadblockProps } from '../../';
import {
  AnyOptionItem,
  CommonProps,
  Convertor,
  IconInput,
  Vars,
} from '../../../core';
import {
  SelectEmitInfo,
  SelectableProps,
} from '../../../lib/_features/use-selectable';
import { TableRowID } from '../table/ti-table-type';

export type ListProps = CommonProps &
  SelectableProps<TableRowID> & {
    /**
     * 从指定的对象获取显示图标
     * 默认，相当于 `icon`
     */
    getIcon?: string | Convertor<Vars, IconInput | undefined>;
    /**
     * 从指定的对象获取显示文本
     * 默认，相当于 `text`
     */
    getText?: string | Convertor<Vars, string | undefined>;

    /**
     * 从指定的对象获取显示提示信息
     * 默认，相当于 `tip`
     */
    getTip?: string | Convertor<Vars, string | undefined>;

    /**
     * 当列表内容为空的时候，显示的内容
     */
    blankAs?: RoadblockProps;

    // 指明如果带上 tip ， tip 栏的宽度，默认为 1fr
    tipWidth?: string;

    // 列表文字大小
    size?: 'b' | 'm' | 's';

    // 列表是否可以选择
    selectable?: boolean;

    // 是否显示列表鼠标 hover 高亮
    hoverable?: boolean;

    // 可以鼠标选择文字，默认是 false
    allowUserSelect?: boolean;
  };

export type ListItem = AnyOptionItem & {
  current: boolean;
  checked: boolean;
  className: Vars;
  index: number;
};

export type ListEvent = {
  event: Event;
  item: ListItem;
};

export type ListSelectEmitInfo = SelectEmitInfo<TableRowID>;
export type ListEmitter = {
  (event: 'select', payload: ListSelectEmitInfo): void;
};
