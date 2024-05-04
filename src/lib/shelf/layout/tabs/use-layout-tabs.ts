import _ from 'lodash';
import {
  KeepFeature,
  LayoutItem,
  LayoutTabItem,
  LayoutTabsProps,
  TabsProps,
  useFieldCom,
} from '../../../';
import { IconInput, OptionItem, TiRawCom, Vars } from '../../../../core';

export type TabMain = {
  item: LayoutTabItem;
  title?: string;
  icon?: IconInput;
  com: TiRawCom;
  config: Vars;
};

export function buildTabMain(items: LayoutTabItem[]): TabMain | undefined {
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
  let options = [] as OptionItem[];
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

export function findCurrentTabKey(
  props: LayoutTabsProps,
  Keep: KeepFeature
): string | undefined {
  if (!props.blocks || _.isEmpty(props.blocks)) {
    return;
  }

  // 从默认恢复
  let dftKey: string | undefined;
  if (!_.isNil(props.defaultTab)) {
    for (let i = 0; i < props.blocks.length; i++) {
      let block = props.blocks[i];
      if (_.isNumber(props.defaultTab) && i == props.defaultTab) {
        dftKey = block.uniqKey;
      } else if (
        _.isString(props.defaultTab) &&
        block.name &&
        props.defaultTab == block.name
      ) {
        dftKey = block.uniqKey;
      }
    }
  }
  // 默认选择第一个
  if (!dftKey && props.blocks && props.blocks.length > 0) {
    dftKey = props.blocks[0].uniqKey;
  }

  // 从本地恢复
  return Keep.load(dftKey) || undefined;
}
