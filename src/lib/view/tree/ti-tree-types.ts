import { ListItem, ListProps, SelectEmitInfo, TreeDataProps } from '../../';
import { RowIndentProps, Vars } from '../../../_type/';

export type TreeEmitter = {
  (event: 'select', payload: TreeSelectEmitInfo): void;
  (event: 'open', payload: TreeNode): void;
};

export type TreeNode = ListItem & {
  current: boolean;
  checked: boolean;
  className: Vars;
  index: number;
  displayText: string;
};

export type TreeSelectEmitInfo = SelectEmitInfo<string> & {
  depth: number;
  path: string[];
};

export type TreeProps = ListProps &
  Pick<RowIndentProps, 'rowIndicators' | 'getRowIcon'> &
  TreeDataProps & {
    data: Vars | Vars[] | null | undefined;
  };
