import _ from 'lodash';
import { GridResizingState, LayoutGridProps } from '../../..';
import { CssUtils } from '../../../../core';

export function getTopStyle(state: GridResizingState, props: LayoutGridProps) {
  let css = CssUtils.mergeStyles([props.gridStyle || {}, props.layout || {}]);
  if (!_.isEmpty(state.rows)) {
    css.gridTemplateRows = state.rows.join(' ');
  }
  if (!_.isEmpty(state.columns)) {
    css.gridTemplateColumns = state.columns.join(' ');
  }
  return css;
}
