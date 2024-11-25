import { OptionsProps, ReadonlyProps } from '../../';
import { CommonProps, Vars } from '../../../_type';

export type InputCurrencyProps = CommonProps &
  ReadonlyProps & {
    value?: Vars;
    valueKeys?: [string, string];

    currencies: OptionsProps;
    precision?: number | undefined;
    decimalPlaces?: number;

    autoSelect?: boolean;

    numAsStr?: boolean;
    defaultCurrency?: string;

    currencyWidth?: number | string;

    tipListMinWidth?: number | string;
  };
