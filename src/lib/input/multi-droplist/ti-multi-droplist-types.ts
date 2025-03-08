import { CommonProps } from '../../../_type';
import { InputBoxProps } from '../all-input';

export type DroplistProps = CommonProps &
  Omit<InputBoxProps, 'canInput' | 'trimed' | 'mustInOptions'>;
