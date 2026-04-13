import { CommonProps } from '../../../_type';
import { InputBoxEmitter, InputBoxProps } from '../all-input';

export type DroplistEmitter = InputBoxEmitter;

export type DroplistProps = CommonProps &
  Omit<InputBoxProps, 'canInput' | 'trimed' | 'mustInOptions'>;
