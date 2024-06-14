import { ComPropExample } from '../../../../core';
import { SorterProps } from '../ti-sorter-types';

export default {
  name: 'simple',
  text: 'i18n:simple',
  comConf: {
    value: {
      ct: 1,
      name: -1,
    },
    options: [
      { value: 'ct', text: 'Created Time' },
      { value: 'name', text: 'Name' },
    ],
  } as SorterProps,
} as ComPropExample;
