import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiInputCode from './TiInputCode.vue';
import example from './example';

const en_us = {
  'com-name': 'Input Code',
};
const zh_cn = {
  'com-name': '编号输入',
};

const COM_TYPE = COM_TYPES.InputCode;

const TiInputCodeInfo: TiComInfo = {
  icon: 'fas-hashtag',
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: 'i18n:ti-input-code-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiInputCode,
  liveStyle: {
    width: '80%',
    minWidth: '120px',
    maxWidth: '300px',
  },
  install: (app: App) => {
    app.component(COM_TYPE, TiInputCode);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple],
};

export * from './ti-input-code-types';
export { TiInputCode, TiInputCodeInfo };
