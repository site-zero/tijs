import { ComPropExample } from '../../../../core';
import { ListProps } from '../ti-list-types';
import { Chance } from 'chance';

// 创建一个 Chance 实例
const cha = new Chance();

export default {
  name: 'with_tip',
  text: 'i18n:ti-list-example-with-tip',
  comConf: {
    className: 'tip-block',
    size: 'm',
    data: [
      { value: 1, text: 'This is a DOG', icon: 'fas-dog', tip: cha.sentence() },
      { value: 2, text: 'This is a CAT', icon: 'fas-cat' },
      {
        value: 3,
        text: 'This is a HIPPO',
        icon: 'fas-hippo',
        tip: cha.sentence(),
      },
      { value: 4, text: 'This is a FROG', icon: 'fas-frog' },
      { value: 5, text: 'This is a LIZARD' },
      { value: 6, text: 'This is a FISH', icon: 'fas-fish' },
    ],
  } as ListProps,
} as ComPropExample;
