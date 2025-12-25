import { ComPropExample } from '../../../../_type';
import { InputBoxProps } from '../ti-input-box-types';

export default {
  name: 'query',
  text: 'i18n:ti-input-example-query',
  comConf: {
    value: undefined,
    valueCase: 'upperAll',
    trimed: true,
    placeholder: 'Keyin for tips',
    prefixIconForClean: true,
    suffixIconForCopy: true,
    mustInOptions: false,
    tipShowTime: 'auto',
    tipUseHint: true,
    options: "#hello100",
    lookup: ['*~text'],
  } as InputBoxProps,
} as ComPropExample;
