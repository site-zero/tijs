import { TiComSet } from '../../core';
import { TiBlockInfo } from './block/ti-block-index';
import { TiCellInfo } from './cell/ti-cell-index';
import { TiFieldInfo } from './field/ti-field-index';
import { TiFormInfo } from './form/ti-form-index';
import { TiFormTabInfo } from './form-tab/ti-form-tab-index';
import { TiGridFieldsInfo } from './grid-fields/ti-grid-fields-index';
import { TiLayoutGridInfo } from './layout/grid/ti-layout-grid-index';
import { TiLayoutTabsInfo } from './layout/tabs/ti-layout-tabs-index';
import { TiMainFrameInfo } from './main-frame/ti-main-frame-index';

export default {
  TiCell: TiCellInfo,
  TiField: TiFieldInfo,
  TiForm: TiFormInfo,
  TiFormTab: TiFormTabInfo,
  TiGridFields: TiGridFieldsInfo,
  TiBlock: TiBlockInfo,
  TiLayoutGrid: TiLayoutGridInfo,
  TiLayoutTabs: TiLayoutTabsInfo,
  TiMainFrame: TiMainFrameInfo,
} as TiComSet;

export * from './block/ti-block-index';
export * from './cell/ti-cell-index';
export * from './field/ti-field-index';
export * from './form/ti-form-index';
export * from './form-tab/ti-form-tab-index';
export * from './grid-fields/ti-grid-fields-index';
export * from './layout/grid/ti-layout-grid-index';
export * from './layout/tabs/ti-layout-tabs-index';
export * from './main-frame/ti-main-frame-index';

export * from './layout/layout-support';
export * from './layout/layout-types';
export { TiPlayground };

import TiPlayground from './playground/TiPlayground.vue';
