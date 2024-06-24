import { ComPropExample } from '../../../../_type';
import { TagsProps } from '../ti-tags-types';

export default {
  name: 'with_icon',
  text: 'i18n:ti-tags-example-with-icon',
  comConf: {
    defaultTagType: 'disable',
    value: [
      { value: 'red', icon: 'zmdi-coffee' },
      { value: 'orange', icon: 'zmdi-cocktail' },
      { value: 'yellow', icon: 'zmdi-cutlery' },
      { value: 'green', icon: 'zmdi-favorite' },
    ],
  } as TagsProps,
} as ComPropExample;
