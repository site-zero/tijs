import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiInputDate from './TiInputDate.vue';
import example from './example';

const en_us = {
  'com-name': 'InputDate',
  'example-quickinput': 'Quick Input',
};
const zh_cn = {
  'com-name': '日期选择',
  'example-quickinput': '快速输入模式',
};

const COM_TYPE = COM_TYPES.InputDate;

const TiInputDateInfo: TiComInfo = {
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
  liveStyle: {
    width: '80%',
    minWidth: '120px',
    maxWidth: '300px',
  },
  install: (app: App) => {
    app.component(COM_TYPE, TiInputDate);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple, example.quickinput],
};

export { TiInputDate, TiInputDateInfo };
