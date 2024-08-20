import { ComPropExample } from '../../../../_type';
import { DroplistProps } from '../ti-droplist-types';

export default {
  name: 'simple',
  text: 'i18n:simple',
  comConf: {
    value: 'otter',
    placeholder: 'Choose one Animal',
    prefixIconForClean: true,
    options: [
      { value: 'hippo', text: 'Hippo' },
      { value: 'cow', text: 'Cow' },
      { value: 'spider', text: 'Spider' },
      { value: 'frog', text: 'Frog' },
      { value: 'bugs', text: 'Bugs' },
      { value: 'otter', text: 'Otter' },
      { value: 'feather', text: 'Feather' },
      { value: 'fish', text: 'Fish' },
      { value: 'dragon', text: 'Dragon' },
      { value: 'locust', text: 'Locust' },
      { value: 'dove', text: 'Dove' },
      { value: 'crow', text: 'Crow' },
      { value: 'dog', text: 'Dog' },
      { value: 'worm', text: 'Worm' },
      { value: 'shrimp', text: 'Shrimp' },
      { value: 'mosquito', text: 'Mosquito' },
      { value: 'horse', text: 'Horse' },
      { value: 'cat', text: 'Cat' },
    ],
  } as DroplistProps,
} as ComPropExample;
