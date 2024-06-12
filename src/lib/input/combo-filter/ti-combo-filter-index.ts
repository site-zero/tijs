import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../core/_top/_types';
import { COM_TYPES } from '../../lib-com-types';
import TiComboFilter from './TiComboFilter.vue';
import example from './example';

const en_us = {
  'com-name': 'ComboFilter',
};
const zh_cn = {
  'com-name': '组合过滤器',
};

const COM_TYPE = COM_TYPES.ComboFilter;

const TiComboFilterInfo: TiComInfo = {
  tags: ['ing'],
  icon: 'fas-filter',
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: 'i18n:ti-combo-filter-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiComboFilter,
  install: (app: App) => {
    app.component(COM_TYPE, TiComboFilter);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple],
};

export * from './ti-combo-filter-types';
export { TiComboFilter, TiComboFilterInfo };
