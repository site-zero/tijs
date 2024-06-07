import { ComPropExample } from '../../../../core';
import { InputBoxProps } from '../ti-input-types';

export default {
  name: 'options',
  text: 'i18n:ti-input-example-options',
  comConf: {
    value: 'A',
    valueCase: 'upper',
    trimed: true,
    placeholder: 'Choose one options',
    //prefixIconForClean: true,
    suffixIconForCopy: true,
    mustInOptions: true,
    options: {
      data: [
        { value: 'A', text: '甲' },
        { value: 'B', text: '乙' },
        { value: 'C', text: '丙' },
      ],
    },
  } as InputBoxProps,
} as ComPropExample;
