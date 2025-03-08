import { ComPropExample } from '../../../../_type';
import { getListData } from '../../../view/list/example/mock_data';
import { RadioListProps } from '../ti-radio-list-types';

export default {
  name: 'with-icon',
  text: 'i18n:ti-check-list-example-with-icon',
  comConf: {
    size: 'b',
    value: 3,
    data: getListData({ icon: true, tip: false }),
  } as RadioListProps,
} as ComPropExample;
