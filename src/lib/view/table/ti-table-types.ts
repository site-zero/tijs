import {
  FieldChangeProps,
  KeepInfo,
  RoadblockProps,
  SelectEmitInfo,
  SelectableFeature,
  SelectableProps,
  SelectableState,
} from '../..';
import {
  AbstractField,
  Callback2,
  ColumnRefer,
  CommonProps,
  FieldChange,
  FieldComProps,
  FieldName,
  TableColumnAspect,
  TableInputColumn,
  TableRowID,
  Vars,
} from '../../../_type';

export type TableSelectable = SelectableFeature<TableRowID>;

export type TableRowData = {
  index: number;
  id: TableRowID;
  // activated: boolean;
  // checked: boolean;
  indent: number;
  rawData: Vars;
};

export type TableSelection = SelectableState<TableRowID> & {
  columnIndex: number;
};

/**
 * - `click` : 点击行头
 * - `check` : 点击行头选择框
 * - `open`  : 点击行动态打开图标
 * - `cell`  : 点击行单元格
 */
export type TableEventName =
  | 'select'
  | 'open'
  | 'cell-select'
  | 'cell-open'
  | 'row-change';
export type TableRowEventName =
  | 'row-check'
  | 'row-select'
  | 'row-open'
  | 'cell-select'
  | 'cell-open'
  | 'cell-change';
export type TableCellEventName = 'cell-change';
export type TableCellChanged = FieldChange &
  Omit<TableCellEventPayload, 'event'>;

export type TableEventPayload = {
  colIndex: number;
  rowIndex: number;
  event: Event;
  row: TableRowData;
};

export type TableCellEventPayload = {
  colIndex: number;
  rowIndex: number;
  event: Event;
};

export type TableRowChanagePayload = {
  colIndex: number;
  rowIndex: number;
  uniqKey: string;
  name: FieldName;
  changed: Vars | FieldChange[];
  oldRowData?: Vars;
};

export type TableEmitter = {
  (eventName: 'select', payload: TableSelectEmitInfo): void;
  (eventName: 'open', payload: TableRowData): void;
  (eventName: 'cell-open', payload: TableEventPayload): void;
  (eventName: 'row-change', payload: TableRowChanagePayload): void;
  (event: 'cell-change', payload: TableCellChanged): void;
};

export type TableRowEmitter = {
  (event: TableRowEventName, payload: TableEventPayload): void;
  (event: 'cell-change', payload: TableCellChanged): void;
};

export type TableCellEmitter = {
  (event: TableCellEventName, payload: TableCellEventPayload): void;
  (event: 'cell-change', payload: TableCellChanged): void;
};

export type TableKeepProps = {
  keepColumns?: KeepInfo;
};

export type TableStrictColumn = CommonProps &
  FieldComProps &
  AbstractField &
  TableColumnAspect & {
    index: number;
    dragIndex: number;
  };

export type TableSelectEmitInfo = SelectEmitInfo<TableRowID> & {
  colIndex?: number;
  column?: TableStrictColumn;
};

export type TableBehaviorsProps = {
  columns: ColumnRefer[];
  /**
   * 传入的上下文变量字段
   */
  vars?: Vars;

  /**
   * 一个缩进块的缩进尺寸，数字表示 px，也可以是 css 的尺寸
   * 会变成 calc($indentSize * $indent)
   */
  indentSize?: string | number;

  showCheckbox?: boolean;
  showRowIndex?: boolean;

  canHover?: boolean;
};

export type TableProps = CommonProps &
  TableBehaviorsProps &
  TableKeepProps &
  FieldChangeProps<TableStrictColumn> &
  Partial<SelectableProps<TableRowID>> & {
    /**
     * 传入的数据对象
     */
    data: Vars[];
    /**
     * 传入的上下文变量字段
     */
    vars?: Vars;

    /*......................................

               Cell Compoinents
    
    ......................................*/
    defaultCellComType?: string;
    defaultCellComConf?: Vars;
    defaultCellActivatedComType?: string;
    defaultCellActivatedComConf?: Vars;
    /*......................................

                  Behaviors
    
    ......................................*/
    /**
     * 表格的列是否可以被调整大小
     *
     * @default false
     */
    columnResizable?: boolean;

    /**
     * 列调整大小时是否即时更新表格列布局
     *
     * - true : 即时更新（数据超过500行时有点卡）
     * - false : 只有拖拽完成后才更新（数据量大时可以维持基本的平滑）
     * - number : 只有小于给定的数量时才相当于 true，否则相当于 false
     *
     * @default `50`
     */
    columnResizeInTime?: boolean | number;

    /**
     * 是否显示表头
     *
     * **注意!** 如果隐藏表头，那么即使 `columnResizable==true`
     * 你也没有办法调整列尺寸了
     *
     * @default true
     */
    showHeader?: boolean;
    /*......................................

                  Aspect
    
    ......................................*/
    mainStyle?: Vars;
    /**
     * 行间距，即水平表格线的尺寸
     *
     * @default 1
     */
    rowGap?: number;
    /**
     * 列间距，即垂直表格线的尺寸
     *
     * @default 1
     */
    colGap?: number;
    /**
     * 如果不指定表格行最小高度，则无法计算滚动渲染区。
     * 单位为`px`
     */
    rowMinHeight?: number;

    /**
     * 空白数据，显示的样式
     */
    emptyRoadblock?: RoadblockProps;
  };

export type TableRowProps = CommonProps &
  Omit<TableBehaviorsProps, 'columns'> & {
    /**
     * 显示行首
     */
    showRowMarker: boolean;
    /**
     * 严格模式的列定义
     */
    columns: TableStrictColumn[];
    /**
     * 传入的行数据对象
     */
    row: TableRowData;

    activated?: boolean;
    checked?: boolean;
    indent?: number;

    activedColIndex?: number;

    /**
     * 表格给的回调，用来更新每行的行高
     */
    updateRowHeight: Callback2<number, number>;
  };

export type TableCellProps = Omit<
  TableStrictColumn,
  | 'title'
  | 'titleType'
  | 'titleIcon'
  | 'titleStyle'
  | 'titleAlign'
  | 'tip'
  | 'tipType'
  | 'tipBy'
  | 'tipStyle'
  | 'tipAlign'
  | 'tipIcon'
  | 'candidate'
> & {
  disabled?: boolean;
  activated?: boolean;

  /**
   * 行下标： 0 BASE
   */
  rowIndex?: number;
  /**
   * 列下标： 0 BASE
   */
  colIndex?: number;

  /**
   * 传入的数据对象
   */
  data: Vars;
  /**
   * 传入的上下文变量字段
   */
  vars?: Vars;

  /**
   * 在字段改动后，是否需要比对一下，不同才通知改动
   *
   * @default true
   */
  checkEquals?: boolean;
};
