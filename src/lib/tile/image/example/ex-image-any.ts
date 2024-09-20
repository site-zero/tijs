import { ComPropExample } from '../../../../_type';
import { ImageProps } from '../ti-image-types';

export default {
  name: 'any',
  text: 'i18n:ti-image-example-any',
  comConf: {
    src: {
      type: 'font',
      value: 'zmdi-evernote',
      style: {
        fontSize: '64px',
      },
    },
  } as ImageProps,
} as ComPropExample;
