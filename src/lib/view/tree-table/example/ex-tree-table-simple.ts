import { ComPropExample } from '../../../../_type';
import { TreeTableProps } from '../ti-tree-table-types';
import { Chance } from 'chance';
import { getListData } from './mock_data';

// 创建一个 Chance 实例
const cha = new Chance();

export default {
  name: 'simple',
  text: 'i18n:simple',
  comConf: {
    columns: [],
    className: 'border-solid fit-parent',
    size: 'b',
    currentId: 3,
    checkedIds: {
      '3': true,
    },
    data: getListData({ icon: false, tip: false }),
  } as TreeTableProps,
} as ComPropExample;
