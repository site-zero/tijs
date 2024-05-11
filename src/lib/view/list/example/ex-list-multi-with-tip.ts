import { ComPropExample } from '../../../../core';
import { ListProps } from '../ti-list-types';
import { getListData } from './mock_date';

export default {
  name: 'multi_with_tip',
  text: 'i18n:ti-list-example-multi-with-tip',
  comConf: {
    className: 'tip-block border-dotted',
    size: 'm',
    multi: true,
    data: getListData({ icon: true, tip: true }),
  } as ListProps,
} as ComPropExample;
