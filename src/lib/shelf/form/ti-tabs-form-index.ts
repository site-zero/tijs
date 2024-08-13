import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiTabsForm from './TiTabsForm.vue';
import example from './example';

const en_us = {
  'com-name': 'TabsForm',
  'example-tabs': 'General',
};
const zh_cn = {
  'com-name': '标签表单',
  'example-tabs': '普通',
};

const COM_TYPE = COM_TYPES.TabsForm;

const TiTabsFormInfo: TiComInfo = {
  icon: 'fas-paste',
  race: TiComRace.SHELF,
  name: COM_TYPE,
  text: 'i18n:ti-tabs-form-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiTabsForm,
  liveStyle: {
    width: '100%',
    height: '100%',
  },
  install: (app: App) => {
    app.component(COM_TYPE, TiTabsForm);
  },
  defaultProps: 'tabs',
  exampleProps: [example.tabs],
  exampleModel: {
    change: {
      key: 'data',
      val: '=..',
      mode: 'assign',
    },
  },
};

export * from './ti-tabs-form-types';
export { TiTabsForm, TiTabsFormInfo };
