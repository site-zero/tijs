import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiInputDatetime from './TiInputDatetime.vue';
import example from './example';

const en_us = {
  'com-name': 'Datetime',
  'example-quickinput': 'Quick Input',
};
const zh_cn = {
  'com-name': '日期时间框',
  'example-quickinput': '快速输入模式',
};

const COM_TYPE = COM_TYPES.InputDatetime;

const TiInputDatetimeInfo: TiComInfo = {
  icon: 'fas-calendar-day',
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: 'i18n:ti-input-datetime-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiInputDatetime,
  liveStyle: {
    width: '80%',
    minWidth: '120px',
    maxWidth: '300px',
  },
  install: (app: App) => {
    app.component(COM_TYPE, TiInputDatetime);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple, example.quickinput],
};

export * from './ti-input-datetime-types';
export { TiInputDatetime, TiInputDatetimeInfo };
