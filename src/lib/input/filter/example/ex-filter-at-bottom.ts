import { ComPropExample } from '../../../../core';
import { FilterProps } from '../ti-filter-types';
import { getFilterExampleFields } from './ex-fields';

export default {
  name: 'at_bottom',
  text: 'i18n:ti-filter-example-at-bottom',
  comConf: {
    value: {
      name: 'fox',
      age: '[3,89)',
    },
    keywords: [
      {
        valueCase: 'upper',
        mode: 'contains',
      },
    ],
    majorFields: ['type', '__keywords', 'dob'],
    canCustomizedMajor: true,
    actionAt: 'bottom',
    actionCollapse: false,
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
