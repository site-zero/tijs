import { CommonProps } from '../../../_type';
import { InputBoxProps } from '../box/ti-input-types';

export type DroplistProps = CommonProps &
  Omit<
    InputBoxProps,
    'canInput' | 'trimed' | 'mustInOptions' | 'checkValueWhenClose'
  >;
