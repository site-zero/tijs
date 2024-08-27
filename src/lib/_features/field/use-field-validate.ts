import _ from 'lodash';
import {
  FieldValidateInput,
  FieldValidator,
} from '../../../_type/lib-type-fields';
import { Match } from '../../../core';

export function buildFieldValidate(
  valueChecker?: FieldValidateInput | undefined
): FieldValidator | undefined {
  if (!valueChecker) {
    return;
  }
  if (_.isRegExp(valueChecker) || _.isString(valueChecker)) {
    let am = Match.parse(valueChecker);
    return (value: any) => {
      if (am.test(value)) {
        return { type: 'OK' };
      }
      return { type: 'VALUE_INVALID' };
    };
  }
  if (_.isFunction(valueChecker)) {
    return valueChecker;
  }
  if (_.isObject(valueChecker)) {
    let { test, not = false, message } = valueChecker;
    let am = Match.parse(valueChecker);
    return (value: any) => {
      let ok = am.test(value);
      if (ok || (!ok && not)) {
        return { type: 'OK' };
      }
      return { type: 'VALUE_INVALID' };
    };
  }
}
