import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiHtmlPage from './TiHtmlPage.vue';
import { simple } from './example/index';

let en = {
  'com-name': 'HTML Page',
};
let cn = {
  'com-name': 'HTML页面',
};

const COM_TYPE = COM_TYPES.HtmlPage;

const TiHtmlPageInfo: TiComInfo = {
  icon: 'fas-file-code',
  race: TiComRace.VIEW,
  name: COM_TYPE,
  text: 'i18n:ti-html-page-com-name',
  i18n: {
    en_us: en,
    en_uk: en,
    zh_cn: cn,
    zh_hk: cn,
  },
  com: TiHtmlPage,
  install: (app: App) => {
    app.component(COM_TYPE, TiHtmlPage);
  },
  defaultProps: 'simple',
  exampleProps: [simple],
};

export * from './html-page-types';
export { TiHtmlPage, TiHtmlPageInfo };
