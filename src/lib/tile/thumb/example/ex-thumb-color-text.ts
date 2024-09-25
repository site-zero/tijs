import { textShadow } from 'html2canvas/dist/types/css/property-descriptors/text-shadow';
import { ComPropExample } from '../../../../_type';
import { ThumbProps } from '../ti-thumb-types';

export default {
  name: 'color-text',
  text: 'i18n:ti-thumb-example-color-text',
  comConf: {
    width: 100,
    height: 200,
    style: {
      background: 'yellow',
    },
    preview: {
      src: {
        type: 'font',
        value: 'zmdi-card-giftcard',
        style: {
          fontSize: '64px',
        },
      },
      objectFit: 'contain',
      height: 100,
    },
    text: {
      text: 'Gift For You',
      style: {
        background: 'red',
        color: 'white',
        textShadow: '1px 1px 2px var(--ti-color-mask-heavy)',
      },
    },
  } as ThumbProps,
} as ComPropExample;
