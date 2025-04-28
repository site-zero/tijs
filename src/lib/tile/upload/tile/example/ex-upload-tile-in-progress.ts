import { ComPropExample } from '../../../../../_type';
import { UploadTileProps } from '../ti-upload-tile-types';

export default {
  name: 'in-progress',
  text: 'i18n:ti-thumb-example-in-progress',
  comConf: {
    preview: { src: { type: 'font', value: 'far-file-zipper' } },
    text: 'Hello My Document',
    progress: {
      value: 0.64,
    },
    width: '200px',
    height: '150px',
  } as UploadTileProps,
} as ComPropExample;
