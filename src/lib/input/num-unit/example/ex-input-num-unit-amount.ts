import { ComPropExample } from '../../../../_type';
import { InputNumUnitProps } from '../ti-input-num-unit-types';

export default {
  name: 'amount',
  text: 'i18n:ti-input-num-unit-example-amount',
  comConf: {
    value: {
      number: 500.32,
      unit: 'CNY',
    },
    precise: 100,
    units: {
      options: '#Currencies',
    },
  } as InputNumUnitProps,
} as ComPropExample;
