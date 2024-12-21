import _ from 'lodash';
import { FieldStatus, getFieldValue, Vars } from '../../../_type';
import { Util } from '../../../core';
import { useObjFields } from '../field/use-obj-fields';
import { _build_validatable_field } from './build-validation';
import {
  DataValidatableField,
  DataValidationProps,
} from './data-validate-types';

export type ValidateOptions = {
  /**
   * 如果一个字段是 required 的，那么它必然不能是 nil
   */
  checkRequired?: boolean;

  /**
   * 隐藏字段也要检查, 默认 false
   */
  checkHidden?: boolean;

  /**
   * 失效字段也要检查, 默认 false
   */
  checkDisabled?: boolean;
};

export type DataValidation = ReturnType<typeof useDataValidate>;

/**
 * 数据验证钩子函数。
 *
 * @param props - 数据验证属性。
 * @returns 包含字段列表、字段映射、验证变更和验证数据的对象。
 *
 * @remarks
 * 该钩子函数用于根据传入的字段属性进行数据验证。它提供了两个主要方法：
 * - `validateChange`：验证数据变更。
 * - `validateData`：验证整个数据对象。
 *
 * @example
 * ```typescript
 * const { validateChange, validateData } = useDataValidate({ fields: [...] });
 *
 * const status = await validateChange(delta, data, options);
 * const dataStatus = validateData(data, options);
 * ```
 *
 * @public
 */
export function useDataValidate(props: DataValidationProps) {
  const _fld_set = useObjFields();

  const _field_list: DataValidatableField[] = [];
  const _field_map = new Map<string, DataValidatableField>();
  if (props.fields) {
    for (let fld of props.fields) {
      let f = _build_validatable_field(_fld_set, fld);
      _field_list.push(f);
      _field_map.set(f.uniqKey, f);
    }
  }

  async function __validate_with_fld(
    status: Record<string, FieldStatus>,
    fld: DataValidatableField,
    key: string,
    val: any,
    data: Vars,
    options: ValidateOptions
  ) {
    if (!options.checkDisabled && fld.isDisabled(data)) {
      return;
    }

    if (!options.checkHidden && fld.isHidden(data)) {
      return;
    }

    if (_.isNil(val)) {
      if (!options.checkRequired) {
        return;
      }
      if (fld.isRequired && fld.isRequired(data)) {
        let title = Util.selectValue(data, fld.title);
        status[key] = {
          type: 'error',
          text: `Field '${title}' is required`,
        };
      }
      return;
    }

    if (fld.validate) {
      let re = await fld.validate(val, fld, data);
      if (re && re.type != 'OK') {
        let title = Util.selectValue(data, fld.title);
        status[key] = {
          type: 'error',
          text: [`Field '${title}' Invalid`, re.message].join(':'),
        };
      }
    }
  }

  /**
   * 验证数据变更。
   *
   * @param delta - 包含变更数据的对象。
   * @param data - 包含原始数据的对象。
   * @param options - 验证选项。
   * @returns 一个包含未通过验证的字段状态信息对象，如果没有任何错误
   * 返回对象则会为空
   */
  async function validateChange(
    delta: Vars,
    data: Vars,
    options: ValidateOptions = {}
  ): Promise<Record<string, FieldStatus> | undefined> {
    // 准备返回值
    let status: Record<string, FieldStatus> = {};

    // 循环改动的键
    for (let key of _.keys(delta)) {
      let fld = _field_map.get(key);

      if (!fld) {
        continue;
      }

      let val = delta[key];
      await __validate_with_fld(status, fld, key, val, data, options);
    }

    // 返回检查结果
    return _.isEmpty(status) ? undefined : status;
  }

  /**
   * 验证数据。
   *
   * @param data - 要验证的变量。
   * @param options - 验证选项，默认为空对象。
   * @returns 返回字段状态的记录，如果没有字段需要验证则返回 `undefined`。
   */
  async function validateData(
    data: Vars,
    options: ValidateOptions = {}
  ): Promise<Record<string, FieldStatus> | undefined> {
    let status: Record<string, FieldStatus> = {};

    for (let fld of _field_list) {
      let val = getFieldValue(fld.name, data);
      let key = fld.uniqKey;
      await __validate_with_fld(status, fld, key, val, data, options);
    }

    return status;
  }

  return {
    _field_list,
    _field_map,
    validateChange,
    validateData,
  };
}
