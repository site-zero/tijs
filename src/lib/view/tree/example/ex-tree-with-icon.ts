import { ComPropExample } from '../../../../_type';
import { TreeProps } from '../ti-tree-types';
import { getListData } from './mock_data';

export default {
  name: 'with_icon',
  text: 'i18n:ti-tree-example-with-icon',
  comConf: {
    className: 'border-dashed fit-parent',
    size: 'b',
    currentId: null,
    checkedIds: {},
    data: getListData({ icon: true, tip: false }),
  } as TreeProps,
} as ComPropExample;
