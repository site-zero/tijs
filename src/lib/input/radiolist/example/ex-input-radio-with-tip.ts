import { ComPropExample } from '../../../../_type';
import { getListData } from '../../../view/list/example/mock_data';
import { RadioListProps } from '../ti-radio-list-types';

export default {
  name: 'with-tip',
  text: 'i18n:ti-check-list-example-with-tip',
  comConf: {
    size: 'b',
    value: 2,
    data: getListData({ icon: true, tip: false }),
  } as RadioListProps,
} as ComPropExample;
