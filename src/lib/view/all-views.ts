import { TiComSet } from "../../_type";
import { TiFilterBarInfo } from "../edit/filter-bar/ti-filter-bar-index";
import { TiSearchBarInfo } from "../edit/search-bar/ti-search-bar-index";
import { TiComboFilterInfo } from "./combo-filter/ti-combo-filter-index";
import { TiFallsInfo } from "./falls/ti-falls-index";
import { TiFilterInfo } from "./filter/_old/ti-filter-index";
import { TiHtmlPageInfo } from "./html-page/html-page-index";
import { TiLbsMapInfo } from "./lbs-map/ti-lbs-map-index";
import { TiListInfo } from "./list/ti-list-index";
import { TiLoadingInfo } from "./loading/ti-loading-index";
import { TiProcessInfo } from "./process/ti-process-index";
import { TiRoadblockInfo } from "./roadblock/ti-roadblock-index";
import { TiSorterInfo } from "./sorter/ti-sorter-index";
import { TiTableInfo } from "./table/ti-table-index";
import { TiTreeTableInfo } from "./tree-table/ti-tree-table-index";
import { TiTreeInfo } from "./tree/ti-tree-index";
import { TiWallInfo } from "./wall/ti-wall-index";

export default {
  TiComboFilter: TiComboFilterInfo,
  TiFalls: TiFallsInfo,
  TiFilter: TiFilterInfo,
  TiFilterBar: TiFilterBarInfo,
  TiHtmlPage: TiHtmlPageInfo,
  TiLbsMap: TiLbsMapInfo,
  TiList: TiListInfo,
  TiLoading: TiLoadingInfo,
  TiProcess: TiProcessInfo,
  TiRoadblock: TiRoadblockInfo,
  TiSearchBar: TiSearchBarInfo,
  TiSorter: TiSorterInfo,
  TiTable: TiTableInfo,
  TiTree: TiTreeInfo,
  TiTreeTable: TiTreeTableInfo,
  TiWall: TiWallInfo,
} as TiComSet;

export * from "../edit/filter-bar/ti-filter-bar-index";
export * from "../edit/search-bar/ti-search-bar-index";
export * from "./combo-filter/ti-combo-filter-index";
export * from "./falls/ti-falls-index";
export * from "./filter/_old/ti-filter-index";
export * from "./html-page/html-page-index";
export * from "./lbs-map/ti-lbs-map-index";
export * from "./list/ti-list-index";
export * from "./loading/ti-loading-index";
export * from "./process/ti-process-index";
export * from "./roadblock/ti-roadblock-index";
export * from "./sorter/ti-sorter-index";
export * from "./table/ti-table-index";
export * from "./tree-table/ti-tree-table-index";
export * from "./tree/ti-tree-index";
export * from "./wall/ti-wall-index";
