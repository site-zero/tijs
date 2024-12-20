import {
  AbstractField,
  FieldValidation,
  VisibilityProps,
} from '../../../_type';
import { ReadonlyProps } from '../use-readonly';

export type ValidatableField = Partial<
  Omit<AbstractField, 'required' | 'validate'>
> &
  VisibilityProps &
  ReadonlyProps & {
    title: string;
    required?: any;
    validation?: FieldValidation | FieldValidation[];
  };

export type DataValidationProps = {
  fields?: FieldRefer[];
};

export type DataValidation = ReturnType<typeof useDataValidate>;

export function useDataValidate(props: DataValidationProps) {}
