import _ from 'lodash';
import { Vars } from '../../../_type';
import {
  AbstractField,
  AyncFieldValidator,
  FieldValidation,
  FieldValidator,
  ValidateResult,
} from '../../../_type/lib-type-fields';
import { isAsyncFunc, Match } from '../../../core';

export function buildFieldValidator(
  valueChecker?: FieldValidation | undefined
): FieldValidator | AyncFieldValidator | undefined {
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

export function buildFieldValidatorGroup(
  valueChecker?: FieldValidation | FieldValidation[] | undefined
): FieldValidator | AyncFieldValidator | undefined {
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

  // 如果包含异步验证，那么就是返回一个异步包裹
  let hasAsyncValidation = false;
  for (let vali of vali_list) {
    if (isAsyncFunc(vali)) {
      hasAsyncValidation = true;
      break;
    }
  }

  // 包括异步的验证
  if (hasAsyncValidation) {
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

  // 只有同步验证
  return (
    value: any,
    field: AbstractField,
    data: Vars
  ): ValidateResult | undefined => {
    for (let vali of vali_list) {
      let sync_vali = vali as FieldValidator;
      let re = sync_vali(value, field, data);
      if (re && re.type != 'OK') {
        return re;
      }
    }
    return { type: 'OK' };
  };
}
