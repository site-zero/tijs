import { ComPropExample } from '../../../../_type';
import {TreeTableProps } from '../ti-tree-table-types';
import { getListData } from './mock_data';

export default {
  name: 'multi_with_tip',
  text: 'i18n:ti-tree-table-example-multi-with-tip',
  comConf: {
    className: 'tip-block border-dotted fit-parent',
    size: 'm',
    multi: true,
    currentId: null,
    checkedIds: {},
    data: getListData({ icon: true, tip: true }),
  } as TreeTableProps,
} as ComPropExample;
