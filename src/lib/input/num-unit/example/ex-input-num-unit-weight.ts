import { ComPropExample } from '../../../../_type';
import { InputNumUnitProps } from '../ti-input-num-unit-types';

export default {
  name: 'weight',
  text: 'i18n:ti-input-num-unit-example-weight',
  comConf: {
    value: {
      number: '9.75',
      unit: 'KG',
    },
    precise: 100,
    units: {
      options: '#WeightUnits',
    },
  } as InputNumUnitProps,
} as ComPropExample;
