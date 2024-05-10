import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../../core';
import TiLayoutTabs from './TiLayoutTabs.vue';
import { atBottom, atTop } from './example';
export const COM_TYPE = 'TiLayoutTabs';

const en_us = {
  'com-name': 'Tabs Layout',
  'example-at-top': 'Tabs At Top',
  'example-at-bottom': 'Tabs At Bottom',
};
const zh_cn = {
  'com-name': '标签布局',
  'example-at-top': '标签组位于顶部',
  'example-at-bottom': '标签组位于底部',
};

const TiLayoutTabsInfo: TiComInfo = {
  icon: 'zmdi-tab',
  race: TiComRace.SHELF,
  name: COM_TYPE,
  text: 'i18n:ti-layout-tabs-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiLayoutTabs,
  install: (app: App) => {
    app.component(COM_TYPE, TiLayoutTabs);
  },
  defaultProps: 'at-top',
  exampleProps: [atTop, atBottom],
};

export { TiLayoutTabs, TiLayoutTabsInfo };
