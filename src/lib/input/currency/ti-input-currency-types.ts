import { ReadonlyProps } from '../../';
import { CommonProps } from '../../../core';

export type InputCurrencyProps = CommonProps & ReadonlyProps & {
  value?: number|string
};

