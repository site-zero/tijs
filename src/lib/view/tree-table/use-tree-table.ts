import _ from 'lodash';
import { AnyOptionItem, TableRowID, Vars } from '../../../_type';
import { EventUtils, I18n, Tmpl, Util } from '../../../core';
import { getLogger } from '../../../core/log/ti-log';
import {
  SelectableState,
  useDataLogicType,
  useSelectable,
  useStdListItem,
} from '../../_features';
import { RoadblockProps } from '../../view/roadblock/ti-roadblock-types';
import {
  TreeTableProps
} from './ti-tree-table-types';
import { TreeEmitter } from '../tree/ti-tree-types';

const log = getLogger('TiList.use-list');

export function useList(_props: TreeTableProps, _emit: TreeEmitter) {

  //-----------------------------------------------------
  // 输出特性
  //-----------------------------------------------------
  return {

  };
}
