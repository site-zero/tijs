import { TiComSet } from '../../core';
import { TiTableInfo } from './table/ti-table-index';
import { TiListInfo } from './list/ti-list-index';

export default {
  TiTable: TiTableInfo,
  TiList: TiListInfo,
} as TiComSet;

export { TiList } from './list/ti-list-index';
export { TiTable } from './table/ti-table-index';

//
// 导出内部控件类型
//
export * from './table/ti-table-type';
export * from './list/ti-list-types';
