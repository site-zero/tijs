import { ComPropExample } from '../../../../_type';
import { SwitcherProps } from '../ti-switcher-types';

export default {
  name: 'buttons',
  text: 'i18n:ti-switcher-example-buttons',
  comConf: {
    value: 'cow',
    multi: true,
    nowrap: false,
    itemSize: 'b',
    itemGap: 'b',
    itemRadius: 'b',
    options: [
      { value: 'info', text: 'Info', type: 'info' },
      { value: 'warn', text: 'Warn', type: 'warn' },
      { value: 'danger', text: 'Danger', type: 'danger' },
    ],
  } as SwitcherProps,
} as ComPropExample;
