import { CssTextAlign } from '../../../core';
import { ValueBoxOptions, ValueBoxProps, ValueBoxState } from '../../';

export type LabelState = ValueBoxState<any>;
export type LabelProps = ValueBoxProps<any> & {
  textAlign?: CssTextAlign;
  clickable?: boolean;
};
export type LabelOptions = ValueBoxOptions;
