import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiInputColor from './TiInputColor.vue';
import example from './example';

const en_us = {
  'com-name': 'InputColor',
};
const zh_cn = {
  'com-name': '颜色选择',
};

const COM_TYPE = COM_TYPES.InputColor;

const TiInputColorInfo: TiComInfo = {
  tags: ['scaffold'],
  icon: 'fas-palette',
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: 'i18n:ti-input-color-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiInputColor,
  install: (app: App) => {
    app.component(COM_TYPE, TiInputColor);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple],
};

export * from './ti-input-color-types';
export { TiInputColor, TiInputColorInfo };
