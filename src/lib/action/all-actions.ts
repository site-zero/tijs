import { TiComSet } from '../../core';
import { TiActionBarInfo } from './actionbar/ti-action-bar-index';
import { TiButtonInfo } from './button/ti-button-index';
import { TiSidebarInfo } from './sidebar/ti-sidebar-index';
import { TiTabsInfo } from './tabs/ti-tabs-index';

export default {
  TiButton: TiButtonInfo,
  TiActionBar: TiActionBarInfo,
  TiTabs: TiTabsInfo,
  TiSidebar: TiSidebarInfo,
} as TiComSet;

export { TiActionBar } from './actionbar/ti-action-bar-index';
export { TiButton } from './button/ti-button-index';
export { TiSidebar } from './sidebar/ti-sidebar-index';
export { TiTabs } from './tabs/ti-tabs-index';
