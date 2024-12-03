import { ComPropExample } from '../../../../_type';

export default {
  name: 'formated',
  text: 'i18n:ti-input-example-formated',
  comConf: {
    //className: "",
    format: '【${val}】',
    value: 'HELLO',
    valueCase: 'upper',
    trimed: true,
    placeholder: 'Choose one options',
    prefixIconForClean: true,
    suffixIconForCopy: true,
  },
} as ComPropExample;
