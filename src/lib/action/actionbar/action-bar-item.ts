import _ from 'lodash';
import {
  ActionBarItem,
  AltBarItemisplay,
  BarItemAction,
  BarItemType,
  isEventInfo,
} from '../../';
import { Callback, I18n, Match, TiMatch, Util, isInvoke } from '../../../core';
import { BarState, BuiltedBarItem, ItemAncestors } from './action-bar-type';
import { ActionBarOptions } from './use-action-bar';

function __gen_group_children(
  index: number,
  items: ActionBarItem[] | undefined,
  state: BarState,
  options: ActionBarOptions,
  depth: number[]
) {
  if (items) {
    let subItems: BuiltedBarItem[] = [];
    let depth2 = _.concat(depth, index);
    for (let i = 0; i < items.length; i++) {
      let aItem = items[i];
      let bItem = createItem(state, options, aItem, i, depth2);
      tidyItem(aItem, bItem, state, options, depth);
      subItems.push(bItem);
    }
    return subItems;
  }
}

const TIDY_BAR_ITEMS = {
  'action': () => {},
  'group': (aItem, bItem, state, options, depth) => {
    bItem.className['opened'] =
      bItem.opened && /^(open|ready)$/.test(bItem.opened);
    bItem.className['ready'] = bItem.opened == 'ready';
    bItem.className['closed'] = !bItem.opened;
    bItem.items = __gen_group_children(
      bItem.index,
      aItem.items,
      state,
      options,
      depth
    );
  },
  'inline-group': (aItem, bItem, state, options, depth) => {
    bItem.items = __gen_group_children(
      bItem.index,
      aItem.items,
      state,
      options,
      depth
    );
  },
  'status': () => {},
  'sep': () => {},
} as Record<
  BarItemType,
  (
    aItem: ActionBarItem,
    bItem: BuiltedBarItem,
    state: BarState,
    options: ActionBarOptions,
    depth: number[]
  ) => void
>;

function tidyItem(
  aItem: ActionBarItem,
  bItem: BuiltedBarItem,
  state: BarState,
  options: ActionBarOptions,
  depth: number[]
) {
  TIDY_BAR_ITEMS[bItem.type](aItem, bItem, state, options, depth);
}

// action?: Callback | EventInfo<any> | Invoke | string;
function parseItemAction(
  action: BarItemAction | undefined,
  state: BarState,
  options: ActionBarOptions
): Callback | undefined {
  // Guard
  if (!action) {
    return;
  }

  // Callback
  if (_.isFunction(action)) {
    return action;
  }

  // EventInfo<any>
  if (isEventInfo<any>(action, (_it): _it is any => true)) {
    let ei = action;
    return () => {
      let payload = Util.explainObj(state.vars, ei.payload, {
        evalFunc: false,
      });
      options.notify(ei.name, payload);
    };
  }

  // Invoke
  if (isInvoke(action)) {
    return Util.genInvokingBy(action, {
      context: state.vars,
      dft: () => {
        throw new Error('fail to parse: ' + action);
      },
    }) as Callback;
  }

  // String
  return options.parseAction(action, state, options);
}

function createItem(
  state: BarState,
  options: ActionBarOptions,
  it: ActionBarItem,
  index: number,
  depth: number[] = []
): BuiltedBarItem {
  let type: BarItemType;
  if (!it.type) {
    if (it.items) {
      type = 'group';
    } else if (_.isEmpty(it)) {
      type = 'sep';
    } else {
      type = 'action';
    }
  } else {
    type = it.type;
  }

  // 基本信息
  let uniqKey =
    it.name || `${_.camelCase(type)}-${_.concat(depth, index).join('-')}`;
  let re: BuiltedBarItem = {
    uniqKey,
    type,
    index,
    name: it.name,
    icon: it.icon,
    text: I18n.textOr(it.text),
    tip: I18n.textOr(it.tip),
    opened: state.opened.get(uniqKey),
    depth: depth.length,
    className: {},
  };

  // 判断显示
  if (it.altDisplay) {
    let alts = _.concat(it.altDisplay);
    let parsedAlt = [] as AltBarItemisplay<TiMatch>[];
    for (let alt of alts) {
      let a2: AltBarItemisplay<TiMatch> = _.pick(alt, 'icon', 'title');
      if (alt.test) {
        a2.test = Match.parse(alt.test);
      }
      parsedAlt.push(a2);
    }
    re.altDisplay = parsedAlt;
  }

  // 动作回调
  // action?: Callback | EventInfo<any> | Invoke | string;
  re.action = parseItemAction(it.action, state, options);

  // TODO 快捷键

  // 搞定
  return re;
}

export function buildBarViewItems(
  state: BarState,
  items: ActionBarItem[],
  options: ActionBarOptions
): BuiltedBarItem[] {
  let re = [] as BuiltedBarItem[];
  for (let i = 0; i < items.length; i++) {
    let aItem = items[i];
    let bItem = createItem(state, options, aItem, i);
    tidyItem(aItem, bItem, state, options, []);
    // 连续的 Sep 没有必要
    if ('sep' == bItem.type) {
      if (re.length == 0 || 'sep' == re[re.length - 1].type) {
        continue;
      }
    }
    // 记入列表
    re.push(bItem);
  }
  return re;
}

/**
 * 为每个动作项建立一个层级关系映射:
 *
 * ```json5
 * {
 *    uniqKey1: [uniqKey2, uniqKey3, ...]
 * }
 * ```
 *
 * 一个项目的唯一键，对应的数组是这个动作项所有的祖先组 ID。
 * 祖先组的顺序是从根组至父组。
 * 因此，所有根组项目，值都是 `[]`
 */
export function buildItemsAncestors(items: BuiltedBarItem[]): ItemAncestors {
  let map = new Map<string, string[]>();
  const _json_ancestors = function (item: BuiltedBarItem, ans: string[]) {
    map.set(item.uniqKey, [...ans]);
    if (_.isArray(item.items)) {
      let subAns = [...ans, item.uniqKey];
      for (let child of item.items) {
        _json_ancestors(child, subAns);
      }
    }
  };

  for (let item of items) {
    let ans = [] as string[];
    _json_ancestors(item, ans);
  }
  return map;
}
