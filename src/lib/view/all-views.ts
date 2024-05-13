import { TiComSet } from '../../core';
import { TiFallsInfo } from './falls/ti-falls-index';
import { TiListInfo } from './list/ti-list-index';
import { TiTableInfo } from './table/ti-table-index';
import { TiWallInfo } from './wall/ti-wall-index';

export default {
  TiTable: TiTableInfo,
  TiList: TiListInfo,
  TiFalls: TiFallsInfo,
  TiWall: TiWallInfo,
} as TiComSet;

export * from './falls/ti-falls-index';
export * from './list/ti-list-index';
export * from './table/ti-table-index';
export * from './wall/ti-wall-index';
