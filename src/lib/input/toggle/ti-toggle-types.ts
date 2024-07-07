import { BooleanProps, ReadonlyProps } from '../../';
import { CommonProps } from '../../../_type';

export type ToggleProps = CommonProps &
  BooleanProps &
  ReadonlyProps & {
    texts?: string[];
  };
