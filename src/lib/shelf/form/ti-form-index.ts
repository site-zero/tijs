import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiForm from './TiForm.vue';
import example from './example';

const en_us = {
  'com-name': 'Form',
};
const zh_cn = {
  'com-name': '表单',
};

const COM_TYPE = COM_TYPES.Form;

const TiFormInfo: TiComInfo = {
  icon: 'fas-clipboard-list',
  race: TiComRace.SHELF,
  name: COM_TYPE,
  text: 'i18n:ti-form-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiForm,
  liveStyle: {
    width: '100%',
    height: '100%',
  },
  install: (app: App) => {
    app.component(COM_TYPE, TiForm);
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

export * from './ti-form-types';
export { TiForm, TiFormInfo };
