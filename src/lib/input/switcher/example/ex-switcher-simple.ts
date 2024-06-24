import { ComPropExample } from '../../../../_type';
import { SwitcherProps } from '../ti-switcher-types';

export default {
  name: 'simple',
  text: 'i18n:simple',
  comConf: {
    value: 'cow',
    multi: false,
    nowrap: false,
    itemSize: 'b',
    itemGap: 't',
    itemRadius: 't',
    defaultItemType: 'info',
    options: [
      { value: 'cow', text: 'Cow', icon: 'fas-cow' },
      { value: 'crow', text: 'Crow', icon: 'fas-crow' },
      { value: 'dog', text: 'Dog', icon: 'fas-dog' },
      { value: 'cat', text: 'Cat', icon: 'fas-cat' },
    ],
  } as SwitcherProps,
} as ComPropExample;
