import { ComPropExample } from '../../../../_type';
import { MulTiMultiDroplistProps } from '../ti-multi-droplist-types';

export default {
  name: 'multi_with_icon',
  text: 'i18n:ti-multi-droplist-example-multi-with-icon',
  comConf: {
    value: 'otter',
    placeholder: 'Choose one Animal',
    prefixIconForClean: true,
    options: {
      data: [
       
      ],
    },
  } as MulTiMultiDroplistProps,
} as ComPropExample;
