import { ComPropExample } from '../../../../core';
import { ListProps } from '../ti-list-types';
import { getListData } from './mock_date';

export default {
  name: 'multi_with_icon',
  text: 'i18n:ti-list-example-multi-with-icon',
  comConf: {
    className: 'border-dotted',
    multi: true,
    size: 'b',
    currentId: null,
    checkedIds: {},
    data: getListData({ icon: true, tip: false }),
  } as ListProps,
} as ComPropExample;
