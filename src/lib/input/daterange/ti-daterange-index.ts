import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../core/_top/_types';
import { COM_TYPES } from '../../lib-com-types';
import TiInputDateRange from './TiInputDateRange.vue';
import example from './example';

const en_us = {
  'com-name': 'Date Range',
};
const zh_cn = {
  'com-name': '日期范围',
};

const COM_TYPE = COM_TYPES.InputDateRange;

const TiInputDateRangeInfo: TiComInfo = {
  icon: 'fas-calendar-week',
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: 'i18n:ti-input-date-range-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiInputDateRange,
  install: (app: App) => {
    app.component(COM_TYPE, TiInputDateRange);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple],
};

export * from './ti-daterange-types';
export { TiInputDateRange, TiInputDateRangeInfo };
