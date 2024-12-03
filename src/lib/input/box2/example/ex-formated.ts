import { ComPropExample } from '../../../../_type';
import { InputBoxProps } from '../ti-input-box2-types';

export default {
  name: 'formated',
  text: 'i18n:ti-input-example-formated',
  comConf: {
    //className: "",
    value: 'HELLO',
    valueCase: 'upperAll',
    trimed: true,
    placeholder: 'Choose one options',
    prefixIconFor: 'clear',
    suffixIconFor: 'copy',
  } as InputBoxProps,
} as ComPropExample;
