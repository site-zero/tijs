import { ComPropExample } from '../../../../_type';
import {TreeTableProps } from '../ti-tree-table-types';
import { getListData } from './mock_data';

export default {
  name: 'with_icon',
  text: 'i18n:ti-tree-table-example-with-icon',
  comConf: {
    columns: [],
    className: 'border-dashed fit-parent',
    size: 'b',
    currentId: null,
    checkedIds: {},
    data: getListData({ icon: true, tip: false }),
  } as TreeTableProps,
} as ComPropExample;
