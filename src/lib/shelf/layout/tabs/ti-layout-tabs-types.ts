import {
  LayoutItem,
  LayoutPanelProps,
  LayoutProps,
  TabsAspect,
} from '../layout-types';

//
// Tab Layout
//
export type LayoutTabsProps = LayoutProps & LayoutPanelProps & TabsAspect;

export type LayoutTabItem = LayoutItem & {
  current?: boolean;
};
