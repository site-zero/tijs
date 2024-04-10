import _ from 'lodash';
import { CssUtils } from '../../../../core';
import { LayoutGridProps } from './grid.types';
import { GridResizingState } from './use-grid-resizing';

export function getTopStyle(state: GridResizingState, props: LayoutGridProps) {
  let css = CssUtils.mergeStyles(props.layout || {});
  console.log('getTopStyle', css);
  if (!_.isEmpty(state.rows)) {
    css.gridTemplateRows = state.rows.join(' ');
  }
  if (!_.isEmpty(state.columns)) {
    css.gridTemplateColumns = state.columns.join(' ');
  }
  return css;
}
