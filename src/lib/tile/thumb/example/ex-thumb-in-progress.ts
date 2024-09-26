import { ComPropExample } from '../../../../_type';
import { ThumbProps } from '../ti-thumb-types';

export default {
  name: 'in-progress',
  text: 'i18n:ti-thumb-example-in-progress',
  comConf: {
    width: 120,
    height: 200,
    style: {
      border: '1px dashed var(--ti-color-border-dark)',
    },
    preview: {
      src: {
        type: 'font',
        value: 'zmdi-bike',
        style: {
          fontSize: '64px',
        },
      },
      objectFit: 'contain',
      height: 100,
    },
    text: 'I like bike',
    progress: {
      value: 0.8,
      trackStyle: {
        height: '6px',
      },
    },
  } as ThumbProps,
} as ComPropExample;
