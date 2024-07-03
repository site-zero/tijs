import _ from 'lodash';
import { CssUtils } from '../../../../core';
import { GridResizingState, LayoutGridProps } from './ti-layout-grid-types';
import { GridLayoutStyleFeature } from '../../../../lib';

export function getTopStyle(
  state: GridResizingState,
  props: LayoutGridProps,
  GridLayout: GridLayoutStyleFeature
) {
  let css = CssUtils.mergeStyles([props.gridStyle || {}, GridLayout.layoutCss]);

  if (!_.isEmpty(state.rows)) {
    css.gridTemplateRows = state.rows.join(' ');
  }
  if (!_.isEmpty(state.columns)) {
    css.gridTemplateColumns = state.columns.join(' ');
  }
  return css;
}
