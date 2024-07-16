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

export type LayoutTabItem = LayoutItem & {
  current?: boolean;
};

export type TabChangeEvent = {
  to: TabDisplayItem;
  from?: TabDisplayItem;
};
