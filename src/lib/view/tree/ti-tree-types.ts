import {
  ListItem,
  ListProps
} from '../../';
import {
  Vars
} from '../../../_type';
import {
  SelectEmitInfo
} from '../../../lib/_features/use-selectable';

export type TreeEmitter = {
  (event: 'select', payload: TreeSelectEmitInfo): void;
  (event: 'open', payload: TreeNode): void;
};


export type TreeProps = ListProps & {

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
