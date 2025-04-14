import { ComPropExample } from '../../../../_type';
import { TreeProps } from '../ti-tree-types';
import { getListData } from './mock_data';

export default {
  name: 'multi_with_tip',
  text: 'i18n:ti-tree-example-multi-with-tip',
  comConf: {
    className: 'fit-parent',
    size: 's',
    multi: true,
    showChecker: true,
    // canSelectItem: {
    //   pid: '![BLANK]',
    // },
    canCheckItem: {
      pid: '![BLANK]',
    },
    checkedIds: { 12: true },
    borderStyle: 'dotted',
    isNodeOpen: 5,
    getRowIcon: [
      [
        'fas-folder-open',
        {
          rowStatus: 'open',
          rowIndent: 0,
        },
      ],
      [
        'fas-folder',
        {
          rowStatus: 'closed',
          rowIndent: 0,
          rowIcon: '[BLANK]',
        },
      ],
    ],
    data: [
      {
        id: 1,
        text: 'Mammal',
        icon: 'fas-cake',
        tip: 'Mammals love nature'
      },
      {
        id: 11,
        text: 'DOG',
        icon: 'fas-dog',
        pid: 1,
        tip: 'Dog is very loyal'
      },
      {
        id: 12,
        text: 'CAT',
        icon: 'fas-cat',
        pid: 1,
        tip: 'Cat enjoys calm moments'
      },
      {
        id: 13,
        text: 'HIPPO',
        icon: 'fas-hippo',
        pid: 1,
        tip: 'Hippo is unexpectedly gentle'
      },
      {
        id: 2,
        text: 'Amphibian',
        tip: 'Amphibians adapt quickly'
      },
      {
        id: 21,
        text: 'FROG',
        icon: 'fas-frog',
        pid: 2,
        tip: 'Frog jumps with joy'
      },
      {
        id: 22,
        text: 'LIZARD',
        icon: 'fas-dragon',
        pid: 2,
        tip: 'Lizard moves with speed'
      },
      {
        id: 3,
        text: 'Birds',
        tip: 'Birds fly with grace'
      },
      {
        id: 31,
        text: 'CROW',
        icon: 'fas-crow',
        pid: 3,
        tip: 'Crow oozes mystery'
      },
      {
        id: 32,
        text: 'DOVE',
        icon: 'fas-dove',
        pid: 3,
        tip: 'Dove brings pure peace'
      },
    ],
  } as TreeProps,
} as ComPropExample;
