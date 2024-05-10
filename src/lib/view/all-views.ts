import { TiComSet } from '../../core';
import { TiListInfo } from './list/ti-list-index';
import { TiTableInfo } from './table/ti-table-index';

export default {
  TiTable: TiTableInfo,
  TiList: TiListInfo,
} as TiComSet;

export * from './list/ti-list-index';
export * from './table/ti-table-index';
