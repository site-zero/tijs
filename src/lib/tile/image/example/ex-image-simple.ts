import { ComPropExample } from '../../../../_type';
import { ImageProps } from '../ti-image-types';

export default {
  name: 'simple',
  text: 'i18n:simple',
  comConf: {
    src: 'https://picsum.photos/200',
    width: 200,
    height: 120,
    objectFit:'cover',
    borderRadius: 'b',
  } as ImageProps,
} as ComPropExample;
