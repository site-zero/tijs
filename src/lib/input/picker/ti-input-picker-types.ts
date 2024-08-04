import { InputBoxProps } from '../../';
import { AppModalProps } from '../../../_type';

export type InputPickerProps = InputBoxProps & {
  dialog?: AppModalProps;
};
