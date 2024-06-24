import { ComPropExample } from '../../../../_type';
import { SwitcherProps } from '../ti-switcher-types';

export default {
  name: 'multi',
  text: 'i18n:ti-switcher-example-multi',
  comConf: {
    value: 'cow',
    multi: true,
    nowrap: false,
    itemSize: 'm',
    itemGap: 's',
    itemRadius: 'm',
    defaultItemType: 'info',
    options: [
      { value: 'hippo', text: 'Hippo', icon: 'fas-hippo' },
      { value: 'cow', text: 'Cow', icon: 'fas-cow' },
      { value: 'spider', text: 'Spider', icon: 'fas-spider' },
      { value: 'frog', text: 'Frog', icon: 'fas-frog' },
      { value: 'bugs', text: 'Bugs', icon: 'fas-bugs' },
      { value: 'otter', text: 'Otter', icon: 'fas-otter' },
      { value: 'feather', text: 'Feather', icon: 'fas-feather' },
      { value: 'fish', text: 'Fish', icon: 'fas-fish' },
      { value: 'dragon', text: 'Dragon', icon: 'fas-dragon' },
      { value: 'locust', text: 'Locust', icon: 'fas-locust' },
      { value: 'dove', text: 'Dove', icon: 'fas-dove' },
      { value: 'crow', text: 'Crow', icon: 'fas-crow' },
      { value: 'dog', text: 'Dog', icon: 'fas-dog' },
      { value: 'worm', text: 'Worm', icon: 'fas-worm' },
      { value: 'shrimp', text: 'Shrimp', icon: 'fas-shrimp' },
      { value: 'mosquito', text: 'Mosquito', icon: 'fas-mosquito' },
      { value: 'horse', text: 'Horse', icon: 'fas-horse' },
      { value: 'cat', text: 'Cat', icon: 'fas-cat' },
    ],
  } as SwitcherProps,
} as ComPropExample;
