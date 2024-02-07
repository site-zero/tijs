import { TiComSet } from '../';
import { TiBlockInfo } from './block/ti-block-index';
import { TiCellInfo } from './cell/ti-cell-index';
import { TiFieldInfo } from './field/ti-field-index';
import { TiFormInfo } from './form/ti-form-index';
import { TiLayoutGridInfo } from './layout/grid/ti-layout-grid-index';
import { TiLayoutTabsInfo } from './layout/tabs/ti-layout-tabs-index';
import TiPlayground from './playground/Playground.vue';

export default {
  TiCell: TiCellInfo,
  TiField: TiFieldInfo,
  TiForm: TiFormInfo,
  TiBlock: TiBlockInfo,
  TiLayoutGrid: TiLayoutGridInfo,
  TiLayoutTabs: TiLayoutTabsInfo,
} as TiComSet;

export { TiBlock } from './block/ti-block-index';
export { TiCell } from './cell/ti-cell-index';
export { TiField } from './field/ti-field-index';
export { TiForm } from './form/ti-form-index';
export { TiLayoutGrid } from './layout/grid/ti-layout-grid-index';
export { TiLayoutTabs } from './layout/tabs/ti-layout-tabs-index';
export { TiPlayground };
