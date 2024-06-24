import { ComPropExample } from '../../../../_type';
import { InputBoxProps } from '../ti-input-types';

export default {
  name: 'query',
  text: 'i18n:ti-input-example-query',
  comConf: {
    value: undefined,
    valueCase: 'upper',
    trimed: true,
    placeholder: 'Keyin for tips',
    prefixIconForClean: true,
    suffixIconForCopy: true,
    mustInOptions: false,
    tipShowTime: 'input',
    tipUseHint: true,
    options: "#hello100",
  } as InputBoxProps,
} as ComPropExample;
