import { ComPropExample } from '../../../../_type';
import { UploadBarProps } from '../ti-upload-bar-types';

export default {
  name: 'simple',
  text: 'i18n:simple',
  comConf: {
    preview: { src: { type: 'font', value: 'fas-briefcase' } },
    text: 'Gift For You',
    type: 'info',
    actions: [
      {
        text: 'i18n:open',
        action: 'open',
      },
    ],
  } as UploadBarProps,
} as ComPropExample;
