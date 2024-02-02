import _ from "lodash";
import { genObjGetter } from "./util-getter";

/**
 * 有时候，函数的返回值被要求是 `Promise`，
 * 但是我们只需要返回一个静态值即可。
 *
 * 为了这种情况，不得写几行啰嗦的代码。
 * 我们提供一个这个函数，会让你的代码会看的整齐点
 *
 * @param reValue 要返回的值
 * @returns `Promise`包裹对象
 */
export function wrapPromise<E>(reValue: E): Promise<E> {
  return new Promise<E>((resolve) => {
    resolve(reValue);
  });
}

export function wrapPromiseFunc<F extends Function, W extends Function>(
  funcs?: F | F[]
): W[] {
  let list: W[] = [];
  if (!funcs) {
    return list;
  }
  if (!_.isArray(funcs)) {
    funcs = [funcs];
  }
  for (let func of funcs) {
    list.push(func as unknown as W);
  }
  return list;
}

/**
 *
 * @param obj 对象
 * @param key 键，可以是数组或者是字符串，如果是数组表示 pick 一个子对象，
 * 否则会根据键返回对应值，键支持多个键 fallback，多个键用 `|` 分割
 * @param dft 返回的默认值
 * @returns 值或子对象
 */
export function getOrPick(obj: any, key: string | string[], dft: any): any {
  // Pick 出一个子对象
  if (_.isArray(key)) {
    return _.pick(obj, key) ?? dft;
  }
  // 获取候选值
  let getter = genObjGetter(key, {
    test: (val: any) => !_.isUndefined(val),
    enableKeyPath: true,
    dft
  });
  return getter(obj);
}

/***
 * Get value from object fallbackly
 *
 * @param obj{Object} - source object
 * @param keys{Array} - candicate keys
 *
 * @return `undefined` if not found
 */
export function getFallback(obj: any, ...keys: any[]) {
  let ks = _.flattenDeep(keys);
  for (let k of ks) {
    if (k) {
      let v = _.get(obj, k);
      if (!_.isUndefined(v)) return v;
    }
  }
}
export function getFallbackNil(obj: any, ...keys: any[]) {
  let ks = _.flattenDeep(keys);
  for (let k of ks) {
    if (k) {
      let v = _.get(obj, k);
      if (!_.isNil(v)) return v;
    }
  }
}
export function getFallbackEmpty(obj: any, ...keys: any[]) {
  let ks = _.flattenDeep(keys);
  for (let k of ks) {
    if (k) {
      let v = _.get(obj, k);
      if (!_.isEmpty(v)) return v;
    }
  }
}
export function getFallbackBlank(obj: any, ...keys: any[]) {
  let ks = _.flattenDeep(keys);
  for (let k of ks) {
    if (k) {
      let v = _.get(obj, k);
      if (!isBlank(v)) return v;
    }
  }
}
export function getFallbackNaN(obj: any, ...keys: any[]) {
  let ks = _.flattenDeep(keys);
  for (let k of ks) {
    if (k) {
      let v = _.get(obj, k);
      if (!isNaN(v)) return v;
    }
  }
}
/***
 * Fallback a group value
 *
 * @return The first one which is not undefined
 */
export function fallback<T>(...args: T[]): T | undefined {
  for (let arg of args) {
    if (!_.isUndefined(arg)) {
      return arg;
    }
  }
}
export function fallbackNil<T>(...args: T[]): T | undefined {
  for (let arg of args) {
    if (!_.isNil(arg)) {
      return arg;
    }
  }
}

/**
 *
 * @param test 一个判断结果
 * @param val  如果判断为真应该返回的值
 * @param dft 如果判断为假，应该返回的值
 * @returns 判断结果
 */
export function trueGet<T>(test: boolean | T, val: T, dft: T) {
  if (_.isBoolean(test)) {
    return (test as boolean) ? val : dft;
  }
  return test as T;
}
export function fallbackEmpty<T>(...args: T[]): T | undefined {
  for (let arg of args) {
    if (!_.isEmpty(arg)) {
      return arg;
    }
  }
}
export function fallbackBlank<T>(...args: T[]): T | undefined {
  for (let arg of args) {
    if (!isBlank(arg)) {
      return arg;
    }
  }
}
export function fallbackNaN<T>(...args: T[]): T | undefined {
  for (let arg of args) {
    if (_.isNumber(arg)) {
      return arg;
    }
  }
}
export function notEmpty(o: any) {
  return !_.isEmpty(o);
}
export function notNil(o: any) {
  return !_.isNil(o);
}
export function notEmptyOf(o: any, key: any) {
  let v = _.get(o, key);
  return !_.isEmpty(v);
}
export function notNilOf(o: any, key: any) {
  let v = _.get(o, key);
  return !_.isNil(v);
}
export function isEqual(o1: any, o2: any) {
  return _.isEqual(o1, o2);
}
export function notEqual(o1: any, o2: any) {
  return !_.isEqual(o1, o2);
}
export function notEquals(o1: any, ...o2: any[]) {
  for (let i = 0; i < o2.length; i++) {
    if (_.isEqual(o1, o2[i])) {
      return false;
    }
  }
  return true;
}

export function isBlank(o: any) {
  return _.isUndefined(o) || _.isNull(o) || "" === o || /^[ \t]*$/.test(o);
}
export function notBlank(o: any) {
  return !isBlank(o);
}

export function anyToBool(v: any, trueReg = /^(true|yes|on)$/i): boolean {
  if (_.isNil(v)) {
    return false;
  }
  if (_.isBoolean(v)) {
    return v;
  }
  if (_.isNumber(v)) {
    v = v !== 0;
  }
  return trueReg.test(v);
}

/**
 * 一个帮助函数而已，方便通过  `ID[]` 生成 `Map<ID,boolean>`
 *
 * @param ids ID 列表
 */
export function arrayToMap<T>(ids?: T[]): Map<T, boolean> {
  let map = new Map<T, boolean>();
  if (ids) {
    for (let id of ids) {
      map.set(id, true);
    }
  }
  return map;
}

/**
 * 一个帮助函数而已，方便通过 `Map<T,any>` 生成 `ID[]`
 *
 * @param ids ID 列表
 */
export function mapTruthyKeys<T>(map?: Map<T, any>): T[] {
  let keys = [] as T[];
  if (map) {
    for (let it of map.entries()) {
      let [id, yes] = it;
      if (yes) {
        keys.push(id);
      }
    }
  }
  return keys;
}

/**
 * @param obj 原生对象或者 Map
 * @returns  `Map<K,V>`
 */
export function objToMap<K extends string | number, V>(
  obj?: Record<K, V> | Map<K, V>
): Map<K, V> {
  if (obj instanceof Map) {
    return obj;
  }
  let map = new Map<K, V>();
  _.forEach(obj, (v, k) => {
    map.set(k as K, v);
  });
  return map;
}

/**
 * 浅层合并 `Map`
 *
 * @param a
 * @param b
 * @return 传入的第一个参数
 */
export function assignMap<K extends string | number, V>(
  a: Map<K, V>,
  b: Map<K, V>
) {
  for (let en of b.entries()) {
    let [k, v] = en;
    a.set(k, v);
  }
  return a;
}
