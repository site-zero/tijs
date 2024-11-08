import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiUploadBar from './TiUploadBar.vue';
import example from './example';

const en_us = {
  'com-name': 'Upload Bar',
  'example-in-progress': 'In Progress',
  'upload': 'Upload',
  'clean': 'Clean',
};
const zh_cn = {
  'com-name': '上传条',
  'example-in-progress': '带进度条',
  'upload': '上传',
  'clean': '清除',
};

const COM_TYPE = COM_TYPES.UploadBar;

const TiUploadBarInfo: TiComInfo = {
  icon: 'fas-cloud-arrow-up',
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
  defaultProps: 'simple',
  exampleProps: [example.simple, example.inProgress],
};

export * from './ti-upload-bar-types';
export { TiUploadBar, TiUploadBarInfo };
