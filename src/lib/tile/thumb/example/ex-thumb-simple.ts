import { ComPropExample } from '../../../../_type';
import { ThumbProps } from '../ti-thumb-types';

export default {
  name: 'simple',
  text: 'i18n:simple',
  comConf: {
    width: 100,
    height: 200,
    preview: {
      src: {
        type: 'font',
        value: 'zmdi-card-giftcard',
        style: {
          fontSize: '64px',
        },
      },
      objectFit: 'contain',
      imgStyle: {
        height: 100,
      },
    },
    text: 'Gift For You',
  } as ThumbProps,
} as ComPropExample;
