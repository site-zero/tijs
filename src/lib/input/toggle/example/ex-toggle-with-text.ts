import { ComPropExample } from '../../../../core';
import { ToggleProps } from '../ti-toggle-types';

export default {
  name: 'with-text',
  text: 'i18n:ti-toggle-example-with-text',
  comConf: {
    value: true,
    texts: ['i18n:no', 'i18n:yes'],
  } as ToggleProps,
} as ComPropExample;
