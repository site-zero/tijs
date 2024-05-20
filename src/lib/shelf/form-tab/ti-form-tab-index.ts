import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../core/_top/_types';
import { COM_TYPES } from '../../lib-com-types';
import TiFormTab from './TiFormTab.vue';
import example from './example';

const en_us = {
  'com-name': 'FormTab',
};
const zh_cn = {
  'com-name': '标签表单',
};

const COM_TYPE = COM_TYPES.FormTab;

const TiFormTabInfo: TiComInfo = {
  icon: 'fas-paste',
  race: TiComRace.SHELF,
  name: COM_TYPE,
  text: 'i18n:ti-form-tab-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiFormTab,
  install: (app: App) => {
    app.component(COM_TYPE, TiFormTab);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple],
  exampleModel: {
    change: {
      key: 'data',
      val: '=..',
      mode: 'assign',
    },
  },
};

export * from './ti-form-tab-types';
export { TiFormTab, TiFormTabInfo };
