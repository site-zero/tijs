import _ from 'lodash';
import { ExplainI18n, TiMatch, Vars } from '../ti';
import { gen_by_func } from './by-func';
import { gen_by_array } from './by_array';
import { gen_by_bool } from './by_bool';
import { gen_by_map } from './by_map';
import { gen_by_map_empty } from './by_map_empty';
import { gen_by_map_find_in_array } from './by_map_find_in_array';
import { gen_by_map_nil } from './by_map_nil';
import { gen_by_map_null } from './by_map_null';
import { gen_by_map_type } from './by_map_type';
import { gen_by_map_undefined } from './by_map_undefined';
import { gen_by_nil } from './by_nil';
import { gen_by_not } from './by_not';
import { gen_by_regex } from './by_regex';
import { gen_by_str } from './by_str';
import { gen_by_stict_eq } from './by_strict_eq';

export type MakeTiMatch<T> = {
  (src: T): TiMatch;
};

export function createExplainI18n(): ExplainI18n {
  return {
    and: 'i18n:am-and',
    blank: 'i18n:am-blank',
    empty: 'i18n:am-empty',
    emptyOf: 'i18n:am-emptyOf', // !!!!!!!!!!!!!!
    emptyItems: 'i18n:am-empty-items',
    equals: 'i18n:am-equals',
    equalsIgnoreCase: 'i18n:am-equalsIgnoreCase',
    equalsType: 'i18n:am-equalsType',
    exists: 'i18n:am-exists',
    //................................
    findInArray: 'i18n:am-findInArray',
    gt: 'i18n:am-gt',
    gte: 'i18n:am-gte',
    lt: 'i18n:am-lt',
    lte: 'i18n:am-lte',
    matchOf: 'i18n:am-matchOf',
    mustBoolFalse: 'i18n:am-must-false',
    mustBoolTrue: 'i18n:am-must-true',
    //................................
    nil: 'i18n:am-nil',
    nilOf: 'i18n:am-nilOf',
    noexists: 'i18n:am-noexists',
    //................................
    not: 'i18n:am-not',
    func: 'i18n:am-not-sure',
    notEquals: 'i18n:am-not-equals',
    notNil: 'i18n:am-notNil',
    notNilOf: 'i18n:am-notNilOf',
    //................................
    null: 'i18n:am-null',
    nullOf: 'i18n:am-nullOf',
    //................................
    or: 'i18n:am-or',
    regex: 'i18n:am-regex',
    regexNot: 'i18n:am-regex-not',
    undefined: 'i18n:am-undefined',
    undefinedOf: 'i18n:am-undefinedOf',
  };
}

export function notMatch(m: TiMatch): TiMatch {
  return gen_by_not(m);
}

export function parse(src: any, dft: boolean = false): TiMatch {
  if (_.isNil(src)) {
    return gen_by_bool(dft);
  }
  if (_.isBoolean(src)) {
    return gen_by_bool(src);
  }
  return parse_strictly(src);
}

export function parse_strictly(src: any): TiMatch {
  if (_.isFunction(src)) {
    return gen_by_func(src);
  }
  if (_.isNil(src)) {
    return gen_by_nil();
  }
  if (_.isBoolean(src)) {
    return gen_by_stict_eq(src);
  }
  if (_.isNumber(src)) {
    return gen_by_stict_eq(src);
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
  throw new Error('e.match.unsupport : ' + src);
}

export function test(src: any, val: any) {
  let m = parse(src);
  return m.test(val);
}

function gen_map(src: Vars): TiMatch {
  // Special Function
  if (src['$Nil']) {
    let key_of_obj = src['$Nil'];
    return gen_by_map_nil(key_of_obj);
  }
  if (src['$Null']) {
    let key_of_obj = src['$Nil'];
    return gen_by_map_null(key_of_obj);
  }
  if (src['$Undefined']) {
    let key_of_obj = src['$Undefined'];
    return gen_by_map_undefined(key_of_obj);
  }
  if (src['$Empty']) {
    let key_of_obj = src['$Empty'];
    return gen_by_map_empty(key_of_obj);
  }
  if (src['$Type']) {
    let type = src['$Type'];
    return gen_by_map_type(type);
  }
  if (src.matchMode == 'findInArray' && src.matchBy) {
    return gen_by_map_find_in_array(src);
  }

  // General Map Match
  return gen_by_map(src);
}
