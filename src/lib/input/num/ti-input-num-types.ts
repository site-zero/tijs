import { PlaceholderFeatureProps, ReadonlyProps } from '../../';
import { CommonProps } from '../../../core';

export type InputNumProps = CommonProps &
  PlaceholderFeatureProps &
  ReadonlyProps & {
    value?: number | string | boolean | null;
  };
