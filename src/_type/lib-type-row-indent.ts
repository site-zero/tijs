import { IconInput, TableRowID, Vars } from './core-types';

export type RowIndentStatus = 'open' | 'closed';

export type RowIconGetter = (
  id: TableRowID,
  row_st: RowIndentStatus | undefined,
  rawData: Vars,
  dftIcon?: IconInput
) => IconInput | undefined;

/**
 * 通过这个类型， `List` 与 `Table` 就很容易扩展为支持树型数据的显示。
 *
 * 对于一个 `Row` 来说，通常有两个图标:
 *
 * ```
 *         | indicator 指示图标,
 *  +----- | 肯定有且有两种状态
 *  V
 * [+] [C] node title
 *      ^
 *      +------ | statusIcons 状态图标
 *              | 可能有两种状态或者固定一种状态，
 *              | 也可能没有
 * ```
 *
 * 根据下面的属性，可以知道每个行的各个状态图标
 */
export type RowIndentProps = {
  /**
   * 指明缩进级数。0 表示不缩进
   */
  rowIndents?: Map<TableRowID, number>;

  /**
   * 指明各行状态，默认 'closed'
   */
  rowStauts?: Map<TableRowID, RowIndentStatus>;

  /**
   * 行记号图标，只有声明了 rowStatus 才会生效
   *
   * 默认为 `{open:'<i class="zmdi zmdi-minus"></i>', closed:'<i class="zmdi zmdi-plus"></i>S'}
   */
  rowIndicators?: Record<RowIndentStatus, string>;

  /**
   * 行状态图标
   */
  getRowIcon?: IconInput | RowIconGetter;
};

export type ToggleRowStatusPayload = {
  id: TableRowID;
  currentStatus?: RowIndentStatus;
};

export type ToggleRowStatusEmitter = {
  (event: 'toggle:status', payload: ToggleRowStatusPayload): void;
};
