import { CssGridLayout, Vars } from '../../../../core';
import { KeepFeature, KeepInfo } from '../../../../lib/_features';
import {
  LayoutBar,
  LayoutItem,
  LayoutPanelProps,
  LayoutProps,
  LayoutState,
} from '../layout-types';

export type GridResizingState = {
  /**
   * 格子的列，如果为空，就表示未定制，将采用默认设置
   */
  columns: string[];
  /**
   * 格子的行，如果为空，就表示未定制，将采用默认设置
   */
  rows: string[];
};

//
// Grid Layout
//
export type LayoutGridKeepProps = {
  keepShown?: KeepInfo;
  keepSizes?: KeepInfo;
  shown?: Vars;
  sizes?: GridResizingState;
};

export type LayoutGridKeepFeature = {
  KeepShown: KeepFeature;
  KeepSizes: KeepFeature;
};

export type LayoutGridItem = LayoutItem & {
  adjustBars: LayoutBar[];
};
export type LayoutGridState = LayoutState & GridResizingState;
export type LayoutGridProps = LayoutProps &
  LayoutGridKeepProps &
  LayoutPanelProps & {
    layout?: CssGridLayout;
    gridStyle?: Vars;
  };
