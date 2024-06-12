import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../core/_top/_types';
import { COM_TYPES } from '../../lib-com-types';
import TiFilter from './TiFilter.vue';
import example from './example';

const en_us = {
  'com-name': 'Filter',
};
const zh_cn = {
  'com-name': '过滤器',
};

const COM_TYPE = COM_TYPES.Filter;

const TiFilterInfo: TiComInfo = {
  tags: ['ing'],
  icon: 'zmdi-filter-list',
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: 'i18n:ti-filter-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiFilter,
  install: (app: App) => {
    app.component(COM_TYPE, TiFilter);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple],
};

export * from './ti-filter-types';
export { TiFilter, TiFilterInfo };
