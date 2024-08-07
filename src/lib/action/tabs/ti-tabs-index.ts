import { App } from 'vue';
import { COM_TYPES } from '../../lib-com-types';
import { TiComInfo, TiComRace } from '../../../_type';
import TiTabs from './TiTabs.vue';
import * as example from './example';

const en_us = {
  'com-name': 'Tabs',
  'example-at-top': 'At Top',
  'example-at-bottom': 'At Bottom',
  'example-very-long': 'Very Long Tabs',
  'example-very-many': 'Very Many Tabs',
  'example-t0': 'Tab 0',
  'example-t1': 'Tab 1',
  'example-t2': 'Tab 2',
  'example-t3': 'Tab 3',
  'example-t4': 'Tab 4',
};
const zh_cn = {
  'com-name': '标签组',
  'example-at-top': '位于顶部',
  'example-at-bottom': '位于底部',
  'example-very-long': '长长的标签项',
  'example-very-many': '多多的标签项',
  'example-t0': '标签 0',
  'example-t1': '标签 1',
  'example-t2': '标签 2',
  'example-t3': '标签 3',
  'example-t4': '标签 4',
};

const COM_TYPE = COM_TYPES.Tabs;

const TiTabsInfo: TiComInfo = {
  icon: 'zmdi-tab-unselected',
  race: TiComRace.ACTION,
  name: COM_TYPE,
  text: 'i18n:ti-tabs-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiTabs,
  install: (app: App) => {
    app.component(COM_TYPE, TiTabs);
  },
  liveStyle: {
    width: '100%',
    padding: '20px',
  },
  defaultProps: 'at-top',
  exampleProps: [
    example.atTop,
    example.atBottom,
    example.veryLong,
    example.veryMany,
  ],
  exampleModel: {
    change: {
      key: 'value',
      val: '=0.index',
    },
  },
};

export { TiTabs, TiTabsInfo };
export * from './ti-tabs-types';
