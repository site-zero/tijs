import { CommonProps } from '../../../core';
import { InputBoxProps } from '../box/ti-input-types';

export type DropListProps = CommonProps &
  Omit<InputBoxProps, 'canInput' | 'trimed' | 'mustInOptions'>;
