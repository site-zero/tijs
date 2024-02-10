import _ from 'lodash';
import { ComputedRef } from 'vue';
import { TiEventTrigger } from '../../../';
import {
  Callback,
  Callback1,
  CssGridLayout,
  CssUtils,
  Vars,
} from '../../../../core';
import {
  LayoutPanelItem,
  LayoutPanelProps,
  getLayoutPanelItems,
} from '../layout-panel.ts';
import {
  LayoutBar,
  LayoutItem,
  LayoutProps,
  LayoutState,
  getLayoutItem,
} from '../layout-support.ts';
import { LayoutGridKeepFeature, LayoutGridKeepProps } from './use-grid-keep';
import { GridResizingState, useGridResizing } from './use-grid-resizing';

export const COM_TYPE = 'TiLayoutGrid';
/*-------------------------------------------------------

                    Events & Types

-------------------------------------------------------*/
export type LayoutGridEvents = 'shown';
export type LayoutGridItem = LayoutItem & {
  adjustBars: LayoutBar[];
};
/*-------------------------------------------------------

                     State

-------------------------------------------------------*/
export type LayoutGridState = LayoutState & GridResizingState;
/*-------------------------------------------------------

                     Props

-------------------------------------------------------*/
export type LayoutGridProps = LayoutProps &
  LayoutGridKeepProps &
  LayoutPanelProps & {
    layout?: CssGridLayout;
  };
/*-------------------------------------------------------

                     Options

-------------------------------------------------------*/
export type LayoutGridOptions = {
  notify: TiEventTrigger<LayoutGridEvents, any>;
};
/*-------------------------------------------------------

                     Methods

-------------------------------------------------------*/
function getLayoutGridItems(
  state: LayoutState,
  props: LayoutProps
): LayoutGridItem[] {
  let items = getLayoutItem(state, props) as LayoutGridItem[];
  for (let item of items) {
    if (item.bar) {
      if (!_.isArray(item.bar)) {
        item.adjustBars = [item.bar];
      } else {
        item.adjustBars = item.bar;
      }
    } else {
      item.adjustBars = [];
    }
  }
  return items;
}
/*-----------------------------------------------------

                   Use Feature
                
-----------------------------------------------------*/
export type LayoutGridFeature = {
  TopClass: Vars;
  TopStyle: Vars;
  Items: LayoutGridItem[];
  Panels: LayoutPanelItem[];
  bindResizing(
    $main: HTMLElement,
    resizing: GridResizingState,
    onDestroy: Callback1<Callback>,
    Keep: ComputedRef<LayoutGridKeepFeature>
  ): void;
};
export function useLayoutGrid(
  state: LayoutGridState,
  props: LayoutGridProps,
  _options: LayoutGridOptions
): LayoutGridFeature {
  let Items = getLayoutGridItems(state, props);
  let Panels = getLayoutPanelItems(state, props);
  // 如果声明了调整条，则界面应该就是可调整的
  let isAdjustable = false;
  for (let it of Items) {
    if (!_.isEmpty(it.adjustBars)) {
      isAdjustable = true;
      break;
    }
  }

  // 计算顶部的样式
  let TopStyle = CssUtils.mergeStyles(props.layout || {});
  if (!_.isEmpty(state.rows)) {
    TopStyle.gridTemplateRows = state.rows.join(' ');
  }
  if (!_.isEmpty(state.columns)) {
    TopStyle.gridTemplateColumns = state.columns.join(' ');
  }

  // 返回
  return {
    TopClass: CssUtils.mergeClassName(props.className),
    TopStyle,
    Items,
    Panels,
    bindResizing(
      $main: HTMLElement,
      resizing: GridResizingState,
      onDestroy: Callback1<Callback>,
      Keep: ComputedRef<LayoutGridKeepFeature>
    ) {
      if (isAdjustable) {
        useGridResizing($main, resizing, onDestroy, Keep);
      }
    },
  };
}
