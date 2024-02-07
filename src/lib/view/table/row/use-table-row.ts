import { CommonProps } from '../../../';
import { Callback2 } from '../../../../core';
import { TableBehaviorsProps } from '../table-types';
import { TableRowData } from '../use-table';
/*-------------------------------------------------------

                        Props

-------------------------------------------------------*/
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

/*-------------------------------------------------------

                    Methods

-------------------------------------------------------*/

/*-------------------------------------------------------

                  Use Feature

-------------------------------------------------------*/
export function useTableRow(_props: TableRowProps) {}
