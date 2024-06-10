import _ from 'lodash';
import { Vars } from '..';

export type RecordDiffOptions = {
  checkRemoveFromOrgin?: boolean;
};

export function getRecordDiff(
  org: Vars,
  data: Vars,
  options: RecordDiffOptions = {}
): Vars {
  let diff: Vars = {};
  // 看看哪些被修改了
  _.forEach(data, (v0, k) => {
    let vOld = _.get(org, k);
    if (!_.isEqual(vOld, v0)) {
      _.set(diff, k, v0);
    }
  });
  // 看看哪些被删掉了
  if (options.checkRemoveFromOrgin) {
    _.forEach(org, (_v, k) => {
      if (_.isUndefined(data[k])) {
        diff[k] = null;
      }
    });
  }
  return diff;
}
