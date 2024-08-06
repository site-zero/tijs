import _ from 'lodash';
import { genObjGetter } from './util-getter';

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
    dft,
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
  return _.isUndefined(o) || _.isNull(o) || '' === o || /^[ \t]*$/.test(o);
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
export function arrayToSet<T>(ids?: T[]): Set<T> {
  let set = new Set<T>();
  if (ids) {
    for (let id of ids) {
      set.add(id);
    }
  }
  return set;
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
 * 一个帮助函数而已，方便通过  `ID[]` 生成 `Map<ID,boolean>`
 *
 * @param ids ID 列表
 */
export function arrayToRecord<T extends string | number | symbol>(
  ids?: T[]
): Record<T, boolean> {
  let re = {} as Record<T, boolean>;
  if (ids) {
    for (let id of ids) {
      re[id] = true;
    }
  }
  return re;
}

/**
 * 一个帮助函数而已，方便通过 `Map<T,any>` 生成 `ID[]`
 *
 * @param ids ID 列表
 */
export function recordTruthyKeys<T extends string>(map?: Record<T, any>): T[] {
  let keys = [] as T[];
  _.forEach(map, (v, k) => {
    if (v) {
      keys.push(k as T);
    }
  });
  return keys;
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
 * @param map  Map 对象转换为普通对象
 *
 * @returns  `Record<K,V>`
 */
export function mapToObj<K extends string | number, V>(
  map: Map<K, V>
): Record<K, V> {
  let re = {} as Record<K, V>;
  if (map && map instanceof Map) {
    for (let [k, v] of map.entries()) {
      re[k] = v;
    }
  }
  return re;
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

/**
 * 判断输入对象是否是同步函数
 *
 * @param input 输入对象
 * @returns
 */
export function isAsyncFunc(input?: any): boolean {
  // 判断是否是 '[object AsyncFunction]'
  let type = Object.prototype.toString.call(input);
  return '[object AsyncFunction]' == type;
}

/**
 * 对于输入对象，尤其是`Array|Object|Map|List`，进行深层递归遍历，
 * 处理所有值为字符串的值，调用 `_.escape` 来逃逸 HTML 的关键字
 *
 * @param input 任意的输入对象
 */
export function escapeAnyForHtml<T>(input: T): T {
  function __escape_value(val: any): any {
    // 处理空
    if (!val) {
      return val;
    }
    // 处理字符串
    if (_.isString(val)) {
      return _.escape(val);
    }
    // 处理数组
    else if (Array.isArray(val)) {
      return val.map(__escape_value);
    }
    // 处理对象
    else if (_.isObject(val)) {
      // Map 对象
      if (val instanceof Map) {
        const _re_map = new Map();
        for (const [k, v] of val.entries()) {
          _re_map.set(k, __escape_value(v));
        }
        return _re_map;
      }
      // 集合
      else if (val instanceof Set) {
        const escapedSet = new Set();
        for (const v of val.values()) {
          escapedSet.add(__escape_value(v));
        }
        return escapedSet;
      }
      // 普通对象
      else {
        const _re_obj: any = {};
        for (const [k, v] of Object.entries(val)) {
          _re_obj[k] = __escape_value(v);
        }
        return _re_obj;
      }
    }
    return val;
  }

  return __escape_value(input) as T;
}
