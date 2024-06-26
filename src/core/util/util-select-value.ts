import JSON5 from 'json5';
import _ from 'lodash';
import { Match, Util } from '../';
import { FuncA2, SelectValueArm, Vars } from '../../_type';

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
export function selectValue<C, T, M>(
  context: C,
  arms: SelectValueArm<T, M> = [],
  options: SelectValueOptions<T, C> = {}
): T | undefined {
  // Eval options
  let explain = options.explain ?? false;
  let by =
    options.by ||
    function (arm, context) {
      let [v, m] = arm;
      if (!m || Match.test(m, context)) {
        return v;
      }
    };

  // Walk Arm
  if (_.isArray(arms)) {
    for (let arm of arms) {
      if (!_.isArray(arm)) {
        return arm;
      }
      let v = by(arm, context);
      if (!_.isUndefined(v)) {
        if (explain) {
          return Util.explainObj(context as Vars, v);
        }
        return v;
      }
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
