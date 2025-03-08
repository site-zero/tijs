import { ComPropExample } from '../../../../_type';
import { ListProps } from '../ti-list-types';
import { getListData } from './mock_data';

export default {
  name: 'with_icon',
  text: 'i18n:ti-list-example-with-icon',
  comConf: {
    className: 'border-dashed fit-parent',
    size: 'b',
    currentId: null,
    checkedIds: {},
    data: getListData({ icon: true, tip: false }),
  } as ListProps,
} as ComPropExample;
