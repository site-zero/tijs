import { ComPropExample } from '../../../../core';
import { InputDatetimeProps } from '../ti-input-datetime-types';

export default {
  name: 'simple',
  text: 'i18n:simple',
  comConf: {
    value: '2024-05-25 18:30:13',
    valueFormat: '2024-05-25 18:30',
    format: 'd-Mmm-yyyy HH:mm'
  } as InputDatetimeProps,
} as ComPropExample;
