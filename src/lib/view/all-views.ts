import { TiComSet } from '../../_type';
import { TiFallsInfo } from './falls/ti-falls-index';
import { TiHtmlPageInfo } from './html-page/html-page-index';
import { TiLbsMapInfo } from './lbs-map/ti-lbs-map-index';
import { TiListInfo } from './list/ti-list-index';
import { TiProcessInfo } from './process/ti-process-index';
import { TiTableInfo } from './table/ti-table-index';
import { TiTreeTableInfo } from './tree-table/ti-tree-table-index';
import { TiTreeInfo } from './tree/ti-tree-index';
import { TiWallInfo } from './wall/ti-wall-index';

export default {
  TiTable: TiTableInfo,
  TiList: TiListInfo,
  TiLbsMap: TiLbsMapInfo,
  TiTree: TiTreeInfo,
  TiTreeTable: TiTreeTableInfo,
  TiFalls: TiFallsInfo,
  TiWall: TiWallInfo,
  TiProcess: TiProcessInfo,
  TiHtmlPage: TiHtmlPageInfo,
} as TiComSet;

export * from './falls/ti-falls-index';
export * from './html-page/html-page-index';
export * from './lbs-map/ti-lbs-map-index';
export * from './list/ti-list-index';
export * from './process/ti-process-index';
export * from './table/ti-table-index';
export * from './tree-table/ti-tree-table-index';
export * from './tree/ti-tree-index';
export * from './wall/ti-wall-index';

