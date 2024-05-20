import {
  AbstractField,
  FieldComProps,
  FieldName,
  KeepInfo,
  SelectEmitInfo,
  SelectableProps,
  SelectableState,
  TableCell,
} from '../..';
import {
  Callback2,
  CommonProps,
  CssTextAlign,
  IconInput,
  InvokePartial,
  TextContentType,
  Vars,
} from '../../../core';

export type TableRowID = number | string;
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
export type TableEventName = 'select' | 'check' | 'open' | 'cell' | 'cell-open';

export type TableEvent = {
  colIndex?: number;
  event: Event;
  row: TableRowData;
};

export type TableKeepProps = {
  keepColumns?: KeepInfo;
};

export type TableSelectEmitInfo = SelectEmitInfo<TableRowID> & {
  colIndex?: number;
  column?: TableCell;
};

export type TableBehaviorsProps = {
  columns: TableColumn[];
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
  canCheck?: boolean;
  canSelect?: boolean;
};

export type TableProps = CommonProps &
  TableBehaviorsProps &
  TableKeepProps &
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
  };

type TableColumnAspect = {
  //------------------------------------
  // 显示
  //------------------------------------
  title: string;
  titleType?: TextContentType; // 默认 text
  titleIcon?: IconInput;
  titleStyle?: Vars;
  titleAlign?: CssTextAlign;
  tip?: string;
  tipType?: TextContentType; // 默认 text
  tipBy?: FieldComProps;
  tipStyle?: Vars;
  tipAlign?: CssTextAlign;
  tipIcon?: IconInput;

  // 本字段，是否为候选字段
  candidate: boolean;
};

export type TableColumn = CommonProps &
  FieldComProps &
  Partial<Omit<AbstractField, 'transformer' | 'serializer'>> &
  Partial<TableColumnAspect> & {
    name: FieldName;
    // 读取字段值后，经过一个定制转换，再传递给字段
    // data[name] ===(transformer) ==> FieldCom
    transformer?: string | Function;
    transArgs?: any[];
    transPartial?: InvokePartial;
    // 字段值修改后，经过一个定制转换，再向外抛出消息
    // FieldCom.change ===(serializer) ==> emit('change')
    serializer?: string | Function;
    serialArgs?: any[];
    serialPartial?: InvokePartial;
  };

export type TableStrictColumn = CommonProps &
  FieldComProps &
  AbstractField &
  TableColumnAspect;

export type TableRowProps = CommonProps &
  TableBehaviorsProps & {
    showRowMarker: boolean;
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
