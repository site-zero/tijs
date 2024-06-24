import { CommonProps } from '../../../_type';
import { InputBoxProps } from '../box/ti-input-types';

export type DropListProps = CommonProps &
  Omit<
    InputBoxProps,
    'canInput' | 'trimed' | 'mustInOptions' | 'checkValueWhenClose'
  >;
