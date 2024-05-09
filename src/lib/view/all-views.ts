import { TiComSet } from '../../core';
import { TiTableInfo } from './table/ti-table-index';
import { TiListInfo } from './list/ti-list-index';

export default {
  TiTable: TiTableInfo,
  TiList: TiListInfo,
} as TiComSet;

export { TiList } from './list/ti-list-index';
export { TiTable } from './table/ti-table-index';
