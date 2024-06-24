import { ComPropExample } from '../../../../_type';
import { InputTextProps } from '../ti-input-text-types';

export default {
  name: 'readonly',
  text: 'i18n:ti-input-text-example-readonly',
  comConf: {
    value: 'hello',
    readonly: true,
    height: '18em',
  } as InputTextProps,
} as ComPropExample;
