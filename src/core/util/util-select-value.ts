import _ from 'lodash';
import { Match, Util } from '../';
import { FuncA2, SelectValueArm, TiMatch, Vars } from '../../_type';

export type SelectValueOptions<T, CTX> = {
  explain?: boolean;
  by?: FuncA2<[T, any], CTX, T | undefined>;
};
/***
 * Select value from the arm which match the context
 *
 * @param context{Any} - the arm match context
 * @param arms{Array} - 2D array to defined the arms.
 * the form for the arm like:
 * ```
 * [
 *    [AutoMatch, Value],
 *    [AutoMatch, Value],
 *    [DefaultValue]
 * ]
 * ```
 *
 * **For example**
 *
 * ```
 * [
 *   // 超过 1000 像素时，三列
 *   [3, "[1000,)"],
 *   // 超过 600 像素时，两列
 *   [2, "[600,)"],
 *   // 默认，一列
 *   [1],
 * ]
 * ```
 *
 * @return the matched arm value
 */
export function selectValue<C, V, M>(
  context: C,
  arms: SelectValueArm<V, M> = [],
  options: SelectValueOptions<V, C> = {}
): V | undefined {
  // Eval options
  let explain = options.explain ?? false;
  let _by: FuncA2<[V, any], C, V | undefined>;
  if (options.by) {
    _by = options.by;
  }
  // 否则
  else {
    _by = function (arm, context) {
      let [v, m] = arm;
      if (!m || Match.test(m, context)) {
        return v;
      }
    };
  }

  // Walk Arm
  if (_.isArray(arms)) {
    // 指定了自定义的匹配方法
    if (options.by) {
      for (let arm of arms) {
        if (!_.isArray(arm)) {
          return arm;
        }
        let v = options.by(arm, context);
        if (!_.isUndefined(v)) {
          if (explain) {
            return Util.explainObj(context as Vars, v);
          }
          return v;
        }
      }
    }
    // 采用默认的配置形式 [[3, {...}],[5, {...}],7]
    else {
      let useArm = buildSelectArms(arms);
      return useArm(context);
    }
  }
  // Simple value
  else {
    if (explain) {
      return Util.explainObj(context as Vars, arms);
    }
    return arms;
  }
}

type rt_select_arm<V> = {
  match?: TiMatch;
  value: V;
};

export function buildSelectArms<C, V, M>(arms: SelectValueArm<V, M>) {
  let _arms: rt_select_arm<V>[] = [];
  if (_.isArray(arms)) {
    for (let arm of arms) {
      if (_.isArray(arm)) {
        let [v, m] = arm;
        _arms.push({
          match: Match.parse(m, true),
          value: v,
        });
      }
      // 单独的值
      else {
        _arms.push({
          value: arm,
        });
      }
    }
  }
  // 就是一个值
  else {
    _arms.push({
      value: arms,
    });
  }

  // 返回匹配函数
  return (context: C) => {
    for (let _a of _arms) {
      if (_a.match) {
        if (_a.match.test(context)) {
          return _a.value;
        }
      } else {
        return _a.value;
      }
    }
  };
}
