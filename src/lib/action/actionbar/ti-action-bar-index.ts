import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../core/_top/_types';
import { COM_TYPES } from '../../lib-com-types';
import TiActionBar from './TiActionBar.vue';
import * as example from './example';

const en_us = {
  'com-name': 'Action Bar',
  'example-visibility': 'Visibility',
  'exmple-mode-v': 'Vertical Mode'
};
const zh_cn = {
  'com-name': '动作条',
  'example-visibility': '可见性',
  'exmple-mode-v': '垂直模式'
};

const COM_TYPE = COM_TYPES.ActionBar;

const TiActionBarInfo: TiComInfo = {
  icon: 'fas-bars',
  race: TiComRace.ACTION,
  name: COM_TYPE,
  text: 'i18n:ti-action-bar-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiActionBar,
  install: (app: App) => {
    app.component(COM_TYPE, TiActionBar);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple, example.visiblity, example.modeV],
};

export { TiActionBar, TiActionBarInfo };
export * from './ti-action-bar-types';
