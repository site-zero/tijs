import { ComPropExample } from '../../../../_type';
import { InputCodeProps } from '../ti-input-code-types';

export default {
  name: 'simple',
  text: 'i18n:simple',
  comConf: {
    placeholder: 'Choose WT',
    options: '#WeightUnits',
    value: 'KG',
  } as InputCodeProps,
} as ComPropExample;
