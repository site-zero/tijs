import { ComPropExample } from '../../../../_type';
import { UploadBarProps } from '../ti-upload-bar-types';

export default {
  name: 'nil',
  text: 'i18n:ti-upload-bar-example-nil',
  comConf: {
    preview: {
      src: {
        type: 'font',
        value: 'fas-hands-holding-child',
      },
    },
    text: 'Empty Bar',
    nilValue: true,
  } as UploadBarProps,
} as ComPropExample;
