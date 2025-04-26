import { ComPropExample } from '../../../../../_type';
import { UploadTileProps } from '../ti-upload-tile-types';

export default {
  name: 'simple',
  text: 'i18n:simple',
  comConf: {
    preview: { src: { type: 'font', value: 'fas-briefcase' } },
    text: 'Gift For You',
    actions: [
      {
        text: 'i18n:open',
        action: 'open',
      },
    ],
    width: '140px',
    height: '200px',
  } as UploadTileProps,
} as ComPropExample;
