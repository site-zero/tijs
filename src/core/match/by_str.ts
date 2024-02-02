import _ from "lodash";
import { TiMatch } from "../ti";
import {  MakeTiMatch } from "./ti-match";
import { gen_by_empty } from "./by_empty";
import { gen_by_blank } from "./by_blank";
import { gen_by_not } from "./by_not";
import { gen_by_num_range } from "./by_num_range";
import { gen_by_regex } from "./by_regex";
import { gen_by_stict_eq } from "./by_strict_eq";
import { gen_by_wildcard } from "./by_wildcard";

export const gen_by_str: MakeTiMatch<string> = function (
  src: string
): TiMatch {
  // 预先处理
  if (_.isEmpty(src)) {
    return gen_by_empty(src);
  }

  // 提出一个 NOT
  let s = src.trim();
  let not = s.startsWith("!");
  if (not) {
    s = s.substring(1);
  }

  // 来一个统一的包裹函数，处理 NOT
  const _W = (m: TiMatch) => {
    if (not) {
      return gen_by_not(m);
    }
    return m;
  };

  // [BLANK]
  if ("[BLANK]" == s) {
    return _W(gen_by_blank(s));
  }

  // Regex
  if (/^\^/.test(s)) {
    let reg = new RegExp(s);
    return _W(gen_by_regex(reg));
  }

  // Range
  if (/^([(\[])([^\]]+)([)\]])$/.exec(s)) {
    return _W(gen_by_num_range(s));
  }

  // Wildcard
  if (/\*/.test(s)) {
    return _W(gen_by_wildcard(s));
  }

  // 默认就是绝对的相等
  return _W(gen_by_stict_eq(s));
};
