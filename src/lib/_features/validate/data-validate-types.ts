import { TextArm, VisibilityFeature } from '../..';
import {
  AbstractField,
  FieldName,
  FieldValidation,
  FieldValueType,
  VisibilityProps,
} from '../../../_type';
import { ReadonlyProps } from '../use-readonly';

export type DataValidationProps = {
  fields?: ValidatableFieldRefer[];
};

export type ValidatableField = VisibilityProps &
  ReadonlyProps & {
    uniqKey?: string;
    name: FieldName;
    type: FieldValueType;
    title: TextArm;
    required?: any;
    validation?: FieldValidation | FieldValidation[];
    minLen?: number;
    maxLen?: number;
  };

export type ValidatableFieldInfo = [
  string,
  Partial<ValidatableField> | ((field: ValidatableField) => ValidatableField)
];

export type ValidatableFieldRefer =
  | ValidatableField
  | ValidatableFieldInfo
  | string;

export type DataValidatableField = AbstractField &
  ReadonlyProps &
  VisibilityFeature & {
    title: TextArm;
    /**
     * 存储一下源校验配置，以便动态可以展示校验规则
     */
    srcValidation?: any;

    minLen?: number;
    maxLen?: number;
  };
