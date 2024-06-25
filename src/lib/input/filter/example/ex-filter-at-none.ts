import { ComPropExample } from '../../../../_type';
import { FilterProps } from '../ti-filter-types';
import { getFilterExampleFields } from './ex-fields';

export default {
  name: 'at_none',
  text: 'i18n:ti-filter-example-at-none',
  comConf: {
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
    actionAt: 'none',
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
