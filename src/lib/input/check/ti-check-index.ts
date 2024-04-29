import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../';
import TiCheck from './TiCheck.vue';
import { COM_TYPE } from './check.type';

const en_us = {
  'com-name': 'CheckBox',
};
const zh_cn = {
  'com-name': '勾选框',
};

const TiCheckInfo: TiComInfo = {
  icon: 'zmdi-check-square',
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: 'i18n:ti-check-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiCheck,
  install: (app: App) => {
    app.component(COM_TYPE, TiCheck);
  },
  defaultProps: 'simple',
  exampleProps: [
    {
      name: 'simple',
      text: 'i18n:simple',
      comConf: {
        value: true,
        text: 'hello',
      },
    },
  ],
};

export { TiCheck, TiCheckInfo };
