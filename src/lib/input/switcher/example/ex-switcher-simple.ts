import { ComPropExample } from '../../../../core';
import { SwitcherProps } from '../ti-switcher-types';

export default {
  name: 'simple',
  text: 'i18n:simple',
  comConf: {
    value: 'cow',
    multi: false,
    nowrap: false,
    itemSize: 'm',
    itemGap: 's',
    itemRadius: 's',
    defaultItemType: 'info',
    options: [
      { value: 'cow', text: 'Cow', icon: 'fas-cow' },
      { value: 'crow', text: 'Crow', icon: 'fas-crow' },
      { value: 'dog', text: 'Dog', icon: 'fas-dog' },
      { value: 'cat', text: 'Cat', icon: 'fas-cat' },
    ],
  } as SwitcherProps,
} as ComPropExample;
