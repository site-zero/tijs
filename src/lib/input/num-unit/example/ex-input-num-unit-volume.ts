import { ComPropExample } from '../../../../_type';
import { InputNumUnitProps } from '../ti-input-num-unit-types';

export default {
  name: 'volume',
  text: 'i18n:ti-input-num-unit-example-volume',
  comConf: {
    value: {
      number: '78.382',
      unit: 'CU',
    },
    precise: 100,
    units: {
      options: '#VolumeUnits',
      useRawValue: false,
      tipList: {},
    },
  } as InputNumUnitProps,
} as ComPropExample;
