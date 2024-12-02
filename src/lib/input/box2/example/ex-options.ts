import { ComPropExample } from '../../../../_type';
import { InputBox2Props } from '../ti-input-box2-types';

export default {
  name: 'options',
  text: 'i18n:ti-input-example-options',
  comConf: {
    value: 'A',
    valueCase: 'upperAll',
    trimed: true,
    placeholder: 'Choose one options',

    prefixIconForClean: true,
    suffixIconForCopy: true,
    mustInOptions: true,
    options: [
      { value: 'A', text: '甲' },
      { value: 'B', text: '乙' },
      { value: 'C', text: '丙' },
    ],
  } as InputBox2Props,
} as ComPropExample;
