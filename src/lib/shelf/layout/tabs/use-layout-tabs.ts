import _ from 'lodash';
import { KeepFeature, LayoutItem, TabsProps, useFieldCom } from '../../../';

import { ComputedRef, Ref } from 'vue';
import { IconInput, StrOptionItem, TiRawCom, Vars } from '../../../../core';
import { LayoutTabItem, LayoutTabsProps } from './ti-layout-tabs-types';

export type TabMain = {
  item: LayoutTabItem;
  title?: string;
  icon?: IconInput;
  com: TiRawCom;
  config: Vars;
};

export function buildMainTab(items: LayoutTabItem[]): TabMain | undefined {
  for (let item of items) {
    if (!item.current) {
      continue;
    }
    let comType = item?.itemConfig?.comType;
    let comConf = item?.itemConfig?.comConf;
    const { getComType } = useFieldCom({
      comType,
      comConf,
    });
    return {
      item,
      title: item?.title,
      icon: item?.icon,
      com: getComType(),
      config: comConf,
    };
  }
}

export function buildLayoutTabBlocks(
  blocks: LayoutItem[],
  currentTabKey?: string
): LayoutTabItem[] {
  let items = _.cloneDeep(blocks) as LayoutTabItem[];
  for (let item of items) {
    item.current = item.uniqKey == currentTabKey;
  }
  return items;
}

export function buildLayoutTabsConfig(
  props: LayoutTabsProps,
  blocks: LayoutTabItem[]
): TabsProps {
  let value = undefined;
  let options = [] as StrOptionItem[];
  for (let block of blocks) {
    if (block.current) {
      value = block.uniqKey;
    }
    options.push({
      icon: block.icon,
      text: block.title || block.name,
      value: block.uniqKey,
    });
  }
  if (_.isNil(value) && blocks.length > 0) {
    value = blocks[0].uniqKey;
  }
  return {
    value,
    options,
    wrapTabs: props.wrapTabs,
    tabsAt: props.tabsAt,
    tabsAlign: props.tabsAlign,
    tabItemSpace: props.tabItemSpace,
  };
}

export function autoSetCurrentTablKey(
  tabKey: Ref<string | undefined>,
  blocks: ComputedRef<LayoutItem[]>,
  Keep: ComputedRef<KeepFeature>,
  defaultTab?: string | number
) {
  // 如果已经有了，则看看是否在块列表里
  if (tabKey.value) {
    if (blocks.value) {
      for (let block of blocks.value) {
        if (block.uniqKey == tabKey.value) {
          return;
        }
      }
    }
  }

  // 那么就需要选择默认标签
  tabKey.value = findCurrentTabKey(blocks, Keep, defaultTab);
}

export function findCurrentTabKey(
  blocks: ComputedRef<LayoutItem[]>,
  Keep: ComputedRef<KeepFeature>,
  defaultTab?: string | number
): string | undefined {
  if (!blocks.value || _.isEmpty(blocks.value)) {
    return;
  }

  // 从默认恢复
  let dftKey: string | undefined;
  if (!_.isNil(defaultTab)) {
    for (let i = 0; i < blocks.value.length; i++) {
      let block = blocks.value[i];
      // 默认标签是下标
      if (_.isNumber(defaultTab) && i == defaultTab) {
        dftKey = block.uniqKey;
      }
      // 默认标签是块名
      else if (
        _.isString(defaultTab) &&
        block.name &&
        defaultTab == block.name
      ) {
        dftKey = block.uniqKey;
      }
    }
  }
  // 默认选择第一个
  if (!dftKey && blocks.value && blocks.value.length > 0) {
    dftKey = blocks.value[0].uniqKey;
  }

  // 从本地恢复
  return Keep.value.load(dftKey) || undefined;
}
