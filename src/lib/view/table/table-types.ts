import { Vars } from '../../../core';
import { CellProps } from '../../shelf/cell/use-cell.ts';
import { TableRowData } from './use-table';

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

/**
 * 单元格定义
 */
export type TableCell = Omit<
  CellProps,
  'activated' | 'rowIndex' | 'colIndex' | 'data' | 'vars'
>;

/**
 * 表格行为部分的属性定义
 */
export type TableBehaviorsProps = {
  columns: TableCell[];
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
