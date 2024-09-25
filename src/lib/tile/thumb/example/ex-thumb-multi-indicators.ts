import { ComPropExample } from '../../../../_type';
import { ThumbProps } from '../ti-thumb-types';

export default {
  name: 'multi-indicators',
  text: 'i18n:ti-thumb-example-multi-indicators',
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
    indicators: [
      { position: 'left-top', type: 'info', icon: 'zmdi-city', text: 'city' },
      { position: 'right-top', type: 'warn', icon: 'zmdi-cutlery' },
      { position: 'bottom-left', type: 'danger', icon: 'zmdi-fire' },
      { position: 'bottom-right', type: 'text', icon: 'zmdi-lock' },
      { position: 'center', type: 'primary', icon: 'zmdi-map' },
    ],
  } as ThumbProps,
} as ComPropExample;
