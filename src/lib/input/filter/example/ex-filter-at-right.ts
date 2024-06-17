import { ComPropExample } from '../../../../core';
import { DropListProps } from '../../all-input';
import { FilterProps } from '../ti-filter-types';
import { getFilterExampleFields } from './ex-fields';

export default {
  name: 'at_right',
  text: 'i18n:ti-filter-example-at-right',
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
    actionCollapse: true,
    actionAt: 'right',
    majorForm: {
      layoutGridTracks: ['100px', '1fr', '200px', '1fr'],
    },
    fields: [...getFilterExampleFields()],
  } as FilterProps,
} as ComPropExample;
