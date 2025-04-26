import { ComPropExample } from '../../../../../_type';
import { UploadTileProps } from '../ti-upload-tile-types';

export default {
  name: 'nil',
  text: 'i18n:ti-upload-tile-example-nil',
  comConf: {
    preview: {
      src: {
        type: 'font',
        value: 'fas-hands-holding-child',
      },
    },
    text: 'Empty Bar',
    nilValue: true,
  } as UploadTileProps,
} as ComPropExample;
