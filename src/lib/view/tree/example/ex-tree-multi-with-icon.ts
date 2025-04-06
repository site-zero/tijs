import { ComPropExample } from '../../../../_type';
import { TreeProps } from '../ti-tree-types';

export default {
  name: 'multi_with_icon',
  text: 'i18n:ti-tree-example-multi-with-icon',
  comConf: {
    className: 'fit-parent',
    size: 's',
    multi: true,
    canCheck: true,
    canCheckItem: {
      pid: "![BLANK]"
    },
    checkedIds: { 12: true },
    borderStyle: 'dotted',
    isNodeOpen: 5,
    getRowIcon: [
      ['fas-folder-open', {
        rowStatus: 'open',
        rowIndent: 0
      }],
      ['fas-folder', {
        rowStatus: 'closed',
        rowIndent: 0,
        rowIcon: "[BLANK]"
      }]
    ],
    data: [
      { id: 1, text: 'Mammal', icon: 'fas-cake' },
      { id: 11, text: 'DOG', icon: 'fas-dog', pid: 1 },
      { id: 12, text: 'CAT', icon: 'fas-cat', pid: 1 },
      { id: 13, text: 'HIPPO', icon: "fas-hippo", pid: 1 },
      { id: 2, text: 'Amphibian', },
      { id: 21, text: 'FROG', icon: "fas-frog", pid: 2 },
      { id: 22, text: 'LIZARD', icon: "fas-dragon", pid: 2 },
      { id: 3, text: 'Birds', },
      { id: 31, text: 'CROW', icon: 'fas-crow', pid: 3 },
      { id: 32, text: 'DOVE', icon: 'fas-dove', pid: 3 },
    ],
  } as TreeProps,
} as ComPropExample;
