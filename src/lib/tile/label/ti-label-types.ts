import { ValueBoxOptions, ValueBoxProps, ValueBoxState } from '../../';
import { CssTextAlign, LogicType } from '../../../_type';

export type LabelState = ValueBoxState<any>;
export type LabelProps = ValueBoxProps<any> & {
  type?: LogicType;
  textAlign?: CssTextAlign;
  clickable?: boolean;
  nowrap?: boolean;
  disable?: boolean;
};
export type LabelOptions = ValueBoxOptions;
