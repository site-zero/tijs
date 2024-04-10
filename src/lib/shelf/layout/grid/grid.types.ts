import { LayoutBar, LayoutItem, LayoutProps, LayoutState } from '../../../';
import { CssGridLayout } from '../../../../core';
import { LayoutPanelProps } from '../layout-panel';
import { LayoutGridKeepProps } from './use-grid-keep';
import { GridResizingState } from './use-grid-resizing';

export const COM_TYPE = 'TiLayoutGrid';
//
// Grid Layout
//
export type LayoutGridItem = LayoutItem & {
  adjustBars: LayoutBar[];
};
export type LayoutGridState = LayoutState & GridResizingState;
export type LayoutGridProps = LayoutProps &
  LayoutGridKeepProps &
  LayoutPanelProps & {
    layout?: CssGridLayout;
  };
