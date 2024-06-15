import { ComPropExample } from '../../../../core';
import { DropListProps } from '../../all-input';
import { FilterProps } from '../ti-filter-types';

export default {
  name: 'simple',
  text: 'i18n:simple',
  comConf: {
    value: {
      name: 'fox',
    },
    placeholder: 'Search by keywords',
    keywords: [
      {
        valueCase: 'upper',
        mode: 'contains',
      },
    ],
    majorFields: ['type', 'dob'],
    canCustomizedMajor: true,
    fields: [
      {
        title: 'Name',
        name: 'name',
      },
      {
        title: 'Age',
        name: 'age',
        type: 'Integer',
      },
      {
        title: 'Type',
        name: 'type',
        comType: 'TiDroplist',
        comConf: {
          options: [
            { value: 'hippo', text: 'Hippo', icon: 'fas-hippo' },
            { value: 'cow', text: 'Cow', icon: 'fas-cow' },
            { value: 'spider', text: 'Spider', icon: 'fas-spider' },
            { value: 'frog', text: 'Frog', icon: 'fas-frog' },
            { value: 'bugs', text: 'Bugs', icon: 'fas-bugs' },
            { value: 'otter', text: 'Otter', icon: 'fas-otter' },
            { value: 'feather', text: 'Feather', icon: 'fas-feather' },
            { value: 'fish', text: 'Fish', icon: 'fas-fish' },
          ],
        } as DropListProps,
      },
      {
        title: 'Birthday',
        name: 'dob',
        comType: 'TiInputDate',
      },
      {
        title: 'Phone',
        name: 'phone',
      },
      {
        title: 'Email',
        name: 'email',
      },
      {
        title: 'City',
        name: 'city',
      },
      {
        title: 'Job Title',
        name: 'job',
      },
    ],
  } as FilterProps,
} as ComPropExample;
