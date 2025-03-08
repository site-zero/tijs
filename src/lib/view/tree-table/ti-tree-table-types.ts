import {
  TableEmitter,
  TableProps
} from '../../';
import { TreeEmitter, TreeProps } from '../tree/ti-tree-types';

export type TreeTableProps = TreeProps & TableProps



export type TreeTableEmitter = TreeEmitter & TableEmitter;