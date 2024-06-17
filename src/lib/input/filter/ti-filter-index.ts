import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../core/_top/_types';
import { COM_TYPES } from '../../lib-com-types';
import TiFilter from './TiFilter.vue';
import example from './example';

const en_us = {
  'com-name': 'Filter',
  'customize': 'Customize',
  'advance': 'Advance',
  'example-at-bottom': 'Buttons At Bottom',
  'example-at-right': 'Buttons At Right',
};
const zh_cn = {
  'com-name': '过滤器',
  'customize': '定制条件',
  'advance': '高级搜索',
  'example-at-bottom': '按钮在底部',
  'example-at-right': '按钮在右侧',
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
    width: '80%',
    maxWidth: '1000px',
  },
  install: (app: App) => {
    app.component(COM_TYPE, TiFilter);
  },
  defaultProps: 'at_right',
  exampleProps: [example.atRight, example.atBottom],
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
