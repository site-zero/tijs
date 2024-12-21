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
  };
