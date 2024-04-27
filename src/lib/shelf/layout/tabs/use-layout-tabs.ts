import _ from 'lodash';
import { Ref } from 'vue';
import {
  LayoutItemsInput,
  LayoutTabItem,
  LayoutTabsProps,
  TabInfo,
  getLayoutItem
} from '../../../';

export function getLayoutTabItems(
  currentTab: Ref<TabInfo|undefined>,
  props: LayoutItemsInput
): LayoutTabItem[] {
  let items = getLayoutItem({ shown: {} }, props) as LayoutTabItem[];
  for (let item of items) {
    if (item.index == currentTab?.value?.index) {
      item.current = true;
    } else {
      item.current = false;
    }
  }
  return items;
}

export function findCurrentTab(props: LayoutTabsProps): TabInfo | undefined {
  if (!props.blocks || _.isEmpty(props.blocks)) {
    return;
  }
  if (!_.isNil(props.defaultTab)) {
    for (let i = 0; i < props.blocks.length; i++) {
      let block = props.blocks[i];
      if (_.isNumber(props.defaultTab) && i == props.defaultTab) {
        return {
          name: block.name,
          index: i,
        } as TabInfo;
      }
      if (
        _.isString(props.defaultTab) &&
        block.name &&
        props.defaultTab == block.name
      ) {
        return {
          name: block.name,
          index: i,
        } as TabInfo;
      }
    }
  }
  // 默认选择第一个
  return {
    name: props.blocks[0].name,
    index: 0,
  };
}
