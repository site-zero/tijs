import { ComPropExample } from '../../../../_type';
import { ListProps } from '../ti-list-types';
import { getListData } from './mock_data';

export default {
  name: 'multi_with_tip',
  text: 'i18n:ti-list-example-multi-with-tip',
  comConf: {
    className: 'tip-block border-dotted fit-parent',
    size: 'm',
    multi: true,
    currentId: 4,
    checkedIds: {
      '1': true,
      '4': true,
      '5': true,
    },
    data: getListData({ icon: true, tip: true }),
  } as ListProps,
} as ComPropExample;
