import { ComPropExample } from '../../../../core';
import { TagsProps } from '../ti-tags-types';

export default {
  name: 'data_raw',
  text: 'i18n:ti-tags-example-data-raw',
  comConf: {
    nowrap: true,
    editable: true,
    valueIsMatcher: false,
    defaultTagType: 'warn',
    value: {
      name: 'Blue Tiger',
      speed: 200,
    },
    nameTranslator: {
      name: 'Name',
      speed: 'Speed',
    },
  } as TagsProps,
} as ComPropExample;
