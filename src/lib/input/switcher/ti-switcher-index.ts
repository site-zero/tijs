import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../core/_top/_types';
import { COM_TYPES } from '../../lib-com-types';
import TiSwitcher from './TiSwitcher.vue';
import example from './example';

const en_us = {
  'com-name': 'Switcher',
};
const zh_cn = {
  'com-name': '开关组',
};

const COM_TYPE = COM_TYPES.Switcher;

const TiSwitcherInfo: TiComInfo = {
  tags: ['scaffold'],
  icon: 'zmdi-input-composite',
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: 'i18n:ti-switcher-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiSwitcher,
  install: (app: App) => {
    app.component(COM_TYPE, TiSwitcher);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple],
};

export * from './ti-switcher-types';
export { TiSwitcher, TiSwitcherInfo };
