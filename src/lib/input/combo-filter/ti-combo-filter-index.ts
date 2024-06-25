import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiComboFilter from './TiComboFilter.vue';
import example from './example';

const en_us = {
  'com-name': 'ComboFilter',
  'sort-title': 'SORT',
  'sort-setup': 'Setup Sorter',
  'example-comfy': 'Comfy',
  'example-tight': 'Tight',
  'example-oneline': 'One Line',
  'example-nomenu': 'No Menu',
};
const zh_cn = {
  'com-name': '组合过滤器',
  'sort-title': '排序',
  'sort-setup': '设置排序',
  'example-comfy': '舒适布局',
  'example-tight': '紧凑布局',
  'example-oneline': '单行布局',
  'example-nomenu': '无菜单舒适布局',
};

const COM_TYPE = COM_TYPES.ComboFilter;

const TiComboFilterInfo: TiComInfo = {
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
  liveStyle: {
    width: '100%',
    height: '100%',
    padding: '20px',
  },
  install: (app: App) => {
    app.component(COM_TYPE, TiComboFilter);
  },
  defaultProps: 'comfy',
  exampleProps: [example.comfy, example.tight, example.oneline, example.nomenu],
};

export * from './ti-combo-filter-types';
export { TiComboFilter, TiComboFilterInfo };
