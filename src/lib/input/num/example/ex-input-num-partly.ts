import { ComPropExample } from '../../../../core';
import { InputNumProps } from '../ti-input-num-types';

export default {
  name: 'partly',
  text: 'i18n:ti-input-num-example-partly',
  comConf: {
    value: 945789123,
    precision: 1,
    partSep: ' - ',
    partSize: 3
  } as InputNumProps,
} as ComPropExample;
