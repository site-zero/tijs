import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiFilter from './TiFilter.vue';
import example from './example';

const en_us = {
  'com-name': 'Filter',
  'customize': 'Customize',
  'advance': 'Advance',
  'example-at-bottom': 'Menu At Bottom',
  'example-at-right': 'Menu At Right',
  'example-at-none': 'Not Menu',
};
const zh_cn = {
  'com-name': '过滤器',
  'customize': '定制条件',
  'advance': '高级搜索',
  'example-at-bottom': '菜单在底部',
  'example-at-right': '菜单在右侧',
  'example-at-none': '无菜单',
};

const COM_TYPE = COM_TYPES.Filter;

const TiFilterInfo: TiComInfo = {
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
  liveStyle: {
    width: '100%',
    height: '100%',
    padding: '20px',
  },
  install: (app: App) => {
    app.component(COM_TYPE, TiFilter);
  },
  defaultProps: 'at_right',
  exampleProps: [example.atRight, example.atBottom, example.atNone],
  exampleModel: {
    'change': 'value',
    'reset': {
      key: 'value',
      val: {},
      mode: 'set',
    },
    'change-major': 'majorFields',
  },
};

export * from './ti-filter-types';
export { TiFilter, TiFilterInfo };
