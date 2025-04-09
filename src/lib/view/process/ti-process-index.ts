import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiProcess from './TiProcess.vue';
import example from './example';

const en_us = {
  'com-name': 'Process',
  'example-abortable': 'Abortable',
  'example-list': 'Status List',
};
const zh_cn = {
  'com-name': '处理过程',
  'example-abortable': '可中止',
  'example-list': '状态列表',
};

const COM_TYPE = COM_TYPES.Process;

const TiProcessInfo: TiComInfo = {
  icon: 'zmdi-tv-list',
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
  exampleProps: [example.simple, example.abortable, example.list],
};

export * from './ti-process-types';
export { TiProcess, TiProcessInfo };
