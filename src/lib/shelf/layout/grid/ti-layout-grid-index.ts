import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../../core';
import { COM_TYPES } from '../../../lib-com-types';
import TiLayoutGrid from './TiLayoutGrid.vue';
import { simple } from './example';
import i18n from './i18n';

const COM_TYPE = COM_TYPES.LayoutGrid;

const TiLayoutGridInfo: TiComInfo = {
  icon: 'zmdi-view-quilt',
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

export * from './ti-layout-grid-types';
export { TiLayoutGrid, TiLayoutGridInfo };
