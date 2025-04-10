import _ from 'lodash';
import { Vars } from '../../_type';

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
