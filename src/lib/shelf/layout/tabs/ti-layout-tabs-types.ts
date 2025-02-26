import { Vars } from '../../../../_type';
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
export type TabsLayoutProps = LayoutProps &
  LayoutPanelProps &
  TabsAspect & {
    mainStyle?: Vars;
    mainClass?: any;
  };

export type LayoutTabItem = LayoutItem;

export type TabChangeEvent = {
  to: TabDisplayItem;
  from?: TabDisplayItem;
};
