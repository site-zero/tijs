import { ComPropExample, IconObj, Vars } from '../../../../_type';
import { ImageProps } from '../ti-image-types';

export default {
  name: 'icon',
  text: 'i18n:ti-image-example-icon',
  comConf: {
    src: {
      type: 'font',
      value: 'zmdi-flower-alt',
      style: {
        fontSize: '64px',
        color: 'red',
      },
    } as IconObj,
  } as ImageProps,
} as ComPropExample;
