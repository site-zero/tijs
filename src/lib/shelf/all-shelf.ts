import { TiComSet } from '../';
import { TiBlockInfo } from './block/ti-block-index';
import { TiCellInfo } from './cell/ti-cell-index';
import { TiFieldInfo } from './field/ti-field-index';
import { TiFormInfo } from './form/ti-form-index';
import { TiLayoutGridInfo } from './layout/grid/ti-layout-grid-index';
import { TiLayoutTabsInfo } from './layout/tabs/ti-layout-tabs-index';
import { TiMainFrameInfo } from './main-frame/ti-main-frame-index';
import TiPlayground from './playground/TiPlayground.vue';

export default {
  TiCell: TiCellInfo,
  TiField: TiFieldInfo,
  TiForm: TiFormInfo,
  TiBlock: TiBlockInfo,
  TiLayoutGrid: TiLayoutGridInfo,
  TiLayoutTabs: TiLayoutTabsInfo,
  TiMainFrame: TiMainFrameInfo,
} as TiComSet;

export { TiBlock } from './block/ti-block-index';
export { TiCell } from './cell/ti-cell-index';
export { TiField } from './field/ti-field-index';
export { TiForm } from './form/ti-form-index';
export { TiLayoutGrid } from './layout/grid/ti-layout-grid-index';
export * from './layout/layout-support';
export { TiLayoutTabs } from './layout/tabs/ti-layout-tabs-index';
export { TiMainFrame } from './main-frame/ti-main-frame-index';
export { TiPlayground };

