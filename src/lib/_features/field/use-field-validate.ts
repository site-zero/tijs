import _ from 'lodash';
import { Vars } from '../../../_type';
import {
  AbstractField,
  AyncFieldValidator,
  FieldValidation,
  FieldValidator,
  ValidateResult,
} from '../../../_type/lib-type-fields';
import { Match } from '../../../core';

export function buildFieldValidator(
  valueChecker?: FieldValidation | undefined
): AyncFieldValidator | undefined {
  if (!valueChecker) {
    return;
  }
  if (_.isRegExp(valueChecker) || _.isString(valueChecker)) {
    let am = Match.parse(valueChecker);
    return async (value: any) => {
      if (am.test(value)) {
        return { type: 'OK' };
      }
      return { type: 'VALUE_INVALID' };
    };
  }
  if (_.isFunction(valueChecker)) {
    return valueChecker as AyncFieldValidator;
  }
  if (_.isObject(valueChecker)) {
    let { test, not = false, message } = valueChecker;
    let am = Match.parse(valueChecker);
    return async (value: any) => {
      let ok = am.test(value);
      if (ok || (!ok && not)) {
        return { type: 'OK' };
      }
      return { type: 'VALUE_INVALID' };
    };
  }
}

export function buildFieldValidatorGroup(
  valueChecker?: FieldValidation | FieldValidation[] | undefined
): AyncFieldValidator | undefined {
  if (!valueChecker) {
    return;
  }

  let vali_list: (FieldValidator | AyncFieldValidator)[] = [];
  let inputs = _.concat([], valueChecker);
  for (let input of inputs) {
    let vali = buildFieldValidator(input);
    if (vali) {
      vali_list.push(vali);
    }
  }

  // 包括异步的验证
  return async (
    value: any,
    field: AbstractField,
    data: Vars
  ): Promise<ValidateResult | undefined> => {
    for (let vali of vali_list) {
      let re = await vali(value, field, data);
      if (re && re.type != 'OK') {
        return re;
      }
    }
    return { type: 'OK' };
  };
}
