import { ComPropExample } from '../../../../_type';
import { getListData } from '../../../view/list/example/mock_data';
import { RadioListProps } from '../ti-radio-list-types';

export default {
  name: 'simple',
  text: 'i18n:simple',
  comConf: {
    size: 'b',
    value: 1,
    data: getListData({ icon: false, tip: false }),
  } as RadioListProps,
} as ComPropExample;
