import _ from "lodash";
import { mapToObj } from "../";
import { Vars } from "../../_type";

export type RecordDiffOptions = {
  /**
   * 指示是否检查从原始记录中移除的项。所有被移除的项目，将用 null 返回
   * 默认为 true
   */
  checkRemoveFromOrgin?: boolean;
};

export function getRecordDiff(
  org: Vars,
  data: Vars,
  options: RecordDiffOptions = {}
): Vars {
  let { checkRemoveFromOrgin = true } = options;
  let diff: Vars = {};
  // 看看哪些被修改了
  _.forEach(data, (v0, k) => {
    let vOld = _.get(org, k);
    if (!_.isEqual(vOld, v0)) {
      _.set(diff, k, v0);
    }
  });
  // 看看哪些被删掉了
  if (checkRemoveFromOrgin) {
    _.forEach(org, (_v, k) => {
      if (_.isUndefined(data[k])) {
        diff[k] = null;
      }
    });
  }
  return diff;
}

export function getRecordDiffDeeply(
  org: Vars,
  data: Vars,
  options: RecordDiffOptions = {}
): Vars {
  let { checkRemoveFromOrgin = true } = options;
  let diff: Vars = {};
  // 看看哪些被修改了
  _.forEach(data, (v0, k) => {
    let v_old = _.get(org, k);
    // 都是对象，递归
    if (_.isPlainObject(v_old) && _.isPlainObject(v0)) {
      let v_diff = getRecordDiffDeeply(v_old, v0, options);
      if (!_.isEmpty(v_diff)) {
        _.set(diff, k, v_diff);
        return;
      }
    }
    // 否则直判一下是否相等
    if (!_.isEqual(v_old, v0)) {
      _.set(diff, k, v0);
    }
  });
  // 看看哪些被删掉了
  if (checkRemoveFromOrgin) {
    _.forEach(org, (_v, k) => {
      if (_.isUndefined(data[k])) {
        diff[k] = null;
      }
    });
  }
  return diff;
}

export function setRecordEmptyToNull(obj: Vars) {
  _.forEach(obj, (v, k) => {
    if (_.isEmpty(v)) {
      obj[k] = null;
    }
  });
}

export function setMapEmptyToNull(map: Map<string, any>) {
  for (let [k, v] of map) {
    if (_.isEmpty(v)) {
      map.set(k, null);
    }
  }
}

export function isDeepEqual(o0: any, o1: any) {
  // undefined
  if (_.isUndefined(o0)) {
    return _.isUndefined(o1);
  }
  // null
  if (_.isNull(o0)) {
    return _.isNull(o1);
  }
  // 空字符串
  if ("" === o0) {
    return "" === o1;
  }
  // 0 值
  if (0 === o0) {
    return 0 === o1;
  }
  // 数组
  if (_.isArray(o0)) {
    if (!_.isArray(o1) || o0.length != o1.length) {
      return false;
    }
    for (let i = 0; i < o0.length; i++) {
      let v0 = o0[i];
      let v1 = o1[i];
      if (!isDeepEqual(v0, v1)) {
        return false;
      }
    }
    return true;
  }
  // 对象
  if (_.isPlainObject(o0)) {
    if (!_.isPlainObject(o1)) {
      return false;
    }
    let diff = getRecordDiffDeeply(o0, o1);
    return Object.keys(diff).length == 0;
  }
  // Map
  if (_.isMap(o0)) {
    if (!_.isMap(o1)) {
      return false;
    }
    let obj0 = mapToObj(o0);
    let obj1 = mapToObj(o1);
    let diff = getRecordDiffDeeply(obj0, obj1);
    return Object.keys(diff).length == 0;
  }
  // 集合
  if (_.isSet(o0)) {
    if (!_.isSet(o1) || o0.size != o1.size) {
      return false;
    }
    let list0 = [...o0];
    let list1 = [...o1];
    return isDeepEqual(list0, list1);
  }

  // 采用 JS 比较宽泛的比较一下
  return o0 == o1;
}
