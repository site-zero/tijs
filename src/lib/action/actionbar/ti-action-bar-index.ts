import { App } from 'vue';
import { COM_TYPES } from '../../lib-com-types';
import { TiComInfo, TiComRace } from '../../../core';
import TiActionBar from './TiActionBar.vue';
import { simple } from './example';
import i18n from './i18n';

const COM_TYPE = COM_TYPES.ActionBar;

const TiActionBarInfo: TiComInfo = {
  icon: 'fas-hanukiah',
  race: TiComRace.ACTION,
  name: COM_TYPE,
  text: 'i18n:ti-action-bar-com-name',
  i18n,
  com: TiActionBar,
  install: (app: App) => {
    app.component(COM_TYPE, TiActionBar);
  },
  defaultProps: 'simple',
  exampleProps: [simple],
};

export { TiActionBar, TiActionBarInfo };
