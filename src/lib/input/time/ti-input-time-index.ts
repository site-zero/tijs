import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiInputTime from './TiInputTime.vue';
import example from './example';

const en_us = {
  'com-name': 'Time Box',
};
const zh_cn = {
  'com-name': '时间框',
};

const COM_TYPE = COM_TYPES.InputTime;

const TiInputTimeInfo: TiComInfo = {
  tags: ['scaffold'],
  icon: 'zmdi-time',
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: 'i18n:ti-input-time-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiInputTime,
  install: (app: App) => {
    app.component(COM_TYPE, TiInputTime);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple],
};

export * from './ti-input-time-types';
export { TiInputTime, TiInputTimeInfo };
