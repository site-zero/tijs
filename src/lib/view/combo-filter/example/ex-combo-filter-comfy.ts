import { ComPropExample } from '../../../../_type';
import { getFilterExampleFields } from '../../filter/_old/example/ex-fields';
import { ComboFilterProps } from '../ti-combo-filter-types';

export default {
  name: 'comfy',
  text: 'i18n:ti-combo-filter-example-comfy',
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
    keepMajor: 'local:Ti-Demo-TiComboFilter-Major-comfy',
    filterConfig: {
      majorFields: ['type', '__keywords', 'dob'],
      canCustomizedMajor: true,
      actionCollapse: false,
      title: 'Search',
      actionAt: 'top',
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
