import { ReadonlyProps } from '../../';
import { CommonProps } from '../../../_type';

export type InputCurrencyProps = CommonProps & ReadonlyProps & {
  value?: number|string
};

