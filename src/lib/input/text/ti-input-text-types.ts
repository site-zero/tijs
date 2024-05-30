import { PlaceholderFeatureProps, ReadonlyProps } from '../../';
import { CommonProps, Vars } from '../../../core';

export type InputTextProps = CommonProps &
  ReadonlyProps &
  PlaceholderFeatureProps & {
    hideBorder?: boolean;
    trimed?: boolean;
    value?: any;
    valueType?: 'list' | 'text';
    style?: Vars;
    width?: number | string;
    height?: number | string;
  };
