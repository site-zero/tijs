import { InputBoxProps } from '../../';
import { AspectSize, Vars } from '../../../_type';
import { Dicts } from '../../../core';

export type InputCodeProps = InputBoxProps & {
  codeWidth?: string | number;
  gap?: AspectSize;
  style?: Vars;
  getDescription?: string | ((item: Dicts.DictItem<any>) => string);
};
