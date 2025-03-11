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
import { RoadblockProps } from '../../tile/roadblock/ti-roadblock-types';
import {
  TreeTableEmitter,
  TreeTableProps
} from './ti-tree-table-types';

const log = getLogger('TiList.use-list');

export function useList(_props: TreeTableProps, _emit: TreeTableEmitter) {

  //-----------------------------------------------------
  // 输出特性
  //-----------------------------------------------------
  return {

  };
}
