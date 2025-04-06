import { ListProps, SelectEmitInfo, TreeDataProps, TreeNode } from '../../';
import { RowIndentProps, TableRowID, Vars } from '../../../_type/';

export type TreeEmitter = {
  (event: 'select', payload: TreeSelectEmitInfo): void;
  (event: 'open', payload: TreeNode): void;
};

export type TreeSelectEmitInfo = SelectEmitInfo<TableRowID> & {
  path: TreeNode[];
  currentNode?: TreeNode;
  checkedNodes: TreeNode[];
};

export type TreeProps = ListProps &
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
