import { ComPropExample } from '../../../../_type';
import { TagsProps } from '../ti-tags-types';

export default {
  name: 'editable',
  text: 'i18n:ti-tags-example-editable',
  comConf: {
    nowrap: true,
    editable: true,
    defaultTagType: 'text',
    value: [
      { value: 'red', icon: 'zmdi-coffee' },
      { value: 'orange', icon: 'zmdi-cocktail' },
      { value: 'yellow', icon: 'zmdi-cutlery' },
      { value: 'green', icon: 'zmdi-favorite' },
      { value: 'cyan', icon: 'zmdi-graduation-cap' },
      { value: 'blue', icon: 'zmdi-mall' },
      { value: 'purple', icon: 'zmdi-shield-security' },
    ],
  } as TagsProps,
} as ComPropExample;
