import { IconInput } from '../../../_type';
import { BooleanProps, ReadonlyProps } from '../../_features';

export type CheckProps = BooleanProps &
  ReadonlyProps & {
    text?: string;
    // [falseIcon, trueIcon]
    icons?: [IconInput, IconInput];
  };
