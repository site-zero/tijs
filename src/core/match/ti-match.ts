import _ from "lodash";
import { ExplainI18n, MessageMap, TiMatch, Vars } from "../ti";
import { gen_by_func } from "./by-func";
import { gen_by_array } from "./by_array";
import { gen_by_bool } from "./by_bool";
import { gen_by_map } from "./by_map";
import { gen_by_map_empty } from "./by_map_empty";
import { gen_by_map_find_in_array } from "./by_map_find_in_array";
import { gen_by_map_nil } from "./by_map_nil";
import { gen_by_map_null } from "./by_map_null";
import { gen_by_map_type } from "./by_map_type";
import { gen_by_map_undefined } from "./by_map_undefined";
import { gen_by_not } from "./by_not";
import { gen_by_number } from "./by_number";
import { gen_by_regex } from "./by_regex";
import { gen_by_str } from "./by_str";

export type MakeTiMatch<T> = {
  (src: T): TiMatch;
};

export function createExplainI18n(msg: MessageMap = {}): ExplainI18n {
  return _.defaults(msg, {
    and: "i18n:am-and",
    blank: "i18n:am-blank",
    or: "i18n:am-or",
    not: "i18n:am-not",
    func: "i18n:am-not-sure",
    boolFalse: "i18n:am-must-false",
    boolTrue: "i18n:am-must-true",
    undefined: "i18n:am-undefined",
    undefinedOf: "i18n:am-undefinedOf",
    equalsType: "i18n:am-equalsType",
    equalsIgnoreCase: "i18n:am-equalsIgnoreCase",
    equals: "i18n:am-equals",
    notEquals: "i18n:am-not-equals",
    gt: "i18n:am-gt",
    gte: "i18n:am-gte",
    lt: "i18n:am-lt",
    lte: "i18n:am-lte",
    matchOf: "i18n:am-matchOf",
    exists: "i18n:am-exists",
    noexists: "i18n:am-noexists",
    nil: "i18n:am-nil",
    nilOf: "i18n:am-nilOf",
    notNil: "i18n:am-notNil",
    notNilOf: "i18n:am-notNilOf",
    null: "i18n:am-null",
    nullOf: "i18n:am-nullOf",
    empty: "i18n:am-empty",
    emptyOf: "i18n:am-emptyOf",
    findInArray: "i18n:am-findInArray",
    emptyItems: "i18n:hm-am-empty",
    regex: "i18n:hm-am-regex",
    regexNot: "i18n:hm-am-regex-not"
  });
}

export function notMatch(m: TiMatch): TiMatch {
  return gen_by_not(m);
}

export function parse(src: any, dft: boolean = false): TiMatch {
  if (_.isFunction(src)) {
    return gen_by_func(src);
  }
  if (_.isNil(src)) {
    return gen_by_bool(dft);
  }
  if (_.isBoolean(src)) {
    return gen_by_bool(src);
  }
  if (_.isNumber(src)) {
    return gen_by_number(src);
  }
  if (_.isString(src)) {
    return gen_by_str(src);
  }
  if (_.isArray(src)) {
    return gen_by_array(src);
  }
  // Map
  if (_.isPlainObject(src) || src instanceof Map) {
    return gen_map(src);
  }
  // REGEXP
  if (_.isRegExp(src)) {
    return gen_by_regex(src);
  }

  throw new Error("e.match.unsupport : " + src);
}

export function test(src: any, val: any) {
  let m = parse(src);
  return m.test(val);
}

function gen_map(src: Vars): TiMatch {
  // Special Function
  if (src["$Nil"]) {
    let key_of_obj = src["$Nil"];
    return gen_by_map_nil(key_of_obj);
  }
  if (src["$Null"]) {
    let key_of_obj = src["$Nil"];
    return gen_by_map_null(key_of_obj);
  }
  if (src["$Undefined"]) {
    let key_of_obj = src["$Undefined"];
    return gen_by_map_undefined(key_of_obj);
  }
  if (src["$Empty"]) {
    let key_of_obj = src["$Empty"];
    return gen_by_map_empty(key_of_obj);
  }
  if (src["$Type"]) {
    let type = src["$Type"];
    return gen_by_map_type(type);
  }
  if (src.matchMode == "findInArray" && src.matchBy) {
    return gen_by_map_find_in_array(src);
  }

  // General Map Match
  return gen_by_map(src);
}
