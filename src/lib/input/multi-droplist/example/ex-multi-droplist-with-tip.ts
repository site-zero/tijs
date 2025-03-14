import { ComPropExample } from '../../../../_type';
import { MultiMultiDroplistProps } from '../ti-multi-droplist-types';

export default {
  name: 'with_tip',
  text: 'i18n:ti-multi-droplist-example-with-tip',
  comConf: {
    value: 'otter',
    placeholder: 'Choose one Animal',
    prefixIconFor: 'clear',
    options: [
      {
        value: 'hippo',
        text: 'Hippo',
        icon: 'fas-hippo',
        tip: 'Hipo like water',
      },
      {
        value: 'cow',
        text: 'Cow',
        icon: 'fas-cow',
        tip: 'Cow is a domestic animal',
      },
      {
        value: 'spider',
        text: 'Spider',
        icon: 'fas-spider',
        tip: 'Spider has eight legs',
      },
      {
        value: 'frog',
        text: 'Frog',
        icon: 'fas-frog',
        tip: 'Frog can jump high',
      },
      {
        value: 'bugs',
        text: 'Bugs',
        icon: 'fas-bugs',
        tip: 'Bugs are small insects',
      },
      {
        value: 'otter',
        text: 'Otter',
        icon: 'fas-otter',
        tip: 'Otters live in water',
      },
      {
        value: 'feather',
        text: 'Feather',
        icon: 'fas-feather',
        tip: 'Feathers are soft',
      },
      {
        value: 'fish',
        text: 'Fish',
        icon: 'fas-fish',
        tip: 'Fish live in water',
      },
      {
        value: 'dragon',
        text: 'Dragon',
        icon: 'fas-dragon',
        tip: 'Dragons are mythical creatures',
      },
      {
        value: 'locust',
        text: 'Locust',
        icon: 'fas-locust',
        tip: 'Locusts can destroy crops',
      },
      {
        value: 'dove',
        text: 'Dove',
        icon: 'fas-dove',
        tip: 'Dove symbolizes peace',
      },
      {
        value: 'crow',
        text: 'Crow',
        icon: 'fas-crow',
        tip: 'Crow is a bird',
      },
      {
        value: 'dog',
        text: 'Dog',
        icon: 'fas-dog',
        tip: 'Dog is a loyal animal',
      },
      {
        value: 'worm',
        text: 'Worm',
        icon: 'fas-worm',
        tip: 'Worms live in soil',
      },
      {
        value: 'shrimp',
        text: 'Shrimp',
        icon: 'fas-shrimp',
        tip: 'Shrimps live in water',
      },
      {
        value: 'mosquito',
        text: 'Mosquito',
        icon: 'fas-mosquito',
        tip: 'Mosquitoes can bite',
      },
      {
        value: 'horse',
        text: 'Horse',
        icon: 'fas-horse',
        tip: 'Horses are fast runners',
      },
      {
        value: 'cat',
        text: 'Cat',
        icon: 'fas-cat',
        tip: 'Cats are independent animals',
      },
    ],
  } as MultiMultiDroplistProps,
} as ComPropExample;
