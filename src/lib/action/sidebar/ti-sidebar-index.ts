import { App } from 'vue';
import { COM_TYPES } from '../../lib-com-types';
import { TiComInfo, TiComRace } from '../../../_type';
import TiSidebar from './TiSidebar.vue';
import { simple } from './example';
import i18n from './i18n';

const COM_TYPE = COM_TYPES.Sidebar;

const TiSidebarInfo: TiComInfo = {
  icon: 'fas-hill-rockslide',
  race: TiComRace.ACTION,
  name: COM_TYPE,
  text: 'i18n:ti-sidebar-com-name',
  i18n,
  com: TiSidebar,
  install: (app: App) => {
    app.component(COM_TYPE, TiSidebar);
  },
  defaultProps: 'simple',
  exampleProps: [simple],
};

export { TiSidebar, TiSidebarInfo };
