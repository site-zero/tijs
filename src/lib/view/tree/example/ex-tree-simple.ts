import { Chance } from 'chance';
import { ComPropExample } from '../../../../_type';
import { TreeProps } from '../ti-tree-types';

// 创建一个 Chance 实例
const cha = new Chance();

export default {
  name: 'simple',
  text: 'i18n:simple',
  comConf: {
    className: 'border-solid fit-parent',
    size: 'b',
    data: [
      { id: 0, text: "I am Root" },
      { id: 1, text: "I am Child 1", pid: 0 },
      { id: 2, text: "I am Child 2", pid: 0 },
      { id: 3, text: "I am Child 1", pid: 1 },
      { id: 4, text: "I am Child 2", pid: 2 },
    ],
  } as TreeProps,
} as ComPropExample;
