import { TiComInfo, TiComRace } from '../../';
import { App, defineAsyncComponent } from 'vue';
//import TiTable from "./TiTable.vue";
const TiTable = defineAsyncComponent(() => import('./TiTable.vue'));
import { d1k, simple, d10k, d300 } from './example';
import i18n from './i18n';

const COM_TYPE = 'TiTable';

const TiTableInfo: TiComInfo = {
  icon: 'fas-table-cells',
  race: TiComRace.VIEW,
  name: COM_TYPE,
  text: 'i18n:ti-table-com-name',
  i18n,
  com: TiTable,
  install: (app: App) => {
    app.component(COM_TYPE, TiTable);
  },
  defaultProps: 'simple',
  exampleProps: [simple, d300, d1k, d10k],
};

export { TiTable, TiTableInfo };
