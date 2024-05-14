import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../core';
import { COM_TYPES } from '../../lib-com-types';
import TiToggle from './TiToggle.vue';
import example from './example';

const en_us = {
  'com-name': 'Toggle',
};
const zh_cn = {
  'com-name': '开关',
};

const COM_TYPE = COM_TYPES.Toggle;

const TiToggleInfo: TiComInfo = {
  icon: 'fas-toggle-off',
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: 'i18n:ti-toggle-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiToggle,
  install: (app: App) => {
    app.component(COM_TYPE, TiToggle);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple],
};

export * from './ti-toggle-types';
export { TiToggle, TiToggleInfo };
