import _ from "lodash";
import { KeepFeature, LayoutItem } from "../../../";

import { ComputedRef, Ref } from "vue";
import { StrOptionItem } from "../../../../_type";
import { CssUtils } from "../../../../core";
import { TabsProps } from "../../../action/tabs/ti-tabs-types";
import { LayoutTabItem, TabsLayoutProps } from "./ti-layout-tabs-types";

export type TabMain = LayoutTabItem & {
  // uniqKey?: string;
  // name?: string;
  // title?: string;
  // icon?: IconInput;
  // com: TiRawCom;
  // config: Vars;
  //tabInfo: LayoutTabItem;
};

export function buildOneTab(
  items: LayoutTabItem[],
  tabKey: string | undefined,
  debug?: boolean
) {
  if (_.isNil(tabKey)) {
    return;
  }
  if (debug) console.log("buildOneTab : tabKey=", tabKey);
  for (let item of items) {
    if (debug) console.log("buildOneTab : item=", item.uniqKey);
    if (item.uniqKey != tabKey) {
      continue;
    }
    if (debug) console.log("buildOneTab : return ", item);
    return item;
  }
  if (debug) console.log("buildOneTab : return undefined");
}

export function buildLayoutTabsConfig(
  props: TabsLayoutProps,
  blocks: LayoutTabItem[]
): Omit<TabsProps, "value"> {
  let options = [] as StrOptionItem[];
  for (let block of blocks) {
    options.push({
      icon: block.icon,
      text: block.title || block.name,
      value: block.uniqKey,
    });
  }
  return {
    options,
    wrapTabs: props.wrapTabs,
    tabsAt: props.tabsAt,
    tabsAlign: props.tabsAlign,
    tabItemSpace: props.tabItemSpace,
    tabMaxWidth: props.tabMaxWidth,
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
        break;
      }
      // 默认标签是块名
      else if (
        _.isString(defaultTab) &&
        block.name &&
        defaultTab == block.name
      ) {
        dftKey = block.uniqKey;
        break;
      }
    }
  }
  // 默认选择第一个
  if (!dftKey && blocks.value && blocks.value.length > 0) {
    dftKey = blocks.value[0].uniqKey;
  }

  // 从本地恢复
  let re = Keep.value.load(dftKey) || undefined;
  // console.log('from local', re, dftKey);
  return re;
}
