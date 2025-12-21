import { ComPropExample } from '../../../../_type';
import { InputDatetimeProps } from '../../datetime/ti-input-datetime-types';

export default {
  name: 'quickinput',
  text: 'i18n:ti-input-datetime-example-quickinput',
  comConf: {
    value: '2024-05-1 19:24:38',
    format: 'd MMM yyyy - EEEE HH:mm:ss',
    quickInputMode: 'dmy',
    width: '400px',
  } as InputDatetimeProps,
} as ComPropExample;
