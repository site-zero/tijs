import _ from 'lodash';
import { LayoutState } from '../../../';
import { getLayoutItem } from '../layout-support';
import { LayoutGridItem, LayoutGridProps } from './ti-layout-grid-types';

export function getLayoutGridItems(
  state: LayoutState,
  props: LayoutGridProps
): LayoutGridItem[] {
  let items = getLayoutItem(state, props) as LayoutGridItem[];
  for (let item of items) {
    if ('B0' == item.uniqKey) console.log('item-', item.uniqKey, item);
    // 确保这个模式要传递下去
    if (item.propsForBlock) {
      _.defaults(item.propsForBlock, {
        overflowMode: props.blockOverflowMode,
      });
      // 如果是一个用 TiBlock 包裹的嵌套布局，那么也需要考虑传递下去
      if (
        'TiLayoutGrid' == item.propsForBlock.comType &&
        item.propsForBlock.comConf
      ) {
        _.defaults(item.propsForBlock.comConf, {
          blockOverflowMode: props.blockOverflowMode,
        });
      }
    }
    // 嵌套布局，要传递下去
    else if (item.propsForLayoutGrid) {
      _.defaults(item.propsForLayoutGrid, {
        blockOverflowMode: props.blockOverflowMode,
      });
    }
    //
    // 处理调整拖拽条
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
