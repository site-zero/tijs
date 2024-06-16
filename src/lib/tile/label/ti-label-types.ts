import { ValueBoxOptions, ValueBoxProps, ValueBoxState } from '../../';
import { CssTextAlign, LogicType } from '../../../core';

export type LabelState = ValueBoxState<any>;
export type LabelProps = ValueBoxProps<any> & {
  type?: LogicType;
  textAlign?: CssTextAlign;
  clickable?: boolean;
};
export type LabelOptions = ValueBoxOptions;
