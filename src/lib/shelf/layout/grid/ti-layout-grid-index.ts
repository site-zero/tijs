import { App, defineAsyncComponent } from 'vue';
import { TiComInfo, TiComRace } from '../../../../_type';
import { COM_TYPES } from '../../../lib-com-types';
import { simple } from './example';
import i18n from './i18n';
//import TiLayoutGrid from './TiLayoutGrid.vue';
const TiLayoutGrid:any = defineAsyncComponent({
  loader: () => import('./TiLayoutGrid.vue'),
  loadingComponent: {
    template: '<div>Loading AsyncComponent...</div>',
  },
  errorComponent: {
    template: '<div>Fail to async load TiLayoutGrid.vue</div>',
  },
});

const COM_TYPE = COM_TYPES.LayoutGrid;

const TiLayoutGridInfo: TiComInfo = {
  icon: 'zmdi-view-quilt',
  race: TiComRace.SHELF,
  name: COM_TYPE,
  text: 'i18n:ti-layout-grid-com-name',
  i18n,
  com: TiLayoutGrid,
  liveStyle: {
    width: '100%',
    height: '100%',
  },
  install: (app: App) => {
    app.component(COM_TYPE, TiLayoutGrid);
  },
  defaultProps: 'simple',
  exampleProps: [simple],
};

export * from './ti-layout-grid-types';
export { TiLayoutGrid, TiLayoutGridInfo };
