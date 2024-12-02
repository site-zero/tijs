import { ComPropExample } from '../../../../_type';
import { InputBox2Props } from '../ti-input-box2-types';

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
    tipShowTime: 'auto',
    tipUseHint: true,
    options: "#hello100",
    lookup: ['*~text'],
  } as InputBox2Props,
} as ComPropExample;
