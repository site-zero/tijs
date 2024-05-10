import { KeepInfo } from '../../../_features/use-keep';
import {
  LayoutItem,
  LayoutPanelProps,
  LayoutProps,
  TabsAspect,
} from '../layout-types';

//
// Tab Layout
//
export type LayoutTabsProps = LayoutProps &
  LayoutPanelProps &
  TabsAspect & {
    defaultTab?: string | number;
    keepTab?: KeepInfo;
  };

export type LayoutTabItem = LayoutItem & {
  current?: boolean;
};
