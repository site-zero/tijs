import { ComPropExample } from '../../../../_type';
import { getListData } from '../../../view/list/example/mock_data';
import { CheckListProps } from '../ti-check-list-types';

export default {
  name: 'with-tip',
  text: 'i18n:ti-check-list-example-with-tip',
  comConf: {
    size: 'b',
    value: [1, 3],
    data: getListData({ icon: true, tip: false }),
  } as CheckListProps,
} as ComPropExample;
