import _ from 'lodash';
import { buildFieldValidatorGroup, useVisibility } from '../..';
import { makeFieldUniqKey, Vars } from '../../../_type';
import { Match, Str } from '../../../core';
import { TiObjFieldsFeature } from '../field/use-obj-fields';
import {
  DataValidatableField,
  ValidatableField,
  ValidatableFieldRefer,
} from './data-validate-types';

export function _build_validatable_field(
  fieldSet: TiObjFieldsFeature,
  fld_ref: ValidatableFieldRefer
): DataValidatableField {
  // 归一化输入字段
  let field = _get_field(fieldSet, fld_ref);

  let uniqKey = makeFieldUniqKey([], field.name, field.uniqKey);

  // 可见性
  let visiblity = useVisibility(field, uniqKey);
  if (field.readonly) {
    visiblity.isDisabled = () => true;
  }

  // 必选字段
  let isRequired: undefined | ((data: Vars) => boolean) = undefined;
  if (field.required) {
    if (_.isBoolean(field.required)) {
      isRequired = () => true;
    }
    // 复杂判断
    else {
      let _is_required = Match.parse(field.required, false);
      isRequired = (data: Vars) => {
        return _is_required.test(data);
      };
    }
  }

  // 逐个编制字段详情
  return {
    uniqKey,
    title: field.title,
    name: field.name,
    type: field.type,
    validate: buildFieldValidatorGroup(field.validation),
    srcValidation: field.validation,
    ...visiblity,
    readonly: field.readonly,
    isRequired,
  };
}

function _get_field(
  fieldSet: TiObjFieldsFeature,
  fld: ValidatableFieldRefer
): ValidatableField {
  // 简单键
  if (_.isString(fld)) {
    let f0 = fieldSet.getField(fld);
    return _to_validatable_field(f0, `${fld}`);
  }
  // 带定制
  if (_.isArray(fld)) {
    let [key, info] = fld;
    let f0 = fieldSet.getField(key);
    let f1 = _to_validatable_field(f0);
    // 完全定制
    if (_.isFunction(info)) {
      return info(f1) ?? f1;
    }
    // 仅仅覆盖固定属性
    return _.assign(f1, info);
  }
  // 完整自定义
  return { ...fld };
}

function _to_validatable_field(re: any, dft_title?: string): ValidatableField {
  return {
    title: re.title ?? dft_title ?? Str.anyToStr(re.name),
    name: re.name,
    type: re.type,
    validation: re.validation,
    required: re.required,
    readonly: re.readonly,
    visible: re.visible,
    hidden: re.hidden,
    disabled: re.disabled,
    enabled: re.enabled,
  };
}
