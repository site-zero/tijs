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
