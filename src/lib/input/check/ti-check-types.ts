import { BooleanProps, ReadonlyProps } from '../../';
import { CommonProps, IconInput } from '../../../_type';

export type CheckProps = CommonProps &
  BooleanProps &
  ReadonlyProps & {
    text?: string;
    // [falseIcon, trueIcon]
    icons?: [IconInput, IconInput];
  };
