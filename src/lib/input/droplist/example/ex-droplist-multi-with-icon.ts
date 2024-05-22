import { ComPropExample } from '../../../../core';
import { DropListProps } from '../ti-droplist-types';

export default {
  name: 'multi_with_icon',
  text: 'i18n:ti-droplist-example-multi-with-icon',
  comConf: {
    value: 'otter',
    placeholder: 'Choose one Animal',
    prefixIconForClean: true,
    options: {
      data: [
       
      ],
    },
  } as DropListProps,
} as ComPropExample;
