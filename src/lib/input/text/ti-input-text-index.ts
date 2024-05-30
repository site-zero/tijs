import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../core/_top/_types';
import { COM_TYPES } from '../../lib-com-types';
import TiInputText from './TiInputText.vue';
import example from './example';

const en_us = {
  'com-name': 'Text Box',
};
const zh_cn = {
  'com-name': '文本框',
};

const COM_TYPE = COM_TYPES.InputText;

const TiInputTextInfo: TiComInfo = {
  tags: ['ing '],
  icon: 'fas-message',
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: 'i18n:ti-input-text-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiInputText,
  liveStyle: {
    width: '80%',
    minWidth: '120px',
    maxWidth: '800px',
  },
  install: (app: App) => {
    app.component(COM_TYPE, TiInputText);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple],
};

export * from './ti-input-text-types';
export { TiInputText, TiInputTextInfo };

