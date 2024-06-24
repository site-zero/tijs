import { ComPropExample } from '../../../../_type';
import { InputTextProps } from '../ti-input-text-types';

export default {
  name: 'list',
  text: 'i18n:ti-input-text-example-list',
  comConf: {
    valueType: 'list',
    height: '12em',
    value: ['cat', 'dog', 'bird', 'fish', 'tigger'],
  } as InputTextProps,
} as ComPropExample;
