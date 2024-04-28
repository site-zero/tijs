import { TiComSet } from '../';
import { TiActionBarInfo } from './actionbar/ti-action-bar-index';
import { TiButtonInfo } from './button/ti-button-index';
import { TiTabsInfo } from './tabs/ti-tabs-index';

export default {
  TiButton: TiButtonInfo,
  TiActionBar: TiActionBarInfo,
  TiTabs: TiTabsInfo,
} as TiComSet;

export { TiActionBar } from './actionbar/ti-action-bar-index';
export { TiButton } from './button/ti-button-index';
export { TiTabs } from './tabs/ti-tabs-index';
