import { ComPropExample } from '../../../../_type';
import { MultiDroplistProps } from '../ti-multi-droplist-types';

export default {
  name: 'with_icon',
  text: 'i18n:ti-multi-droplist-example-with-icon',
  comConf: {
    value: 'otter',
    placeholder: 'Choose one Animal',
    readonly: true,
    options: [
      { value: 'hippo', text: 'Hippo', icon: 'fas-hippo' },
      { value: 'cow', text: 'Cow', icon: 'fas-cow' },
      { value: 'spider', text: 'Spider', icon: 'fas-spider' },
      { value: 'frog', text: 'Frog', icon: 'fas-frog' },
      { value: 'bugs', text: 'Bugs', icon: 'fas-bugs' },
      { value: 'otter', text: 'Otter', icon: 'fas-otter' },
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
  } as MultiDroplistProps,
} as ComPropExample;
