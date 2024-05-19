import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../core/_top/_types';
import { COM_TYPES } from '../../lib-com-types';
import TiInputDate from './TiInputDate.vue';
import example from './example';

const en_us = {
  'com-name': 'InputDate',
};
const zh_cn = {
  'com-name': '日期选择',
};

const COM_TYPE = COM_TYPES.InputDate;

const TiInputDateInfo: TiComInfo = {
  tags: ['scaffold'],
  icon: 'fas-calendar-days',
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: 'i18n:ti-input-date-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiInputDate,
  install: (app: App) => {
    app.component(COM_TYPE, TiInputDate);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple],
};

export * from './ti-input-date-types';
export { TiInputDate, TiInputDateInfo };
