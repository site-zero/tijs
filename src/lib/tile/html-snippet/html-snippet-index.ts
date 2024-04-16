import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../lib';
import TiHtmlSnippet from './TiHtmlSnippet.vue';
import { simple } from './example/index.ts';

const COM_TYPE = 'TiHtmlSnippet';

let en = {
  'com-name': 'HTML Snippet',
};
let cn = {
  'com-name': 'HTML片段',
};

const TiHtmlSnippetInfo: TiComInfo = {
  icon: 'zmdi-language-html5',
  race: TiComRace.TILE,
  name: COM_TYPE,
  text: 'i18n:ti-html-snippet-com-name',
  i18n: {
    en_us: en,
    en_uk: en,
    zh_cn: cn,
    zh_hk: cn,
  },
  com: TiHtmlSnippet,
  install: (app: App) => {
    app.component(COM_TYPE, TiHtmlSnippet);
  },
  defaultProps: 'simple',
  exampleProps: [simple],
};

export { TiHtmlSnippet, TiHtmlSnippetInfo };
