import { ComPropExample } from '../../../../_type';
import { ThumbProps } from '../ti-thumb-types';

export default {
  name: 'simple',
  text: 'i18n:simple',
  comConf: {
    width: 100,
    //height: 200,
    style: {
      background: 'var(--ti-color-mask-weak)',
    },
    preview: {
      src: 'https://picsum.photos/500',
      objectFit: 'cover',
      height: 100,
    },
    text: 'Gift For You',
  } as ThumbProps,
} as ComPropExample;
