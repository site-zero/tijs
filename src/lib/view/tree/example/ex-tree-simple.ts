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
    size: 's',
    isNodeOpen: 5,
    data: [
      { id: 0, text: "I am Root" },
      { id: 1, text: "I am Child 1", pid: 0 },
      { id: 2, text: "I am Child 2", pid: 0 },
      { id: 3, text: "I am Child 3", pid: 1 },
      { id: 4, text: "I am Child 4", pid: 2 },
      { id: 5, text: "I am Child 5", pid: 3 },
      { id: 6, text: "I am Child 6", pid: 4 },
      { id: 7, text: "I am Child 7", pid: 5 },
      { id: 8, text: "I am Child 8", pid: 6 },
      { id: 11, text: "I am Child 11", pid: 7 },
      { id: 111, text: "I am Child 111", pid: 11 },
      { id: 112, text: "I am Child 112", pid: 11 },
      { id: 113, text: "I am Child 113", pid: 11 },
      { id: 12, text: "I am Child 12", pid: 1 },


    ],
  } as TreeProps,
} as ComPropExample;
