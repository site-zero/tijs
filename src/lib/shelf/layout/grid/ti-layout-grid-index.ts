import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../../core';
import TiLayoutGrid from './TiLayoutGrid.vue';
import { simple } from './example';
import { COM_TYPE } from './grid.types';
import i18n from './i18n';

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
  exampleProps: [simple],
};

export { TiLayoutGrid, TiLayoutGridInfo };
