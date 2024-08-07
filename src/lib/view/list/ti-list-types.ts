import { RoadblockProps, StdListItemProps } from '../../';
import {
  AnyOptionItem,
  AspectSize,
  CommonProps,
  CssBorderStyle,
  TableRowID,
  Vars,
} from '../../../_type';
import {
  SelectEmitInfo,
  SelectableProps,
} from '../../../lib/_features/use-selectable';

export type ListProps = CommonProps &
  SelectableProps<TableRowID> &
  StdListItemProps & {
    /**
     * 传入的数据对象
     */
    data?: Vars[];
    /**
     * 当列表内容为空的时候，显示的内容
     */
    emptyRoadblock?: RoadblockProps;

    /**
     * 列表显示文字如何格式化:
     *
     * 可以直接给一个字符串模板，上下文就是 `ListItem & {raw}`
     * 譬如 `${value} - ${text}`
     *
     * 也可以是一个格式化函数
     *
     * 默认相当于 `${text}`
     */
    textFormat?: string | ((it: AnyOptionItem, raw: Vars) => string);
    /**
     * 如果开启了这个选项，那么显示的文本被认为是一个 HTML
     */
    textAsHtml?: boolean;

    /**
     *  指明如果带上 tip ， tip 栏的宽度，默认为 1fr
     */
    tipWidth?: string;

    tipStyle?: Vars;

    /**
     * 列表文字大小
     */
    size?: AspectSize;

    /**
     * 列表项边线样式
     */
    borderStyle?: CssBorderStyle;

    /**
     * 是否显示列表鼠标 hover 高亮
     */
    canHover?: boolean;

    /**
     * 可以鼠标选择文字，默认是 false
     */
    allowUserSelect?: boolean;

    /**
     * 列表文字是否需要自动翻译为多国语言
     */
    autoI18n?: boolean;
  };

export type ListItem = AnyOptionItem & {
  current: boolean;
  checked: boolean;
  className: Vars;
  index: number;
  displayText: string;
};

export type ListEvent = {
  event: Event;
  item: ListItem;
};

export type ListSelectEmitInfo = SelectEmitInfo<TableRowID>;
export type ListEmitter = {
  (event: 'select', payload: ListSelectEmitInfo): void;
  (event: 'open', payload: ListItem): void;
};
