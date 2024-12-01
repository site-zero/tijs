import _ from 'lodash';
import { Vars } from '../../../_type';
//--------------------------------------------------
/**
 * 判断测试值(val)是否能匹配候选值(canValue)。
 * 譬如，匹配发方式是 startsWith 的话，那么就相当于
 *  `${canValue}`.startsWith(val)
 */
export type ValueMatcher = (val: string, candidate: string) => boolean;
//--------------------------------------------------
type ValueMatcherSet = {
  equals: ValueMatcher;
  startsWith: ValueMatcher;
  endsWith: ValueMatcher;
  contains: ValueMatcher;
};
//--------------------------------------------------
export type ValueMatchMode = keyof ValueMatcherSet;
export function isValueMatchMode(mode: any): boolean {
  return getValueMatcher(mode) ? true : false;
}
export function toValueMatchMode(mode: any): ValueMatchMode {
  if (isValueMatchMode(mode)) {
    return mode;
  }
  throw `Invalid ValueMatchMode : ${mode}`;
}
//--------------------------------------------------
const VALUE_MATCH_MODES: ValueMatcherSet = {
  equals: (val, can) => val == can,
  startsWith: (val, can) => can.startsWith(val),
  endsWith: (val, can) => can.endsWith(val),
  contains: (val, can) => can.indexOf(val) >= 0,
};
//--------------------------------------------------
export function getValueMatcher(mode: ValueMatchMode): ValueMatcher {
  return VALUE_MATCH_MODES[mode];
}
//--------------------------------------------------
export type ItemFieldLookup = {
  /**
   * 对应到对象的键
   */
  key: string;
  /**
   * 匹配值的模式
   * 默认 equals
   */
  mode?: ValueMatchMode;
  /**
   * 匹配的时候忽略大小写
   */
  ignoreCase?: boolean;
};
//--------------------------------------------------
function _str_to_lookup(str: string): ItemFieldLookup {
  let m = /^([\^$*=])?(~)?(.+)$/.exec(str) || [];
  return {
    key: m[3] || str,
    mode: toValueMatchMode(
      {
        '=': 'equals',
        '^': 'startsWidth',
        '$': 'endsWith',
        '*': 'contains',
      }[m[1]] || 'equals'
    ),
    ignoreCase: m[2] == '~',
  };
}
//--------------------------------------------------
function _to_item_matcher(input: ItemLookupInput): ItemMatcher {
  let lookup: ItemFieldLookup;
  if (_.isString(input)) {
    lookup = _str_to_lookup(input);
  } else {
    lookup = input;
  }

  let { key, ignoreCase, mode } = lookup;
  let is_match_value = getValueMatcher(mode || 'equals');
  return (item: Vars, hint: string) => {
    let can_val = `${item[key]}`;
    let hint_val = `${hint}`;
    if (ignoreCase) {
      can_val = can_val.toUpperCase();
      hint_val = hint_val.toUpperCase();
    }
    return is_match_value(hint_val, can_val);
  };
}
//--------------------------------------------------
/**
 * 返回 true 表示匹配
 */
export type ItemMatcher = (it: Vars, hint: string) => boolean;
//--------------------------------------------------
/**
 * 最终查询方法要变成一个 ItemMatcher，这里特别解释一下 string
 * 它就是 ItemFieldLookup 的快捷形式，可以有下面的形式
 *
 * - `name` : `{key:'name',mode:'equals'}`
 * - `~name` : `{key:'name',mode:'equals',ignoreCase:true}
 * - `^~name` : `{key:'name',mode:'equals',ignoreCase:true, mode:'startsWith'}`
 * - `$~name` : `{key:'name',mode:'equals',ignoreCase:true, mode:'endsWith'}`
 * - `*~name` : `{key:'name',mode:'equals',ignoreCase:true, mode:'contains'}`
 * - `=~name` : `{key:'name',mode:'equals',ignoreCase:true, mode:'equals'}`
 */
export type ItemLookupInput = string | ItemFieldLookup;
//--------------------------------------------------
export type ItemLookupProps = {
  lookup?: ItemLookupInput | ItemLookupInput[] | ItemMatcher;
};
//--------------------------------------------------
export function useItemLookup(props: ItemLookupProps): ItemMatcher {
  // 防空
  if (!props.lookup || _.isEmpty(props.lookup)) {
    return () => false;
  }
  // 定制
  if (_.isFunction(props.lookup)) {
    return props.lookup;
  }
  // 逐个编制
  let _lookups = _.concat([], props.lookup);
  let _matchers: ItemMatcher[] = [];
  for (let look of _lookups) {
    let match = _to_item_matcher(look);
    _matchers.push(match);
  }
  // 返回判断函数，任何一个条件满足就能匹配
  return (it: Vars, hint: string) => {
    for (let match of _matchers) {
      if (match(it, hint)) {
        return true;
      }
    }
    return false;
  };
}
//--------------------------------------------------
