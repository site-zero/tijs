import { ComPropExample } from '../../../../_type';
import { TreeProps } from '../ti-tree-types';
import { getListData } from './mock_data';

export default {
  name: 'multi_with_icon',
  text: 'i18n:ti-tree-example-multi-with-icon',
  comConf: {
    className: 'border-dotted fit-parent',
    multi: true,
    size: 'b',
    currentId: null,
    checkedIds: {},
    canSelect: false,
    canCheck: true,
    data: getListData({ icon: true, tip: false }),
  } as TreeProps,
} as ComPropExample;
