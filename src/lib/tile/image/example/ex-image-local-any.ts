import { ComPropExample } from '../../../../_type';
import { ImageProps } from '../ti-image-types';

export default {
  name: 'local-any',
  text: 'i18n:ti-image-example-local-any',
  comConf: {
    objectFit: 'contain',
    style: {
      width: '100px',
      height: '100px',
      backgroundColor: '#c0c0c0',
      objectPosition: 'center',
    },
  } as ImageProps,
} as ComPropExample;
