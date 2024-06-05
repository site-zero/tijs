import { RoadblockProps, StdListItemProps, TableRowID } from '../../';
import {
  AnyOptionItem,
  AspectSize,
  CommonProps,
  Convertor,
  CssBorderStyle,
  IconInput,
  Vars,
} from '../../../core';
import {
  SelectEmitInfo,
  SelectableProps,
} from '../../../lib/_features/use-selectable';

export type ListProps = CommonProps &
  SelectableProps<TableRowID> &
  StdListItemProps & {
    /**
     * 当列表内容为空的时候，显示的内容
     */
    blankAs?: RoadblockProps;

    // 指明如果带上 tip ， tip 栏的宽度，默认为 1fr
    tipWidth?: string;

    // 列表文字大小
    size?: AspectSize;

    // 列表项边线样式
    borderStyle?: CssBorderStyle;

    // 列表是否可以选择
    selectable?: boolean;

    // 是否显示列表鼠标 hover 高亮
    hoverable?: boolean;

    // 可以鼠标选择文字，默认是 false
    allowUserSelect?: boolean;

    autoI18n?: boolean;
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
