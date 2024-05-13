import { App } from 'vue';
import { COM_TYPES } from '../../lib-com-types';
import { TiComInfo, TiComRace, Vars } from '../../../core';
import TiPager from './TiPager.vue';
import example from './example';

const en_us = {
  'com-name': 'Pager',
};
const zh_cn = {
  'com-name': '翻页器',
  'example-jumper': '跳转翻页',
  'example-button': '按钮翻页',
  'example-dotted': '指示器翻页',
};

const COM_TYPE = COM_TYPES.Pager;

const TiPagerInfo: TiComInfo = {
  //icon: 'fas-pager',
  icon: '🚜',
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
  exampleProps: [example.jumper, example.button, example.dotted],
  exampleModel: {
    'change-page-number': 'pageNumber',
    'change-page-size': (pageSize, config) => {
      let { pageCount, totalCount, count } = config;
      let re = { pageSize } as Vars;
      if (pageSize > 1) {
        pageCount = Math.ceil(totalCount / pageSize);
        re.count = Math.min(count, pageSize);
        re.pageCount = pageCount;
      }
      return re;
    },
  },
};

export { TiPager, TiPagerInfo };
export * from './ti-pager-types';
