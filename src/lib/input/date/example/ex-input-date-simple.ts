import { ComPropExample } from '../../../../_type';
import { InputDatetimeProps } from '../../datetime/ti-input-datetime-types';

export default {
  name: 'simple',
  text: 'i18n:simple',
  comConf: {
    value: '2024-05-25',
    format: 'yyyy年M月d日',
  } as InputDatetimeProps,
} as ComPropExample;
