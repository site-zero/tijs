import { InputBoxProps } from '../../';
import { AspectSize, Vars } from '../../../_type';

export type InputCodeProps = InputBoxProps & {
  codeWidth?: string | number;
  gap?: AspectSize;
  style?: Vars;
};
