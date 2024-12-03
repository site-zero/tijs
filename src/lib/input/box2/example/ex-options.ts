import { ComPropExample } from '../../../../_type';
import { InputBoxProps } from '../ti-input-box2-types';

export default {
  name: 'options',
  text: 'i18n:ti-input-example-options',
  comConf: {
    value: 'A',
    valueCase: 'upperAll',
    trimed: true,
    placeholder: 'Choose one options',
    prefixIconFor: 'clear',
    suffixIconFor: 'load-options',
    mustInOptions: true,
    lookup: ['*~text'],
    options: [
      { value: 'A', text: '甲' },
      { value: 'B', text: '乙' },
      { value: 'C', text: '丙' },
    ],
  } as InputBoxProps,
} as ComPropExample;
