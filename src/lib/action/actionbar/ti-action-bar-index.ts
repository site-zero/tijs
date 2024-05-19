import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../core/_top/_types';
import { COM_TYPES } from '../../lib-com-types';
import TiActionBar from './TiActionBar.vue';
import { simple } from './example';
import i18n from './i18n';

const COM_TYPE = COM_TYPES.ActionBar;

const TiActionBarInfo: TiComInfo = {
  icon: 'fas-bars',
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
