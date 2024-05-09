import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../core';
import TiPager from './TiPager.vue';
import example from './example';

const en_us = {
  'com-name': 'Pager',
};
const zh_cn = {
  'com-name': '翻页器',
  'example-jumper': '跳转翻页',
  'example-buttons': '按钮翻页',
};

const COM_TYPE = 'TiPager';

const TiPagerInfo: TiComInfo = {
  //icon: 'fas-pager',
  icon: '🏗️',
  race: TiComRace.ACTION,
  name: COM_TYPE,
  text: 'i18n:ti-pager-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiPager,
  install: (app: App) => {
    app.component(COM_TYPE, TiPager);
  },
  defaultProps: 'jumper',
  exampleProps: [example.jumper, example.buttons],
};

export { TiPager, TiPagerInfo };
