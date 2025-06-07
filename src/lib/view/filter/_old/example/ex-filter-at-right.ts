import { ComPropExample } from '../../../../../_type';
import { FilterProps } from '../ti-filter-types';
import { getFilterExampleFields } from './ex-fields';

export default {
  name: 'at_right',
  text: 'i18n:ti-filter-example-at-right',
  comConf: {
    className: 'fit-parent',
    value: {
      type: 'hippo',
      age: '[3,89)',
    },
    keywords: [
      {
        valueCase: 'upper',
        mode: 'contains',
      },
    ],
    majorFields: ['type', 'name', '__keywords', 'dob'],
    canCustomizedMajor: true,
    actionCollapse: true,
    actionAt: 'right',
    majorForm: {
      layoutGridTracks: [
        '#4:100px,1fr,200px,1fr',
        '#3:100px,1fr,200px',
        '#2:1fr,200px',
      ],
    },
    fields: [...getFilterExampleFields()],
  } as FilterProps,
} as ComPropExample;
