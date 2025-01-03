import { OptionsProps, ReadonlyProps } from '../../';
import { AspectSize, CommonProps, LogicType, Vars } from '../../../_type';

export type InputCurrencyProps = CommonProps &
  ReadonlyProps & {
    value?: Vars;
    valueKeys?: [string, string];

    currencies: OptionsProps;
    precision?: number | undefined;
    decimalPlaces?: number;

    autoSelect?: boolean;

    numAsStr?: boolean;
    defaultCurrency?: string | null;

    currencyWidth?: number | string;

    tipListMinWidth?: number | string;

    /**
     * 隐藏输入框边框
     */
    hideBorder?: boolean;

    //style?: Vars;
    // inputStyle?: Vars;
    // partMainStyle?: Vars;
    // mainBodyStyle?: Vars;
    boxFontSize?: AspectSize;
    boxPadding?: AspectSize;
    boxRadius?: AspectSize | 'none';
    type?: LogicType;
  };
