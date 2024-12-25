import _ from 'lodash';

export function filterRecordNilValueDeeply(val: any): any {
  // 特殊值，有些时候需要保留 null 以便数据库判断 IS NULL 条件
  // 我们用特殊的  '<NULL>' 来表示，一边区分原生的 null，因为原生的 null
  // 主要意思是这个条件无视
  if (val === '<NULL>') {
    return null;
  }
  // 保持简单的值
  if (
    !val ||
    _.isNumber(val) ||
    _.isString(val) ||
    _.isBoolean(val) ||
    _.isDate(val) ||
    _.isRegExp(val) ||
    _.isFunction(val)
  ) {
    return val;
  }

  // 递归处理: 数组
  if (_.isArray(val)) {
    let list = [] as any[];
    for (let li of val) {
      let l2 = filterRecordNilValueDeeply(li);
      list.push(l2);
    }
    return list;
  }

  // 递归处理: 对象
  let re = {} as any;
  let ks = _.keys(val);
  for (let k of ks) {
    let v = val[k];
    if (_.isNil(v) || /^_/.test(k)) {
      continue;
    }
    re[k] = filterRecordNilValueDeeply(v);
  }
  return re;
}

export function filterRecord<K extends string | number, V>(
  map: Record<K, V>,
  predicate: (v: V, k: K) => boolean
): Record<K, V> {
  let re = {} as Record<K, V>;
  for (let [k, v] of Object.entries(map)) {
    if (predicate(v as V, k as K)) {
      re[k as K] = v as V;
    }
  }
  return re;
}

export function filterRecordNilValue<K extends string | number, V>(
  map: Record<K, V | null | undefined>
): Record<K, V> {
  let re = {} as Record<K, V>;
  for (let [k, v] of Object.entries(map)) {
    if (!_.isNil(v)) {
      re[k as K] = v as V;
    }
  }
  return re;
}
