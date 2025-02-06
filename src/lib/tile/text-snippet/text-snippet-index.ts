import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiTextSnippet from './TiTextSnippet.vue';
import { simple } from './example/index';

let en = {
  'com-name': 'Text Snippet',
};
let cn = {
  'com-name': '文字片段',
};

const COM_TYPE = COM_TYPES.TextSnippet;

const TiTextSnippetInfo: TiComInfo = {
  icon: 'fas-paragraph',
  race: TiComRace.TILE,
  name: COM_TYPE,
  text: 'i18n:ti-text-snippet-com-name',
  i18n: {
    en_us: en,
    en_uk: en,
    zh_cn: cn,
    zh_hk: cn,
  },
  com: TiTextSnippet,
  install: (app: App) => {
    app.component(COM_TYPE, TiTextSnippet);
  },
  defaultProps: 'simple',
  exampleProps: [simple],
};

export * from './text-snippet-types';
export { TiTextSnippet, TiTextSnippetInfo };
