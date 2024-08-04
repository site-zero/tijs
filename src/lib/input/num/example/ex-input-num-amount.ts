import { ComPropExample } from '../../../../_type';
import { InputNumProps } from '../ti-input-num-types';

export default {
  name: 'amount',
  text: 'i18n:ti-input-num-example-amount',
  comConf: {
    value: '3167894.78',
    precision: 1,
    partSep: ',',
    partWidth: 3,
  } as InputNumProps,
} as ComPropExample;
