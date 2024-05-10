import { ComPropExample } from '../../../../core';
import { ListProps } from '../ti-list-types';
import { Chance } from 'chance';

// 创建一个 Chance 实例
const cha = new Chance();

export default {
  name: 'simple',
  text: 'i18n:simple',
  comConf: {
    className: 'border-solid',
    size: 'b',
    data: [
      { value: 1, text: 'This is a DOG' },
      { value: 2, text: 'This is a CAT' },
      { value: 3, text: 'This is a HIPPO' },
      { value: 4, text: 'This is a FROG' },
      { value: 5, text: 'This is a LIZARD' },
      { value: 6, text: 'This is a FISH' },
    ],
  } as ListProps,
} as ComPropExample;
