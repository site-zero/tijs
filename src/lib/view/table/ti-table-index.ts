import { App } from 'vue';
import { COM_TYPES } from '../../lib-com-types';
import { TiComInfo, TiComRace } from '../../../core/_top/_types';
import TiTable from './TiTable.vue';
//const TiTable = defineAsyncComponent(() => import('./TiTable.vue'));
import { d10k, d1k, d300, editable, simple } from './example';
import i18n from './i18n';

const COM_TYPE = COM_TYPES.Table;

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
  exampleProps: [simple, d300, d1k, d10k, editable],
  exampleModel: {
    'cell-change': {
      key: 'data.${rowIndex}.${name}',
      val: '=value',
    },
  },
};

export * from './ti-table-type';
export { TiTable, TiTableInfo };
