import { ComPropExample } from '../../../../_type';
import { getFilterExampleFields } from '../../filter/example/ex-fields';
import { ComboFilterProps } from '../ti-combo-filter-types';

export default {
  name: 'nomenu',
  text: 'i18n:ti-combo-filter-example-nomenu',
  comConf: {
    className: 'fit-parent',
    value: {
      filter: {
        name: 'foxa',
        age: '[3,89)',
        type: 'cow',
        phone: '124*',
      },
      sorter: {
        ct: 1,
        name: -1,
      },
    },
    keepMajor: 'local:Ti-Demo-TiComboFilter-Major-nomenu',
    filterConfig: {
      majorFields: ['type', '__keywords', 'dob'],
      canCustomizedMajor: true,
      actionCollapse: false,
      actionAt: 'none',
      fields: [...getFilterExampleFields()],
    },
    sorterConfig: {
      options: [
        { value: 'ct', text: 'Created Time' },
        { value: 'name', text: 'Name' },
      ],
    },
  } as ComboFilterProps,
} as ComPropExample;
