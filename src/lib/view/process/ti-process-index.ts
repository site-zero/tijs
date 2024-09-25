import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiProcess from './TiProcess.vue';
import example from './example';

const en_us = {
  'com-name': 'Process',
};
const zh_cn = {
  'com-name': '处理过程',
};

const COM_TYPE = COM_TYPES.Process;

const TiProcessInfo: TiComInfo = {
  icon: 'fas-terminal',
  race: TiComRace.VIEW,
  name: COM_TYPE,
  text: 'i18n:ti-process-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiProcess,
  install: (app: App) => {
    app.component(COM_TYPE, TiProcess);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple],
};

export * from './ti-process-types';
export { TiProcess, TiProcessInfo };
