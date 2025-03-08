import { ComPropExample } from '../../../../_type';
import {TreeTableProps } from '../ti-tree-table-types';
import { getListData } from './mock_data';

export default {
  name: 'multi_with_icon',
  text: 'i18n:ti-tree-table-example-multi-with-icon',
  comConf: {
    className: 'border-dotted fit-parent',
    multi: true,
    size: 'b',
    currentId: null,
    checkedIds: {},
    canSelect: false,
    canCheck: true,
    data: getListData({ icon: true, tip: false }),
  } as TreeTableProps,
} as ComPropExample;
