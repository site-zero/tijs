import { ComPropExample } from '../../../../_type';
import { getFilterExampleFields } from '../../filter/example/ex-fields';
import { ComboFilterProps } from '../ti-combo-filter-types';

export default {
  name: 'tight',
  text: 'i18n:ti-combo-filter-example-tight',
  comConf: {
    className: 'fit-parent',
    value: {
      filter: {
        name: 'foxa',
        age: '[3,89)',
      },
      sorter: {
        ct: 1,
        name: -1,
      },
    },
    keepMajor: 'local: Ti-Demo-TiComboFilter-Major-tight',
    filterConfig: {
      majorFields: ['type', 'age', 'name'],
      canCustomizedMajor: true,
      actionCollapse: true,
      actionAt: 'right',
      majorForm: {
        layoutHint: 3,
        layoutGridTracks: '100px,160px,1fr',
      },
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
