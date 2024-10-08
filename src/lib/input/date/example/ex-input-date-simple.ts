import { ComPropExample } from '../../../../_type';
import { InputDatetimeProps } from '../../datetime/ti-input-datetime-types';

export default {
  name: 'simple',
  text: 'i18n:simple',
  comConf: {
    value: '2024-05-25',
    format: 'd MMM yyyy: E',
  } as InputDatetimeProps,
} as ComPropExample;
