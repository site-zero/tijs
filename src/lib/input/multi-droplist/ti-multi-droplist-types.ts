import { CommonProps } from '../../../_type';
import { InputBoxProps } from '../all-input';

export type MulTiMultiDroplistProps = CommonProps &
  Omit<InputBoxProps, 'canInput' | 'trimed' | 'mustInOptions'>;
