import _ from 'lodash';

export function filterRecordNilValue(val: any): any {
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

  // 递归处理
  let re = {} as any;
  let ks = _.keys(val);
  for (let k of ks) {
    let v = val[k];
    if (_.isNil(v) || /^_/.test(k)) {
      continue;
    }
    // 处理对象
    if (_.isPlainObject(v)) {
      let obj = filterRecordNilValue(v);
      re[k] = obj;
    }
    // 处理数组
    else if (_.isArray(v)) {
      let list = [] as any[];
      for (let li of v) {
        let l2 = filterRecordNilValue(li);
        list.push(l2);
      }
      re[k] = list;
    }
    // 其他值
    else {
      re[k] = v;
    }
  }
  return re;
}
