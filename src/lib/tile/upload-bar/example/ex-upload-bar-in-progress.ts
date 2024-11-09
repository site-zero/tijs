import { ComPropExample } from '../../../../_type';
import { UploadBarProps } from '../ti-upload-bar-types';

export default {
  name: 'in-progress',
  text: 'i18n:ti-thumb-example-in-progress',
  comConf: {
    preview: { src: { type: 'font', value: 'far-file-zipper' } },
    text: 'Hello My Document',
    progress: {
      value: 0.64,
    },
  } as UploadBarProps,
} as ComPropExample;
