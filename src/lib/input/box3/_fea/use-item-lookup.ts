import { Vars } from "@site0/tijs";
import _ from "lodash";
import {
  getValueMatcher,
  ItemFieldLookup,
  ItemLookupInput,
  ItemLookupProps,
  ItemMatcher,
  toValueMatchMode,
} from "./types-item-lookup";
//--------------------------------------------------
export type ItemLookupApi = ReturnType<typeof useItemLookup>;
//--------------------------------------------------
function _to_item_matcher(input: ItemLookupInput): ItemMatcher {
  let lookup: ItemFieldLookup;
  if (_.isString(input)) {
    lookup = _str_to_lookup(input);
  } else {
    lookup = input;
  }

  let { key, ignoreCase, mode } = lookup;
  let is_match_value = getValueMatcher(mode || "equals");
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
function _str_to_lookup(str: string): ItemFieldLookup {
  let m = /^([\^$*=])?(~)?(.+)$/.exec(str) || [];
  return {
    key: m[3] || str,
    mode: toValueMatchMode(
      {
        "=": "equals",
        "^": "startsWith",
        "$": "endsWith",
        "*": "contains",
      }[m[1]] || "equals"
    ),
    ignoreCase: m[2] == "~",
  };
}
//--------------------------------------------------
export function useItemLookup(props: ItemLookupProps) {
  let matchers: ItemMatcher[] = [];
  //--------------------------------------------------
  // 逐个编制
  //--------------------------------------------------
  let lookups = _.concat([], props.lookup);
  for (let lookup of lookups) {
    if (!lookup) {
      continue;
    }
    if (_.isFunction(lookup)) {
      matchers.push(lookup);
      continue;
    }
    let match = _to_item_matcher(lookup);
    matchers.push(match);
  }
  //--------------------------------------------------
  // 判断函数，任何一个条件满足就能匹配
  function matchAny(it: Vars, hint: string): boolean {
    for (let match of matchers) {
      if (match(it, hint)) {
        return true;
      }
    }
    return false;
  }
  //--------------------------------------------------
  // 返回输出接口
  //--------------------------------------------------
  return {
    matchers,
    matchAll: matchAny,
  };
}
