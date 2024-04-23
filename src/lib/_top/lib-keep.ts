import { KeepFeature, KeepInfo, Vars } from '../../../';
import { GridResizingState } from './lib-resizing';

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
