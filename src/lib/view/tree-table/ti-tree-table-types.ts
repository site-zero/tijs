import {
  TableProps,
  TreeDataProps
} from '../../';
import { RowIndentProps, Vars } from '../../../_type';

export type TreeTableProps = Omit<TableProps, 'data'> &
  Pick<RowIndentProps, 'rowIndicators' | 'getRowIcon'> &
  TreeDataProps & {
    data: Vars | Vars[] | null | undefined;

    /**
     * 当选择了一个节点，会自动打开自己以及下面的 `N` 层子节点
     *
     * - `0`: 默认，不自动打开
     * - `1`: 仅自动打开自己
     * - `2`: 自动打开自己，以及自己所有直接的子节点
     *
     * @default 0
     */
    autoOpen?: number;
  };
