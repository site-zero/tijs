import { ComPropExample } from '../../../../_type';
import { getListData } from '../../../view/list/example/mock_date';
import { CheckListProps } from '../ti-check-list-types';

export default {
  name: 'simple',
  text: 'i18n:simple',
  comConf: {
    size: 'b',
    value: [1, 3],
    data: getListData({ icon: false, tip: false }),
  } as CheckListProps,
} as ComPropExample;
