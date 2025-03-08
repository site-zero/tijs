import { ComPropExample } from '../../../../_type';
import { DroplistProps } from '../ti-droplist-types';

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
  } as DroplistProps,
} as ComPropExample;
