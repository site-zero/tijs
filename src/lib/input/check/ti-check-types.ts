import { BooleanProps, ReadonlyProps } from '../../_features';
import { IconInput } from '../../../core';

export type CheckProps = BooleanProps &
  ReadonlyProps & {
    text?: string;
    // [falseIcon, trueIcon]
    icons?: [IconInput, IconInput];
  };
