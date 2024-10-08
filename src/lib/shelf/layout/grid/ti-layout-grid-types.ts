import { GridLayoutProps, Vars } from '../../../../_type';
import { KeepFeature, KeepInfo } from '../../../../lib/_features';
import {
  BlockOverflowMode,
  LayoutBar,
  LayoutItem,
  LayoutPanelProps,
  LayoutProps,
  LayoutState,
} from '../layout-types';
import { TabChangeEvent } from '../tabs/ti-layout-tabs-types';

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

export type GridItemTabChangeEvent = TabChangeEvent & {
  items: LayoutGridItem[];
  path: string[];
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
  LayoutPanelProps &
  GridLayoutProps & {
    gridStyle?: Vars;
    /**
     *  如果根据 layoutHint 自动改动了轨道数量，是否要自动清除本地的轨道状态
     */
    resetLocalGridTracks?: boolean;

    /**
     * 下面各个块默认的溢出内容的处理模式
     */
    blockOverflowMode?: BlockOverflowMode;
  };
