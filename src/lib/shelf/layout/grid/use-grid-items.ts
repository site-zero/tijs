import _ from 'lodash';
import { LayoutState } from '../../../';
import { LayoutItemsInput, getLayoutItem } from '../layout-support';
import { LayoutGridItem } from './ti-layout-grid-types';

export function getLayoutGridItems(
  state: LayoutState,
  props: LayoutItemsInput
): LayoutGridItem[] {
  let items = getLayoutItem(state, props) as LayoutGridItem[];
  for (let item of items) {
    //console.log('item-', item.bar, item);
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

export function isLayoutAdjustable(items: LayoutGridItem[]) {
  for (let it of items) {
    if (!_.isEmpty(it.adjustBars)) {
      return true;
    }
  }
  return false;
}
