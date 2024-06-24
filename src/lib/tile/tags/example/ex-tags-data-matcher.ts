import { ComPropExample } from '../../../../_type';
import { TagsProps } from '../ti-tags-types';

export default {
  name: 'data_matcher',
  text: 'i18n:ti-tags-example-data-matcher',
  comConf: {
    nowrap: true,
    editable: true,
    defaultTagType: 'warn',
    value: {
      name: 'Pdvvddh*',
      age: '[18,45]',
    },
    nameTranslator: {
      name: 'Name',
      age: 'Age',
    },
  } as TagsProps,
} as ComPropExample;
