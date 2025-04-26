import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../../_type';
import { COM_TYPES } from '../../../lib-com-types';
import TiUploadBar from './TiUploadBar.vue';
import example from './example';

const en_us = {
  'com-name': 'Upload Bar',
  'example-in-progress': 'In Progress',
  'example-nil': 'Nil Value',
  'upload': 'Upload',
  'clean': 'Clean',
};
const zh_cn = {
  'com-name': '上传条',
  'example-in-progress': '带进度条',
  'example-nil': '空值',
  'upload': '上传',
  'clean': '清除',
};

const COM_TYPE = COM_TYPES.UploadBar;

const TiUploadBarInfo: TiComInfo = {
  icon: 'fas-upload',
  race: TiComRace.TILE,
  name: COM_TYPE,
  text: 'i18n:ti-upload-bar-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiUploadBar,
  install: (app: App) => {
    app.component(COM_TYPE, TiUploadBar);
  },
  liveStyle: {
    width: '62%',
    minWidth: '260px',
    maxWidth: '500px',
  },
  defaultProps: 'simple',
  exampleProps: [example.simple, example.inProgress, example.nil],
};

export * from './ti-upload-bar-types';
export { TiUploadBar, TiUploadBarInfo };
