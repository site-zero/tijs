import { ComPropExample } from '../../../../_type';
import { TreeProps } from '../ti-tree-types';
import { Chance } from 'chance';
import { getListData } from './mock_data';

// 创建一个 Chance 实例
const cha = new Chance();

export default {
  name: 'with_tip',
  text: 'i18n:ti-tree-example-with-tip',
  comConf: {
    className: 'fit-parent',
    size: 'm',
    borderStyle: 'dotted',
    isNodeOpen: 5,
    data: [
      { id: 1, text: 'Mammal', tip: cha.sentence() },
      { id: 11, text: 'DOG', icon: 'fas-dog', pid: 1, tip: cha.animal() },
      { id: 12, text: 'CAT', icon: 'fas-cat', pid: 1, tip: cha.address() },
      { id: 13, text: 'HIPPO', icon: "fas-hippo", pid: 1, tip: cha.company() },
      { id: 2, text: 'Amphibian', tip: cha.sentence(), },
      { id: 21, text: 'FROG', icon: "fas-frog", pid: 2, tip: cha.sentence() },
      { id: 22, text: 'LIZARD', icon: "fas-dragon", pid: 2 },
      { id: 3, text: 'Birds', tip: cha.sentence(), },
      { id: 31, text: 'CROW', icon: 'fas-crow', pid: 3 },
      { id: 32, text: 'DOVE', icon: 'fas-dove', pid: 3, tip: cha.animal() },
    ]
  } as TreeProps,
} as ComPropExample;
