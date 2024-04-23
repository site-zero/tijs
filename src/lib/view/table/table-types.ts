import { TableRowData } from '../../';

export const COM_TYPE = 'TiTable';

/**
 * - `click` : 点击行头
 * - `check` : 点击行头选择框
 * - `open`  : 点击行动态打开图标
 * - `cell`  : 点击行单元格
 */
export type TableRowEventName =
  | 'select'
  | 'check'
  | 'open'
  | 'cell'
  | 'cell-open';

export type TableRowEvent = {
  colIndex?: number;
  event: Event;
  row: TableRowData;
};
