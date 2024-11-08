import { ComPropExample } from '../../../../_type';
import { UploadBarProps } from '../ti-upload-bar-types';

export default {
  name: 'simple',
  text: 'i18n:simple',
  comConf: {
    preview: { src: { type: 'font', value: 'fas-briefcase' } },
    text: 'Gift For You',
    actions: {
      className: 'top-as-button',
      items: [
        {
          text: 'i18n:upload',
          icon: 'fas-upload',
        },
      ],
    },
  } as UploadBarProps,
} as ComPropExample;
