import { ComPropExample } from '../../../../_type';
import { InputNumProps } from '../ti-input-num-types';

export default {
  name: 'partly',
  text: 'i18n:ti-input-num-example-partly',
  comConf: {
    value: '4008 - 9934 - 5792 - 865',
    precision: 1,
    partTo: 'right',
    partSep: ' - ',
    partWidth: 4,
  } as InputNumProps,
} as ComPropExample;
