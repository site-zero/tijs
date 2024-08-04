import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiInputPicker from './TiInputPicker.vue';
import example from './example';

const en_us = {
  'com-name': 'InputPicker',
  'example-partly': 'Partly',
};
const zh_cn = {
  'com-name': '挑选输入框',
  'example-partly': '分段显示',
};

const COM_TYPE = COM_TYPES.InputPicker;

const TiInputPickerInfo: TiComInfo = {
  tags: ['ing'],
  icon: 'fas-crosshairs',
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: 'i18n:ti-input-picker-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiInputPicker,
  liveStyle: {
    width: '80%',
    minWidth: '120px',
    maxWidth: '300px',
  },
  install: (app: App) => {
    app.component(COM_TYPE, TiInputPicker);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple],
};

export * from './ti-input-picker-types';
export { TiInputPicker, TiInputPickerInfo };
