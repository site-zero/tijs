import _ from 'lodash';
import { KeepFeature, KeepInfo, useKeep } from '../../../';
import { Vars } from '../../../../core';
import { GridResizingState } from './use-grid-resizing';
import { LayoutGridProps, LayoutGridState } from './use-layout-grid';

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

export function useKeepLayoutGrid(
  props: LayoutGridProps
): LayoutGridKeepFeature {
  return {
    KeepShown: useKeep(
      _.assign(
        {
          keepMode: 'session',
        },
        props.keepShown
      )
    ),
    KeepSizes: useKeep(
      _.assign(
        {
          keepMode: 'local',
        },
        props.keepSizes
      )
    ),
  };
}

export function loadAllState(
  props: LayoutGridKeepProps,
  state: LayoutGridState,
  Keep: LayoutGridKeepFeature
) {
  let shown = Keep.KeepShown.loadObj();
  if (shown) {
    state.shown = shown;
  } else {
    state.shown = props.shown || {};
  }

  let sizes = Keep.KeepSizes.loadObj();
  if (sizes && sizes.columns) {
    state.columns = sizes.columns;
  } else {
    state.columns = props.sizes?.columns || [];
  }
  if (sizes && sizes.rows) {
    state.rows = sizes.rows;
  } else {
    state.rows = props.sizes?.rows || [];
  }
}

export function keepAllState(
  state: LayoutGridState,
  Keep: LayoutGridKeepFeature
) {
  //  保存块显示
  if (!_.isEmpty(state.shown)) {
    Keep.KeepShown.save(state.shown);
  }
  // 保存行列布局尺寸
  keepSizesState(state, Keep);
}

export function keepSizesState(
  state: GridResizingState,
  Keep: LayoutGridKeepFeature
) {
  let sizes = {} as Vars;
  if (!_.isEmpty(state.columns)) {
    sizes.columns = state.columns;
  }
  if (!_.isEmpty(state.rows)) {
    sizes.rows = state.rows;
  }
  if (!_.isEmpty(sizes)) {
    Keep.KeepSizes.save(sizes);
  }
}
