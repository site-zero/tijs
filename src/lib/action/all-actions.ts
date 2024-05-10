import { TiComSet } from '../../core';
import { TiActionBarInfo } from './actionbar/ti-action-bar-index';
import { TiButtonInfo } from './button/ti-button-index';
import { TiPagerInfo } from './pager/ti-pager-index';
import { TiSidebarInfo } from './sidebar/ti-sidebar-index';
import { TiTabsInfo } from './tabs/ti-tabs-index';

export default {
  TiButton: TiButtonInfo,
  TiActionBar: TiActionBarInfo,
  TiTabs: TiTabsInfo,
  TiSidebar: TiSidebarInfo,
  TiPager: TiPagerInfo,
} as TiComSet;

export * from './actionbar/ti-action-bar-index';
export * from './button/ti-button-index';
export * from './pager/ti-pager-index';
export * from './sidebar/ti-sidebar-index';
export * from './tabs/ti-tabs-index';
