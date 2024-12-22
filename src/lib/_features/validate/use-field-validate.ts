import _ from 'lodash';
import { Vars } from '../../../_type';
import {
  AbstractField,
  AyncFieldValidator,
  FieldValidation,
  ValidateResult,
} from '../../../_type/lib-type-fields';
import { Dicts, Match } from '../../../core';

const BUILT_IN_VALIDATIONS = new Map<string, FieldValidation>();

export function addGlobalValidation(name: string, validation: FieldValidation) {
  if (BUILT_IN_VALIDATIONS.has(name)) {
    console.warn(`Validation ${name} already exists, will be overwritten.`);
  }
  BUILT_IN_VALIDATIONS.set(name, validation);
}

export function getGlobalValidation(name: string) {
  return BUILT_IN_VALIDATIONS.get(name);
}

export function removeGlobalValidation(name: string) {
  BUILT_IN_VALIDATIONS.delete(name);
}

/**
 * 构建字段验证器函数。
 *
 * @param validation - 字段验证规则，可以是正则表达式、字符串、函数或对象。
 * @returns 异步字段验证器函数或 undefined。
 *
 */
export function buildFieldValidator(
  validation?: FieldValidation | undefined
): AyncFieldValidator | undefined {
  if (!validation) {
    return;
  }
  // 判断是否采用内置的验证规则
  if (_.isString(validation)) {
    // 如果采用 `#xxx` 的形式，则生成一个内置的字典验证
    if (validation.startsWith('#')) {
      let dictName = validation.slice(1);
      let $dict = Dicts.checkDict(dictName);
      return async (
        value: any,
        _field: AbstractField,
        _data: Vars
      ): Promise<ValidateResult | undefined> => {
        let it = await $dict.getItem(value);
        if (it) {
          return { type: 'OK' };
        }
        return {
          type: 'VALUE_INVALID',
          message: `Value ${value} out of defination`,
        };
      };
    }
    // 如果采用 `@xxx` 的形式，则从内置验证规则中获取 `xxx` 对应的验证规则
    if (validation.startsWith('@')) {
      let name = validation.slice(1);
      let vali = getGlobalValidation(name);
      if (vali) {
        validation = vali;
      }
    }
  }

  // 如果验证规则是正则表达式或字符串，则转换为验证函数
  if (_.isRegExp(validation) || _.isString(validation)) {
    let am = Match.parse(validation);
    return async (value: any) => {
      if (am.test(value)) {
        return { type: 'OK' };
      }
      return { type: 'VALUE_INVALID' };
    };
  }

  // 如果验证规则是函数，则直接返回
  if (_.isFunction(validation)) {
    return validation as AyncFieldValidator;
  }

  // 如果验证规则是对象，则解析为验证函数
  if (_.isObject(validation)) {
    let { test, not = false, message } = validation;
    let am = Match.parse(test);
    return async (value: any): Promise<ValidateResult | undefined> => {
      let ok = am.test(value);
      if (not) {
        ok = !ok;
      }
      if (ok) {
        return { type: 'OK' };
      }
      return { type: 'VALUE_INVALID', message };
    };
  }
}

/**
 * 构建字段验证器组
 *
 * @param validations - 字段验证器或验证器数组
 * @returns 异步字段验证器或未定义
 *
 * 该函数接受一个字段验证器或验证器数组，并返回一个异步字段验证器函数。
 * 如果没有提供验证器，则返回 undefined。
 *
 * 异步字段验证器函数会依次执行所有验证器，并在遇到第一个验证失败的验证器时返回其结果。
 * 如果所有验证器都通过，则返回类型为 'OK' 的验证结果。
 */
export function buildFieldValidatorGroup(
  validations?: FieldValidation | FieldValidation[] | undefined
): AyncFieldValidator | undefined {
  if (!validations) {
    return;
  }

  let vali_list: AyncFieldValidator[] = [];
  let inputs = _.concat([], validations);
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
