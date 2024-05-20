import { FieldChangeProps, KeepProps } from '../..';
import {
  GridFieldsProps,
  GridFieldsStrictField,
  TabsAspect,
} from '../all-shelf';

export type FormTabProps = GridFieldsProps &
  Omit<FieldChangeProps<GridFieldsStrictField>, 'fields'> &
  TabsAspect &
  KeepProps & {};
