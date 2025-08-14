import { TiComInfo, TiComRace } from "@site0/tijs";
import { App } from "vue";
import { COM_TYPES } from "../../lib-com-types";
import TiSearchBar from "./TiSearchBar.vue";
import example from './example';

const en_us = {
  'com-name': 'Search Bar',
};
const zh_cn = {
  'com-name': '搜索条',
};

const COM_TYPE = COM_TYPES.SearchBar;

const TiSearchBarInfo: TiComInfo = {
  tags: ['ing'],
  icon: "fas-magnifying-glass", // 从 fontawsome 寻找一个合适的图标
  race: TiComRace.VIEW,
  name: COM_TYPE,
  text: 'i18n:ti-search-bar-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiSearchBar,
  install: (app: App) => {
    app.component(COM_TYPE, TiSearchBarInfo);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple],
};

export * from "./ti-search-bar-types";
export { TiSearchBar, TiSearchBarInfo };
