import {
  LayoutItem,
  LayoutPanelProps,
  LayoutProps,
  TabDisplayItem,
  TabsAspect,
} from '../layout-types';

//
// Tab Layout
//
export type LayoutTabsProps = LayoutProps & LayoutPanelProps & TabsAspect;

export type LayoutTabItem = LayoutItem;

export type TabChangeEvent = {
  to: TabDisplayItem;
  from?: TabDisplayItem;
};
