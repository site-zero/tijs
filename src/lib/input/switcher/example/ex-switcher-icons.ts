import { ComPropExample } from '../../../../core';
import { SwitcherProps } from '../ti-switcher-types';

export default {
  name: 'icons',
  text: 'i18n:ti-switcher-example-icons',
  comConf: {
    value: 'cow',
    multi: true,
    nowrap: false,
    itemSize: 'b',
    itemGap: 't',
    itemRadius: 'none',
    defaultItemType: 'text',
    options: [
      { value: 'hippo', icon: 'fas-hippo' },
      { value: 'spider', icon: 'fas-spider' },
      { value: 'frog', icon: 'fas-frog' },
      { value: 'bugs', icon: 'fas-bugs' },
      { value: 'otter', icon: 'fas-otter' },
      { value: 'feather', icon: 'fas-feather' },
      { value: 'dragon', icon: 'fas-dragon' },
      { value: 'locust', icon: 'fas-locust' },
      { value: 'dove', icon: 'fas-dove' },
      { value: 'shrimp', icon: 'fas-shrimp' },
      { value: 'mosquito', icon: 'fas-mosquito' },
    ],
  } as SwitcherProps,
} as ComPropExample;
