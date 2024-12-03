import { CommonProps } from '../../../_type';
import { InputBox2Props } from '../all-input';

export type DroplistProps = CommonProps &
  Omit<InputBox2Props, 'canInput' | 'trimed' | 'mustInOptions'>;
