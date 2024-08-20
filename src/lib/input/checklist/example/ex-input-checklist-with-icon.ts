import { ComPropExample } from '../../../../_type';
import { getListData } from '../../../view/list/example/mock_date';
import { CheckListProps } from '../ti-check-list-types';

export default {
  name: 'with-icon',
  text: 'i18n:ti-check-list-example-with-icon',
  comConf: {
    size: 'b',
    value: [1, 3],
    data: getListData({ icon: true, tip: false }),
  } as CheckListProps,
} as ComPropExample;
