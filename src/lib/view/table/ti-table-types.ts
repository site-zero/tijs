import {
  FieldChangeProps,
  GetDataLogicTypeOptions,
  KeepInfo,
  RoadblockProps,
  SelectEmitInfo,
  SelectableApi,
  SelectableProps,
  SelectableState,
} from "../..";
import {
  AbstractField,
  Callback2,
  ColumnRefer,
  CommonProps,
  FieldChange,
  FieldComProps,
  FieldName,
  LogicType,
  TableColumnAspect,
  TableRowID,
  TiMatch,
  Vars,
} from "../../../_type";

export const KK_DISPLAY_COL_KEYS = "$table$display_column_keys";
export const HEAD_MARKER = "$table$HEAD_MARKER";

export type TableSelectable = SelectableApi<TableRowID>;

export type TableRowData = {
  index: number;
  id: TableRowID;
  // activated: boolean;
  // checked: boolean;
  type?: LogicType;
  indent: number;
  rawData: Vars;
};

export type TableSelection = SelectableState<TableRowID> & {
  uniqKey: string | null;
};

/**
 * - `click` : 点击行头
 * - `check` : 点击行头选择框
 * - `open`  : 点击行动态打开图标
 * - `cell`  : 点击行单元格
 */
export type TableEventName =
  | "select"
  | "open"
  | "cell-select"
  | "cell-open"
  | "row-change";
export type TableRowEventName =
  | "row-check"
  | "row-select"
  | "row-open"
  | "cell-select"
  | "cell-open"
  | "cell-change";
export type TableCellEventName = "cell-change";
export type TableCellChanged = FieldChange &
  Omit<TableCellEventPayload, "event">;

export type TableEventPayload = {
  colUniqKey: string | null;
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
  (eventName: "select", payload: TableSelectEmitInfo): void;
  (eventName: "open", payload: TableRowData): void;
  (eventName: "cell-open", payload: TableEventPayload): void;
  (eventName: "row-change", payload: TableRowChanagePayload): void;
  (event: "cell-change", payload: TableCellChanged): void;
};

export type TableRowEmitter = {
  (event: TableRowEventName, payload: TableEventPayload): void;
  (event: "cell-change", payload: TableCellChanged): void;
};

export type TableCellEmitter = {
  (event: TableCellEventName, payload: TableCellEventPayload): void;
  (event: "cell-change", payload: TableCellChanged): void;
};

export type TableKeepProps = {
  keepColumns?: KeepInfo;
};

export type TableStrictColumn = CommonProps &
  FieldComProps &
  AbstractField &
  TableColumnAspect & {
    index: number;

    /**
     * 指定本列的单元格是否只读，支持 Match
     */
    readonly?: TiMatch;

    /**
     * 指定本列的单元格是否Disable，支持 Match
     */
    disabled?: TiMatch;
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
   * 获取一个行的逻辑类型
   */
  getRowType?: GetDataLogicTypeOptions;

  /**
   * 一个缩进块的缩进尺寸，数字表示 px，也可以是 css 的尺寸
   * 会变成 calc($indentSize * $indent)
   */
  indentSize?: string | number;

  showChecker?: boolean;
  showRowIndex?: boolean;

  canHover?: boolean;

  /**
   * 如果设置为 false， 则会将 activedCom 全都取消
   */
  editable?: boolean;

  /**
   * 表格列默认宽度，0 表示 `1fr` 均分
   */
  colDefaultWidth?: number;
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

    /**
     * 判断一个单元格是否是只读的方法
     */
    cellReadonly?: any;
    cellDisabled?: any;
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

    /**
     * @returns 是否可以改变当前的选中状态
     */
    canChangeSelection?: (
      selection: TableSelectEmitInfo,
      old: TableSelectEmitInfo
    ) => boolean;

    /**
     * 指定一个保险丝，当切换行时会尝试引爆它
     * 如果引爆成功，那么就阻止后续选择行为
     *
     * 如果为 true，则采用默认保险丝
     */
    fuse?: string | boolean;
    /*......................................

                  Aspect
    
    ......................................*/
    mainStyle?: Vars;

    /**
     * 右侧指定一个空白，以便最后一列有可被拖动的空间
     * 默认，如果指定了 columnResizable 时为100px
     */
    rightPadding?: number | string;
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
  Omit<TableBehaviorsProps, "columns"> & {
    /**
     * 显示行首
     */
    showRowMarker: boolean;
    /**
     * 严格模式的列定义
     */
    columns: TableStrictColumn[];

    columnMap: Map<string, TableStrictColumn>;
    /**
     * 传入的行数据对象
     */
    row: TableRowData;

    activated?: boolean;
    checked?: boolean;
    indent?: number;

    activedColUniqKey?: string;

    /**
     * 表格给的回调，用来更新每行的行高
     */
    updateRowHeight: Callback2<number, number>;
  };

export type TableCellProps = Omit<
  TableStrictColumn,
  | "title"
  | "titleType"
  | "titleIcon"
  | "titleStyle"
  | "titleAlign"
  | "tip"
  | "tipType"
  | "tipBy"
  | "tipStyle"
  | "tipAlign"
  | "tipIcon"
  | "candidate"
> & {
  activated?: boolean;
  editable?: boolean;

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
