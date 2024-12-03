import { ComPropExample } from '../../../../_type';
import { InputBox2Props } from '../ti-input-box2-types';

export default {
  name: 'droplist',
  text: 'i18n:ti-input-example-droplist',
  comConf: {
    value: 'otter',
    trimed: false,
    placeholder: 'Choose one Animal',
    type:'primary',
    boxFontSize:'t',
    prefixIconFor: 'clear',
    suffixIconFor: 'load-options',
    mustInOptions: true,
    autoPrefixIcon: true,
    canInput: false,
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
  } as InputBox2Props,
} as ComPropExample;
