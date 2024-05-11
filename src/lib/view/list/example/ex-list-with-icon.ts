import { ComPropExample } from '../../../../core';
import { ListProps } from '../ti-list-types';
import { getListData } from './mock_date';

export default {
  name: 'with_icon',
  text: 'i18n:ti-list-example-with-icon',
  comConf: {
    className: 'border-dashed',
    size: 'b',
    data: getListData({ icon: true, tip: false }),
  } as ListProps,
} as ComPropExample;
