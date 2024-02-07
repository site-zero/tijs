import { TiComInfo, TiComRace } from '../../../';
import { App } from 'vue';
import TiLayoutGrid from './TiLayoutGrid.vue';
import { nested, simple } from './example';
import i18n from './i18n';
import { COM_TYPE } from './use-layout-grid';

const TiLayoutGridInfo: TiComInfo = {
  icon: 'zmdi-view-dashboard',
  race: TiComRace.SHELF,
  name: COM_TYPE,
  text: 'i18n:ti-layout-grid-com-name',
  i18n,
  com: TiLayoutGrid,
  install: (app: App) => {
    app.component(COM_TYPE, TiLayoutGrid);
  },
  defaultProps: 'simple',
  exampleProps: [simple, nested],
};

export { TiLayoutGrid, TiLayoutGridInfo };
