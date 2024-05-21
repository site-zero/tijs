import { ComPropExample } from '../../../../core';
import { InputBoxProps } from '../ti-input-types';

export default {
  name: 'query',
  text: 'i18n:ti-input-example-query',
  comConf: {
    value: 'A',
    valueCase: 'upper',
    trimed: true,
    placeholder: 'Choose one options',
    prefixIconForClean: true,
    suffixIconForCopy: true,
    mustInOptions: true,
    tipShowTime: 'input',
    tipUseHint: true,
    options: "#hello",
  } as InputBoxProps,
} as ComPropExample;
