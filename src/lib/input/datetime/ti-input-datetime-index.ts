import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../core';
import { COM_TYPES } from '../../lib-com-types';
import TiInputDatetime from './TiInputDatetime.vue';
import example from './example';

const en_us = {
  'com-name': 'Datetime',
};
const zh_cn = {
  'com-name': '日期时间框',
};

const COM_TYPE = COM_TYPES.InputDatetime;

const TiInputDatetimeInfo: TiComInfo = {
  tags: ['ing'],
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
  install: (app: App) => {
    app.component(COM_TYPE, TiInputDatetime);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple],
};

export * from './ti-input-datetime-types';
export { TiInputDatetime, TiInputDatetimeInfo };
