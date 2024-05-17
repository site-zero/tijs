import _ from 'lodash';
import { CssGridLayout } from 'src/core';
import {
  GridFieldLayoutMode,
  GridFieldsStrictAbstractItem,
} from './ti-grid-fields-types';

export function useFieldStyle(
  layoutMode: GridFieldLayoutMode,
  nameWidth: number,
  hasTitle: boolean,
  hasTip: boolean
) {
  let NW = `${nameWidth}px`;
  let css = {
    gridTemplateColumns: `${NW} 1fr`,
  } as CssGridLayout;

  let ss = layoutMode.split('-');
  let lk = [ss[0]];
  if (!/^(name|value)$/.test(ss[1])) {
    lk.push(ss[1]);
  }
  if (hasTitle) {
    lk.push('title');
  }
  if (hasTip) {
    lk.push('tip');
  }
  let lyKey = lk.join('-');

  _.assign(
    css,
    {
      // 左右布局，提示在底部，与值等宽
      'h-wrap-title-tip': {
        gridTemplateRows: 'auto 1fr',
        gridTemplateAreas: `"title value" "title tip"`,
      },
      'h-wrap-title': {
        gridTemplateRows: 'auto',
        gridTemplateAreas: `"title value"`,
      },
      'h-wrap-tip': {
        gridTemplateRows: 'auto 1fr',
        gridTemplateAreas: `"title value" "title tip"`,
      },
      'h-wrap': {},
      // 左右布局，提示在底部单独一整行
      'h-bottom-title-tip': {
        gridTemplateRows: 'auto 1fr',
        gridTemplateAreas: `"title value" "tip tip"`,
      },
      'h-bottom-title': {
        gridTemplateRows: 'auto 1fr',
        gridTemplateAreas: `"title value"`,
      },
      'h-bottom-tip': {
        gridTemplateRows: 'auto 1fr',
        gridTemplateAreas: `"value value" "tip tip"`,
      },
      'h-bottom': {
        gridTemplateRows: 'auto',
        gridTemplateAreas: `"value value"`,
      },
      // 上下布局，提示在底部
      'v-wrap-title-tip': {
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto auto 1fr',
        gridTemplateAreas: `"title" "value" "tip"`,
      },
      'v-wrap-title': {
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto auto',
        gridTemplateAreas: `"title" "value" `,
      },
      'v-wrap-tip': {
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto 1fr',
        gridTemplateAreas: `"value" "tip"`,
      },
      'v-wrap': {
        gridTemplateRows: 'auto',
        gridTemplateAreas: `"value value"`,
      },
      // 左右布局，提示作为图标
      'h-title-tip': {
        gridTemplateRows: 'auto',
        gridTemplateAreas: `"title value"`,
      },
      'h-title': {
        gridTemplateRows: 'auto',
        gridTemplateAreas: `"title value"`,
      },
      'h-tip': {
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto',
        gridTemplateAreas: `"value"`,
      },
      'h': {
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto',
        gridTemplateAreas: `"value"`,
      },
      // 上下布局，提示作为图标
      'v-title-tip': {},
      'v-title': {},
      'v-tip': {},
      'v': {},
    }[lyKey]
  );

  return css;
}

export function useGridItemStyle(item: GridFieldsStrictAbstractItem) {
  let css = _.cloneDeep(item.style || {});
  if (item.rowSpan) {
    css.gridRowEnd = `span ${item.rowSpan}`;
  }
  if (item.colSpan) {
    css.gridColumnEnd = `span ${item.colSpan}`;
  }
  return css;
}
